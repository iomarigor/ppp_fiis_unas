<?php

namespace App\Http\Controllers;
use App\Encomienda;
use App\EncomiendaDetalle;
use App\Establecimiento;
use App\FacturacionDetalle;
use Codedge\Fpdf\Fpdf\Fpdf;
use App\NumerosEnLetras;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class EncomiendaController extends Controller
{
    public function index(Request $request)
    {
        $encomiendas=DB::table('encomienda as e')
        ->select('e.*',DB::raw('sc.serie_comprobante,pr.razon_social_nombre as remitente_nombre,pr.numero_documento as remitente_documento,pc.razon_social_nombre as consignado_nombre,pc.numero_documento as consignado_documento, t.razonsocial as nombretransportista, t.placa as idvehiculo, u.username, esi.sucursal as sucursalinicio, esf.sucursal as sucursalfin'))
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'e.serie_comprobante_id')
        ->join('persona as pr','pr.persona_id','=','e.idremitente')
        ->join('persona as pc','pc.persona_id','=','e.idconsignado')
        ->join('transportista as t','t.idtransportista','=','e.idtransportista')
        ->join('establecimiento_sucursal as esi','esi.establecimiento_sucursal_id','=','e.id_sucursal_inicio')
        ->join('establecimiento_sucursal as esf','esf.establecimiento_sucursal_id','=','e.id_sucursal_fin')
        ->join('users as u','u.id','=','e.idusuario')
        ->orderBy('e.id_encomienda', 'desc')
        ->where('e.estado','!=',-1)
        ->get();
		$json = array();
		if(!empty($encomiendas)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($encomiendas),
				"detalles"=>$encomiendas
				
			);

		}else{

			$json = array(

				"status"=>400,
				"mensaje"=>"No hay ningún encomienda registrado",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
    }
    public function get_encomienda_tracking(Request $request){
        $nroGuia=$request->input('nroGuia');
        $codGuia=$request->input('codGuia');
        $encomienda=DB::table('encomienda as e')
        ->select('e.*',DB::raw('sc.serie_comprobante,pr.razon_social_nombre as remitente_nombre,pr.numero_documento as remitente_documento,pc.razon_social_nombre as consignado_nombre,pc.numero_documento as consignado_documento, t.razonsocial as nombretransportista, t.placa as idvehiculo, u.username, esi.sucursal as sucursalinicio, esf.sucursal as sucursalfin'))
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'e.serie_comprobante_id')
        ->join('persona as pr','pr.persona_id','=','e.idremitente')
        ->join('persona as pc','pc.persona_id','=','e.idconsignado')
        ->join('transportista as t','t.idtransportista','=','e.idtransportista')
        ->join('establecimiento_sucursal as esi','esi.establecimiento_sucursal_id','=','e.id_sucursal_inicio')
        ->join('establecimiento_sucursal as esf','esf.establecimiento_sucursal_id','=','e.id_sucursal_fin')
        ->join('users as u','u.id','=','e.idusuario')
        ->orderBy('e.id_encomienda', 'desc')
        ->where([['e.estado','!=',-1],
        ['e.id_encomienda','=',$nroGuia],
        ['e.codigo','=',$codGuia]
        ])
        ->first();
		$json = array();
		if(!empty($encomienda)){
            $encomienda->clave="----";
			$json = array(

				"status"=>200,
				"mensaje"=>"Encomienda rastreada",
				"detalles"=>$encomienda
				
			);

		}else{

			$json = array(

				"status"=>400,
				"mensaje"=>"El numero de guia: ".$nroGuia." y el codigo de guia ".$codGuia." no coinciden con ninguna encomienda",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
    }
    public function get_encomienda_detalle_lista($idencomienda){
        $json = array();
        $encomienda=Encomienda::where("id_encomienda", $idencomienda)->first();
        $detalle=EncomiendaDetalle::where("id_encomienda", $idencomienda)->get();

        if(!empty($encomienda)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($detalle),
				"detalles"=> array(
                        "encomienda" => $encomienda,
                        "detalle" => $detalle                    
                        )				
			);
		}else{
			$json = array(
				"status"=>400,
				"mensaje"=>"No hay ningún curso registrado",
				"detalles"=>null				
			);

		}

        return json_encode($json, true);
    }
    public function set_encomienda_insert(Request $request){
        $encomienda = $request->input('encomienda');
        $detalle = $request->input('detalle');
        $idserie = $encomienda['serie_comprobante_id'];
        $correlativo = $encomienda['correlativo'];
        
        $encomienda["fecharegistro"]=date("Y-m-d H:i:s");
        $idencomienda = DB::table('encomienda')->insertGetId($encomienda);
        //ACTUALIZAMOS LA SERIE DEL COMPROBANTE
        $affected = DB::table('serie_comprobante')
        ->where('serie_comprobante_id',$idserie)
        ->update(['correlativo' => $correlativo]);
        foreach($detalle as $value){
            $value['id_encomienda']=$idencomienda;
            $valueT=array(
                "id_encomienda"=>$idencomienda,
                "idunidadmedida"=>$value['idunidadmedida'],
                "descripcion"=>$value['descripcion'],
                "cantidad"=>$value['cantidad'],
                "precio"=>$value['precio'],
                "subtotal"=>$value['subtotal']
            );
            DB::table('encomienda_detalle')->insert($valueT);
        }
        $encomienda['id_encomienda']=$idencomienda;
        $json = array(			    		
            "status"=>200,
            "mensaje"=>"Grabacion exitosa",
            "detalles"=>$encomienda				    	
        );   
						
        return json_encode($json, true);
    }
    public function set_encomienda_update(Request $request){
        $encomienda = $request->input('encomienda');
        $idencomienda=$encomienda['id_encomienda'];
        $detalle = $request->input('detalle');
        if(!empty($encomienda)){  
            $validar = DB::table('encomienda')		
			->where('id_encomienda','=',$idencomienda)            
			->get();

			if (!$validar->count()==0){
                Encomienda::where("id_encomienda", $idencomienda)->update($encomienda);
                EncomiendaDetalle::where("id_encomienda", $idencomienda)->delete();
                foreach($detalle as $value){
                    $valueT=array(
                        "id_encomienda"=>$idencomienda,
                        "idunidadmedida"=>$value['idunidadmedida'],
                        "descripcion"=>$value['descripcion'],
                        "cantidad"=>$value['cantidad'],
                        "precio"=>$value['precio'],
                        "subtotal"=>$value['subtotal']
                    );
                    DB::table('encomienda_detalle')->insert($valueT);
                }
                $json = array(
					"status"=>200,
					"mensaje"=>"Registro exitoso, ha sido actualizado",
					"detalles"=>$encomienda                          
				);  
            } else{
				$json = array(
					"status"=>400,
					"mensaje"=>"Los registros no existe",
					"detalles"=>null
				);
			}
        }else{
			$json = array(
				"status"=>400,
				"mensaje"=>"Los registros no pueden estar vacíos",
				"detalles"=>null            
			);
		}
		return json_encode($json, true);
    }
    public function set_encomienda_anular($idencomienda){
        $json = array();
        $validar = DB::table('encomienda')		
			->where('id_encomienda','=',$idencomienda)            
			->get();
            if (!$validar->count()==0){
                Encomienda::where("id_encomienda", $idencomienda)->update(['estado'=>-1]);
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro anulado",
                    "detalles"=>$validar[0]
                );
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Registro no encontrado",
                    "detalles"=>$validar[0]
                );
            }
            return json_encode($json, true);
    }
    public function set_encomienda_estado_update(Request $request){
        $id_encomienda=$request->input('id_encomienda');
        
        $estado=$request->input('estado');
        $id_user=$request->input('id_user');
        $encomienda = DB::table('encomienda')		
			->where('id_encomienda','=',$id_encomienda)            
			->first();
        if($id_user==$encomienda->idusuario){
            if($estado==1 ){
                $affected = DB::table('encomienda')
                ->where('id_encomienda',$id_encomienda)
                ->update(['estado' => $estado,'fechatransporte'=>date("Y-m-d H:i:s")]);
                $json = array(
					"status"=>200,
					"mensaje"=>"Estado actualizado",
					"detalles"=>$encomienda                          
				); 
            }else{
                $json = array(
					"status"=>400,
					"mensaje"=>"La sucursal remitende de puede actualizar el siguiente estado",
					"detalles"=>null                        
				); 
            }
        }else{
            if($estado==2 || $estado==3){
                if($estado==2){
                    $affected = DB::table('encomienda')
                    ->where('id_encomienda',$id_encomienda)
                    ->update(['estado' => $estado, 'fecharecepcion'=>date("Y-m-d H:i:s")]);
                }else{
                    $affected = DB::table('encomienda')
                    ->where('id_encomienda',$id_encomienda)
                    ->update(['estado' => $estado, 'fechaentrega'=>date("Y-m-d H:i:s")]);
                }
                
                $json = array(
					"status"=>200,
					"mensaje"=>"Estado actualizado",
					"detalles"=>$encomienda                          
				); 
            }else{
                $json = array(
					"status"=>400,
					"mensaje"=>"La sucursal destino de puede actualizar el siguiente estado",
					"detalles"=>null                        
				); 
            }
        }
        return json_encode($json, true);
    }
    public function set_facturacion_insert(Request $request){
        $facturacion = $request->input('facturacion');
        $detalle = $request->input('detalle');
        $idserie = $facturacion['serie_comprobante_id'];
        $correlativo = $facturacion['correlativo'];
        $id_encomienda= $facturacion['id_encomienda'];
        $json = array();
        
        $idfacturacion = DB::table('facturacion')->insertGetId([
            'fecha_emision'=>$facturacion['fecha_emision'],            
            'persona_id'=>$facturacion['persona_id'],
            'tipo_moneda_id'=>$facturacion['tipo_moneda_id'],
            'tipo_operacion_id'=>$facturacion['tipo_operacion_id'],
            'tipo_pago_id'=>$facturacion['tipo_pago_id'],
            'tipo_forma_pago_id'=>$facturacion['tipo_forma_pago_id'],            
            'serie_comprobante_id'=>$facturacion['serie_comprobante_id'],
            'numero_comprobante'=>$facturacion['numero_comprobante'],
            'valor_venta'=>$facturacion['valor_venta'],
            'descuento_global'=>$facturacion['descuento_global'],
            'tasa_cambio'=>$facturacion['tasa_cambio'],
            'gravadas'=>$facturacion['gravadas'],
            'exoneradas'=>$facturacion['exoneradas'],
            'inafectas'=>$facturacion['inafectas'],
            'gratuitas'=>$facturacion['gratuitas'],
            'totaligv'=>$facturacion['totaligv'],
            'totalisc'=>$facturacion['totalisc'],
            'totalotrostributos'=>$facturacion['totalotrostributos'],
            'totalventas'=>$facturacion['totalventas'],
            'efectivo'=>$facturacion['efectivo'],
            'vuelto'=>$facturacion['vuelto'],
            'numero_operacion'=>$facturacion['numero_operacion'],            
            'observacion'=>$facturacion['observacion'],
            'reserva_estancia_Id'=>$facturacion['reserva_estancia_Id'],
            'numero_habitacion'=>$facturacion['numero_habitacion'],
            'dias_estancia'=>$facturacion['dias_estancia'],            
            'resumen_diario_id'=>$facturacion['resumen_diario_id'],
            'resumen_diario_anulado_id'=>$facturacion['resumen_diario_anulado_id'],
            'usuario_id'=>$facturacion['usuario_id'],
            'pedido_nota_consumo_maestro_id'=>$facturacion['pedido_nota_consumo_maestro_id'],
            'proforma_id'=>$facturacion['proforma_id'],
            'tipo_venta'=>$facturacion['tipo_venta']          
                        
            ]
        );

        //ACTUALIZAMOS LA SERIE DEL COMPROBANTE
        $affected = DB::table('serie_comprobante')
        ->where('serie_comprobante_id',$idserie)
        ->update(['correlativo' => $correlativo]);       

        //REGISTRAMOS LA O LAS HABITACIONES SELECCIONADAS A LA facturacion
        foreach($detalle as $value){            
            $fdetalle = new FacturacionDetalle(); 
            $fdetalle->facturacion_id=$idfacturacion;
            $fdetalle->producto_id=$value['producto_id'];
            $fdetalle->unidad_medida_id=$value['unidad_medida_id'];
            $fdetalle->cantidad=$value['cantidad'];
            $fdetalle->precio_unitario=$value['precio_unitario'];
            $fdetalle->descuento=$value['descuento'];
            $fdetalle->tipoprecio=$value['tipoprecio'];
            $fdetalle->tipoimpuesto=$value['tipoimpuesto'];
            $fdetalle->impuestoselectivo=$value['impuestoselectivo'];
            $fdetalle->otroimpuesto=$value['otroimpuesto'];
            $fdetalle->sub_total=$value['sub_total'];
            $fdetalle->pago_id=((isset($value['pago_id'])))?$value['pago_id']:null;
            $fdetalle->pedido_nota_consumo_maestro_id=((isset($value['pedido_nota_consumo_maestro_id'])))?$value['pedido_nota_consumo_maestro_id']:null;
            $fdetalle->proforma_id=((isset($value['proforma_id'])))? $value['proforma_id']:null;
            $fdetalle->id_encomienda_detalle=$value['id_encomienda_detalle'];
            
            $fdetalle->save();
        }
        $affected = DB::table('encomienda')
                ->where('id_encomienda',$id_encomienda)
                ->update(['estado_facturacion' => 1]);
        $facturacion['facturacion_id']=$idfacturacion;
        $json = array(			    		
            "status"=>200,
            "mensaje"=>"Grabacion exitosa",
            "detalles"=>$facturacion				    	
        );   
						
        return json_encode($json, true);
	}
    public function get_encomienda_print($idencomienda){
        $encomienda=DB::table('encomienda as e')
        ->select('e.*',DB::raw('sc.serie_comprobante,pr.razon_social_nombre as remitente_nombre,pr.numero_documento as remitente_documento,pc.razon_social_nombre as consignado_nombre,pc.numero_documento as consignado_documento, t.razonsocial as nombretransportista, t.placa as idvehiculo, esi.sucursal as sucursalinicio, esf.sucursal as sucursalfin'))
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'e.serie_comprobante_id')
        ->join('persona as pr','pr.persona_id','=','e.idremitente')
        ->join('persona as pc','pc.persona_id','=','e.idconsignado')
        ->join('establecimiento_sucursal as esi','esi.establecimiento_sucursal_id','=','e.id_sucursal_inicio')
        ->join('establecimiento_sucursal as esf','esf.establecimiento_sucursal_id','=','e.id_sucursal_fin')
        ->join('transportista as t','t.idtransportista','=','e.idtransportista')
        ->where("e.id_encomienda", $idencomienda)->first();
        
        $detalle=DB::table('encomienda_detalle as ed')->where("id_encomienda", $idencomienda)
        ->select('ed.*',DB::raw('um.abreviatura'))
        ->join('unidad_medida as um','um.unidad_medida_id','=','ed.idunidadmedida')
        ->get();
        //return json_encode(["encomienda"=>$encomienda, "detalle"=>$detalle], true);
        $establecimiento = Establecimiento::first();
        $fpdf= new Fpdf('P','mm',array(80,350));
        $fpdf->AddPage();
        $fpdf->Image(public_path('img/logopdf_encomienda.jpg'),15,3,40);
        $fpdf->SetFont('Courier', 'B', 8);
        $textypost=25;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"RUC:".$establecimiento->numero_documento,0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DOMICILIO FISCAL:"),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode($establecimiento->direccion_fiscal),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("TELF:".$establecimiento->telefono),0,1,"C");

        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->SetFont('Courier', 'B', 12);
        $fpdf->Cell(0,0,utf8_decode("CARGO"),0,1,"C");
        $textypost+=5;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode($encomienda->serie_comprobante."-".str_pad($encomienda->correlativo,7,"0",STR_PAD_LEFT)),0,1,"C");
        $textypost+=5;
        $fpdf->SetFont('Courier', '', 12);
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode($encomienda->condicion),0,1,"C");
        $textypost+=5;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode($encomienda->entrega),0,1,"C");
        $textypost+=5;
        $fpdf->SetFont('Courier', 'B', 12);
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode($encomienda->sucursalinicio."-".$encomienda->sucursalfin),0,1,"C");

        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA: ") . date('d/m/Y') . str_pad("HORA: " . date("H:i:s"), 26, ' ', STR_PAD_LEFT));
        $textypost+=4;
        $fpdf->SetFont('Courier', 'B', 12);
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("Remitente:"),0,1,"L");
        $textypost += 4;
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode($encomienda->remitente_nombre),0,1,"L");
        $textypost += 4;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DNI/RUC: ".$encomienda->remitente_documento),0,1,"L");
        $textypost+=4;
        $fpdf->SetFont('Courier', 'B', 12);
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("Consignatario:"),0,1,"L");
        $textypost += 4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0,0,utf8_decode($encomienda->consignado_nombre),0,1,"L");
        $textypost += 4;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DNI/RUC: ".$encomienda->consignado_documento),0,1,"L");
        $textypost+=4;
        $fpdf->SetFont('Courier', 'B', 12);
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("Dirección:"),0,1,"L");
        $textypost += 4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0,0,utf8_decode($encomienda->direccion),0,1,"L");
        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("CANT. DESCRIPCIÓN    U.M.   P.U.   SUB TOTAL"));
        $textypost+=2;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=2;
        $count=0;
        $total=0;
        $totalPagar=0;
        foreach($detalle as $rM){
            $count++;
            $total+=floatval($rM->subtotal);
            $fpdf->SetXY(2, $textypost);
            $fpdf->MultiCell(0, 3, str_pad($count, 2, "0", STR_PAD_LEFT)." ". utf8_decode($rM->descripcion));
            $y3 = $fpdf->GetY();
            $textypost = $y3 + 2;
            $fpdf->SetXY(2, $textypost);
            $fpdf->Cell(0, 0, str_pad(number_format(floatval($rM->cantidad), 2, '.', ','), 10, ' ', STR_PAD_RIGHT) . " ".str_pad(utf8_decode($rM->abreviatura), 13, ' ', STR_PAD_LEFT)." " . str_pad(number_format($rM->precio, 2, '.', ','), 8, ' ', STR_PAD_LEFT) . " " . str_pad(number_format(($rM->precio), 2, '.', ','), 10, ' ', STR_PAD_LEFT));
            $textypost += 3;
        }
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 4;
        $fpdf->SetFont('Courier', 'B', 12);
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0, str_pad("TOTAL:",17,' ',STR_PAD_LEFT).str_pad("S/ ".number_format($total, 2, '.', ','),12,' ',STR_PAD_LEFT));
        $textypost += 4;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0,0,utf8_decode("Observación:"),0,1,"L");
        $textypost += 12;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 6;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("Firma:       _ _ _ _ _ _"),0,1,"L");
        $textypost += 6;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DNI/RUC:     _ _ _ _ _ _"),0,1,"L");
        $textypost += 6;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("Fecha:       _ _ _ _ _ _       _ _ _ _ _ _"),0,1,"L");
        $textypost += 6;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("Hora:        _ _ _ _ _ _          Huella"),0,1,"L");
        $textypost += 4;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 4;
        $fpdf->SetFont('Courier', 'B', 12);
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0,'Recibi conforme',0,1,"C");
        
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 4;
        
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0,'Conductor:',0,1,"L");
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0,utf8_decode(strtoupper($encomienda->nombretransportista) .' - '.$encomienda->idvehiculo),0,1,"L");
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0,utf8_decode("Nro. Guia: ".str_pad(intval($encomienda->id_encomienda),7,"0",STR_PAD_LEFT)."  Código:".strtoupper($encomienda->codigo)),0,1,"L");
        $fpdf->SetTitle("CARGO-".$encomienda->serie_comprobante."-".str_pad($encomienda->correlativo,7,"0",STR_PAD_LEFT));
        $fpdf->Output();
        exit;
    }
}
