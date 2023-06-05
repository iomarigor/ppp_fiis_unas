<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Facturacion;
use App\FacturacionDetalle;
use App\Producto;
use App\Establecimiento;
use App\NotaCredito;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PDF;
use Codedge\Fpdf\Fpdf\Fpdf;
use App\NumerosEnLetras;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class FacturacionController extends Controller
{
    public function index(Request $request){
   			
		$facturacion = DB::table('facturacion as f')
        ->select('f.*',DB::raw('p.razon_social_nombre,p.numero_documento,p.direccion,tm.codigo,tp.tipo_pago,tfp.tipo_forma_pago,c.comprobante_id,c.codigo_sunat,sc.serie_comprobante,ivs.crespuesta_sinfirmado,ivs.crespuesta_firmado,ivs.crespuesta_envio,ivs.mensajeerror,ivs.mensajerespuesta,ivs.tipo_documento'))
        ->join('persona as p','p.persona_id','=','f.persona_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id', '=','f.tipo_moneda_id')
        ->join('tipo_operacion as top','top.tipo_operacion_id','=', 'f.tipo_operacion_id')
        ->join('tipo_pago as tp','tp.tipo_pago_id','=', 'f.tipo_pago_id')
        ->join('tipo_forma_pago as tfp','tfp.tipo_forma_pago_id' ,'=', 'f.tipo_forma_pago_id')        
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'f.serie_comprobante_id')
        ->join('comprobante as c','c.comprobante_id','=', 'sc.comprobante_id')
        ->leftJoin('invoice_sunat as ivs','ivs.idventa','=', 'f.facturacion_id')
        ->orderBy('f.fecha_emision', 'desc')
        ->where('estado_venta','!=',-1)
        ->get();
        /* $facturacionn=[];
        foreach($facturacion as $fac){
            if($fac->tipo_documento==1||$fac->tipo_documento==null){
                array_push($facturacionn,$fac);
            }
        } */
		$json = array();
		if(!empty($facturacion)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($facturacion),
				"detalles"=>$facturacion
				
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

    public function show($idUser){
   			
		$facturacion = DB::table('facturacion as f')
        ->select('f.*',DB::raw('p.razon_social_nombre,p.numero_documento,p.direccion,tm.codigo,tp.tipo_pago,tfp.tipo_forma_pago,c.comprobante_id,c.codigo_sunat,sc.serie_comprobante,ivs.crespuesta_sinfirmado,ivs.crespuesta_firmado,ivs.crespuesta_envio,ivs.mensajeerror,ivs.mensajerespuesta,ivs.tipo_documento'))
        ->join('persona as p','p.persona_id','=','f.persona_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id', '=','f.tipo_moneda_id')
        ->join('tipo_operacion as top','top.tipo_operacion_id','=', 'f.tipo_operacion_id')
        ->join('tipo_pago as tp','tp.tipo_pago_id','=', 'f.tipo_pago_id')
        ->join('tipo_forma_pago as tfp','tfp.tipo_forma_pago_id' ,'=', 'f.tipo_forma_pago_id')        
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'f.serie_comprobante_id')
        ->join('comprobante as c','c.comprobante_id','=', 'sc.comprobante_id')
        ->leftJoin('invoice_sunat as ivs','ivs.idventa','=', 'f.facturacion_id')
        ->orderBy('f.fecha_emision', 'desc')
        ->where([['f.usuario_id','=',$idUser],
        ['estado_venta','!=',-1]])
        ->get();
		$json = array();
		if(!empty($facturacion)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($facturacion),
				"detalles"=>$facturacion
				
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

	public function set_facturacion_insert(Request $request){
        $facturacion = $request->input('facturacion');
        $detalle = $request->input('detalle');
        $idserie = $facturacion['serie_comprobante_id'];
        $correlativo = $facturacion['correlativo'];
       
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
            /* $data=array(
                    "facturacion_id"=>$idfacturacion,
                    "producto_id"=>$value['producto_id'],
                    "unidad_medida_id"=>$value['unidad_medida_id'],
                    "cantidad"=>$value['cantidad'],
                    "precio_unitario"=>$value['precio_unitario'],
                    "descuento"=>$value['descuento'],
                    "tipoprecio"=>$value['tipoprecio'],
                    "tipoimpuesto"=>$value['tipoimpuesto'],
                    "impuestoselectivo"=>$value['impuestoselectivo'],
                    "otroimpuesto"=>$value['otroimpuesto'],
                    "sub_total"=>$value['sub_total'],
                    "pago_id"=>((isset($value['pago_id'])))?$value['pago_id']:null,
                    "pedido_nota_consumo_maestro_id"=>((isset($value['pedido_nota_consumo_maestro_id'])))?$value['pedido_nota_consumo_maestro_id']:null,
                    "proforma_id"=>((isset($value['proforma_id'])))? $value['proforma_id']:null                
            );
            
            DB::table('facturacion_detalle')->insert($data); */
            $fdetalle = new FacturacionDetalle(); 
            $fdetalle->facturacion_id=$idfacturacion;
            $fdetalle->producto_id=$value['producto_id'];
            $fdetalle->unidad_medida_id=$value['unidad_medida_id'];
            $fdetalle->detalle=$value['detalle'];
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
            
            $fdetalle->save();
            //ACTUALIZAR CANTIDAD DE PRODUCTO SI NO ES UN PAGO
                if(!(isset($value['pago_id']))&&!(isset($value['pedido_nota_consumo_maestro_id']))){
                                        //optener el factor de la unidad para caltular la cantidad
                    $factorUnidad=DB::table('unidadmedida_producto')
                    ->where([
                        ['unidad_medida_id','=',$fdetalle->unidad_medida_id],
                        ['producto_id','=',$fdetalle->producto_id]
                    ])
                    ->get();
                    //calcular la cantidad
                    $cantiUnidad=$fdetalle->cantidad*$factorUnidad[0]->cantidad;
                    //actualizar
                    $productAfec=DB::table('producto')
                    ->where('producto_id',$fdetalle->producto_id)->first();
                    if($productAfec->contabilizar==1){
                        DB::table('producto')   
                        ->where('producto_id',$fdetalle->producto_id)
                        ->update(['existencia' => DB::raw('existencia -'.$cantiUnidad)]);
                    }
                }
                

            //ACTUALIZAR ESTADO DE PEDIDO ITEM
            if (isset($value['pedido_nota_consumo_maestro_id'])){
                
                if($value['pedido_nota_consumo_maestro_id'] <> 0){
                    $affected = DB::table('pedido_nota_consumo_maestro_detalle')
                    ->where([
                        ['pedido_nota_consumo_maestro_id','=',$value['pedido_nota_consumo_maestro_id']],
                        ['producto_id','=',$value['producto_id']]
                    ])
                    ->update(['estado_facturacion' => 1]);
                } 
            }
            //ACTUALIZAR ESTADO DE PROFORMA ITEM
            if (isset($value['proforma_id'])){
                if($value['proforma_id'] <> 0){
                    $affected = DB::table('proforma_detalle')
                    ->where([
                        ['id_proforma','=',$value['proforma_id']],
                        ['id_producto','=',$value['producto_id']]
                    ])
                    ->update(['estado_facturacion' => 1]);
                }     
            }
            //ACTUALIZAR ESTADO DE PAGO ITEM
            if (isset($value['pago_id'])){
                if($value['pago_id'] <> 0){
                    $affected = DB::table('pago')
                    ->where('pago_id',$value['pago_id'])
                    ->update(['estado_facturacion' => 1]);
                }     
            }
        }
        $facturacion['facturacion_id']=$idfacturacion;
        $json = array(			    		
            "status"=>200,
            "mensaje"=>"Grabacion exitosa",
            "detalles"=>$facturacion				    	
        );   
						
        return json_encode($json, true);
	}

	public function set_facturacion_update(Request $request){
		
        $facturacion = $request->input('facturacion');
        $idFac = $facturacion['facturacion_id'];

        $detalle = $request->input('detalle');
		//Recoger datos
		$datosFacturacion = array( 
            'fecha_emision'=>$facturacion['fecha_emision'],            
            'persona_id'=>$facturacion['persona_id'],
            'tipo_moneda_id'=>$facturacion['tipo_moneda_id'],            
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
            'observacion'=>$facturacion['observacion']
        );

		if(!empty($datosFacturacion)){         
			$validar = DB::table('facturacion')		
			->where('facturacion_id','=',$idFac)            
			->get();

			if (!$validar->count()==0){
				$factura = Facturacion::where("facturacion_id", $idFac)->update($datosFacturacion);
                //RESTABLECER STOCK
                $facturaDetalleTemp= FacturacionDetalle::where("facturacion_id", $idFac)->get();
                foreach($facturaDetalleTemp as $value){
                    //optener el factor de la unidad para caltular la cantidad
                    $factorUnidad=DB::table('unidadmedida_producto')
                    ->where([
                        ['unidad_medida_id','=',$value['unidad_medida_id']],
                        ['producto_id','=',$value['producto_id']]
                    ])
                    ->get();
                    //calcular la cantidad
                    $cantiUnidad=$value['cantidad']*$factorUnidad[0]->cantidad;
                    //actualizar
                    /* DB::table('producto')
                    ->where('producto_id',$value['producto_id'])
                    ->update(['existencia' => DB::raw('existencia +'.$cantiUnidad)]); */
                }
                //ELIMINAMOS PRIMERO EL DETALLE DE FACTURA
                $facturadetalle = FacturacionDetalle::where("facturacion_id", $idFac)->delete();
                foreach($detalle as $value){
                    $detalle = new FacturacionDetalle(); 
                    $detalle->facturacion_id=$idFac;
                    $detalle->producto_id=$value['producto_id'];
                    $detalle->unidad_medida_id=$value['unidad_medida_id'];
                    $detalle->cantidad=$value['cantidad'];
                    $detalle->detalle=$value['detalle'];
                    $detalle->precio_unitario=$value['precio_unitario'];
                    $detalle->descuento=$value['descuento'];
                    $detalle->tipoprecio=$value['tipoprecio'];
                    $detalle->tipoimpuesto=$value['tipoimpuesto'];
                    $detalle->impuestoselectivo=$value['impuestoselectivo'];
                    $detalle->otroimpuesto=$value['otroimpuesto'];
                    $detalle->sub_total=$value['sub_total'];
                    $detalle->save();
                    //ACTUALIZAR CANTIDAD DE PRODUCTO
                        //optener el factor de la unidad para caltular la cantidad
                        $factorUnidad=DB::table('unidadmedida_producto')
                        ->where([
                            ['unidad_medida_id','=',$detalle->unidad_medida_id],
                            ['producto_id','=',$detalle->producto_id]
                        ])
                        ->get();
                        //calcular la cantidad
                        $cantiUnidad=$detalle->cantidad*$factorUnidad[0]->cantidad;
                        //actualizar
                        /* DB::table('producto')
                        ->where('producto_id',$detalle->producto_id)
                        ->update(['existencia' => DB::raw('existencia -'.$cantiUnidad)]); */
                }

				$json = array(
					"status"=>200,
					"mensaje"=>"Registro exitoso, ha sido actualizado",
					"detalles"=>$datosFacturacion                            
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

    public function get_factura_cabecera_detalle_lista($id){      

       $facturacion = DB::table('facturacion as f')
        ->select('f.*',DB::raw('p.razon_social_nombre,p.numero_documento,p.direccion,p.tipo_documento_id,tm.codigo,tp.tipo_pago,tfp.tipo_forma_pago,c.codigo_sunat,c.comprobante_id,sc.serie_comprobante'))
        ->join('persona as p','p.persona_id','=','f.persona_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id', '=','f.tipo_moneda_id')
        ->join('tipo_operacion as top','top.tipo_operacion_id','=', 'f.tipo_operacion_id')
        ->join('tipo_pago as tp','tp.tipo_pago_id','=', 'f.tipo_pago_id')
        ->join('tipo_forma_pago as tfp','tfp.tipo_forma_pago_id' ,'=', 'f.tipo_forma_pago_id')        
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'f.serie_comprobante_id')
        ->join('comprobante as c','c.comprobante_id','=', 'sc.comprobante_id')
        ->where('f.facturacion_id','=',$id)
        ->get();

        $facturacionDetalle = DB::table('facturacion_detalle as fd')
        ->select('fd.*',DB::raw('p.denominacion,um.abreviatura'))
        ->join('producto as p','p.producto_id','=','fd.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','fd.unidad_medida_id')        
        ->where('fd.facturacion_id','=',$id)
        ->get();

		$json = array();
		if(!empty($facturacion)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($facturacion),
				"detalles"=> array(
                        "factura" => $facturacion,
                        "detalle" => $facturacionDetalle                    )				
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

    public function set_facturacion_anular(Request $request){
		
		$id = $request->input("facturacion_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado_venta"=>$request->input("estado_venta")
        );

		if(!empty($datos)){         
			$validar = DB::table('facturacion')		
			->where('facturacion_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Facturacion::where("facturacion_id", $id)->update(['estado_venta'=>$datos['estado_venta']]);
				$json = array(
					"status"=>200,
					"mensaje"=>($datos['estado_venta']== 1)? 'El registro cambio a Emitido':'El comprobante ha sido Anulado' ,
					"detalles"=> null,
                    "estado" => ($datos['estado_venta']== 1)? 1:0                          
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
    public function get_facturacion_delete($id){
        $json = array();
        $validar = DB::table('facturacion')		
			->where('facturacion_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$factura  = Facturacion::where("facturacion_id", $id)->first();
                Facturacion::where("facturacion_id", $id)->update(['estado_venta'=>-1]);
                $detalleFactura=FacturacionDetalle::where("facturacion_id", $id)->get();
                		
        
                    foreach($detalleFactura as $value){
                        if (isset($value['pedido_nota_consumo_maestro_id'])&& $value['pedido_nota_consumo_maestro_id']!=null){
                            
                            if($value['pedido_nota_consumo_maestro_id'] <> 0){
                                $affected = DB::table('pedido_nota_consumo_maestro_detalle')
                                ->where([
                                    ['pedido_nota_consumo_maestro_id','=',$value['pedido_nota_consumo_maestro_id']],
                                    ['producto_id','=',$value['producto_id']]
                                ])
                                ->update(['estado_facturacion' => 0]);
                            } 
                        }
                        
                        if($factura->reserva_estancia_Id==0){
                            //pedido sin habitacion
                            $factorUnidad=DB::table('unidadmedida_producto')
                            ->where([
                                ['unidad_medida_id','=',$value['unidad_medida_id']],
                                ['producto_id','=',$value['producto_id']]
                            ])
                            ->get();
                            //calcular la cantidad
                            $cantiUnidad=$value['cantidad']*$factorUnidad[0]->cantidad;
                            //actualizar
                            /* DB::table('producto')
                            ->where('producto_id',$value['producto_id'])
                            ->update(['existencia' => DB::raw('existencia +'.$cantiUnidad)]); */
                        }else{
                            //PEDIDO CON FACTURACION
                            if (isset($value['pago_id'])&&$value['pago_id']!=null){
                            if($value['pago_id'] <> 0){
                                $affected = DB::table('pago')
                                ->where('pago_id',$value['pago_id'])
                                ->update(['estado_facturacion' => 0]);
                            }     
                            }
                        }
                        if (isset($value['proforma_id'])&&$value['proforma_id']!=null){
                            if($value['proforma_id'] <> 0){
                                $affected = DB::table('proforma_detalle')
                                ->where([
                                    ['id_proforma','=',$value['proforma_id']],
                                    ['id_producto','=',$value['producto_id']]
                                ])
                                ->update(['estado_facturacion' => 0]);
                            }     
                        }
                    }
                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Factura anulada",
                        "detalles"=>null
                    );
                }else{
                    $json = array(
                        "status"=>400,
                        "mensaje"=>"Factura no tiene items",
                        "detalles"=>null
                    );
                }
			
        return json_encode($json);
    }

    /*IMPRIMIR COMPROBANTES*/
	public function pdf_imprime_comprobante($tipeid,$id){
        //return $idempresa.'-'.$id;
        /*CONSULTA PARA COMPROBANTE FACTURA, BOLETA, NOTA DE VENTA, TICKET*/
        $nota_credito = NotaCredito::where("facturacion_id",$id)->first();

        $facturacion = DB::table('facturacion as f')
        ->select('f.*',DB::raw('p.razon_social_nombre,p.numero_documento,p.direccion,tm.codigo,tp.tipo_pago,tfp.tipo_forma_pago,c.codigo_sunat,c.comprobante_id,sc.serie_comprobante'))
        ->join('persona as p','p.persona_id','=','f.persona_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id', '=','f.tipo_moneda_id')
        ->join('tipo_operacion as top','top.tipo_operacion_id','=', 'f.tipo_operacion_id')
        ->join('tipo_pago as tp','tp.tipo_pago_id','=', 'f.tipo_pago_id')
        ->join('tipo_forma_pago as tfp','tfp.tipo_forma_pago_id' ,'=', 'f.tipo_forma_pago_id')        
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'f.serie_comprobante_id')
        ->join('comprobante as c','c.comprobante_id','=', 'sc.comprobante_id')
        ->where('f.facturacion_id','=',$id)
        ->first();
        /* return json_encode($facturacion); */
        $facturacionDetalle = DB::table('facturacion_detalle as fd')
        ->select('fd.*',DB::raw('p.denominacion,um.abreviatura,ed.descripcion as detalle_encomienda'))
        ->join('producto as p','p.producto_id','=','fd.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','fd.unidad_medida_id')  
        ->leftJoin('encomienda_detalle as ed','ed.id_encomienda_detalle','=','fd.id_encomienda_detalle')      
        ->where('fd.facturacion_id','=',$id)
        ->get();
        //$establecimiento = Establecimiento::where("establecimiento_id",$idempresa)->first();
        $establecimiento = Establecimiento::first();
        $fpdf= new Fpdf('P','mm',array(80,350));
        $fpdf->AddPage();
        $fpdf->Image(public_path('img/logopdf_encomienda.jpg'),15,3,40);
        $fpdf->SetFont('Courier', 'B', 8);
        $textypost=25;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,$establecimiento->nombre_comercial,0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"RUC:".$establecimiento->numero_documento,0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DIRECCIÓN FISCAL:".$establecimiento->direccion_fiscal),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DIRECCIÓN:".$establecimiento->direccion),0,1,"C");

        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->SetFont('Courier', 'B', 11);
        $fpdf->Cell(0,0,(($tipeid==2)? "NOTA DE CREDITO":(($facturacion->codigo_sunat=="03")?"BOLETA DE VENTA ELECTRONICA":"FACTURA ELECTRONICA")),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->SetFont('Courier', 'B', 11);
        if($tipeid==1){
            ///==================Numero de comprobante
            
            $fpdf->Cell(0,0,$facturacion->serie_comprobante.'-'.$facturacion->numero_comprobante,0,1,"C");
        }else{
            ///==================Numero de nota de credito
            $fpdf->Cell(0,0,$nota_credito->iddocumento,0,1,"C");

        }
        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=3;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y', strtotime(explode(' ',$facturacion->fecha_emision)[0])) . str_pad("HORA: " . date("H:i:s", strtotime(explode(' ',$facturacion->fecha_emision)[1])), 17, ' ', STR_PAD_LEFT));
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0, 0, utf8_decode("NOMBRE O RAZóN SOCIAL: ") . str_pad("RUC/DNI:" . utf8_decode($facturacion->numero_documento), 19, ' ', STR_PAD_LEFT));
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode($facturacion->razon_social_nombre));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("DIRECCIÓN: ") . str_split(utf8_decode($facturacion->direccion), 27)[0]);
        $textypost += 4;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("CANT. DESCRIPCIÓN        P. UNIT SUB TOTAL"));
        $textypost += 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 2;
        $count=0;
		$total=0;
		$descontar=0;
		$totalPagar=0;
        foreach($facturacionDetalle as $rM){
            $count++;
            $total+=floatval($rM->sub_total);
            $descontar=$rM->descuento;
            if($rM->detalle_encomienda=="")$rM->detalle_encomienda=$rM->denominacion;
            $fpdf->SetXY(2, $textypost);
            $fpdf->MultiCell(0, 3, '*' . utf8_decode(strtoupper(($rM->producto_id==2)?$rM->detalle_encomienda:$rM->denominacion)).(($rM->detalle!=null && strlen($rM->detalle)>0 )?" - ".utf8_decode(strtoupper($rM->detalle)):""));
            $y3 = $fpdf->GetY();
            $textypost = $y3 + 2;
            $fpdf->SetXY(2, $textypost);
            $fpdf->Cell(0, 0, str_pad(number_format(floatval($rM->cantidad), 2, '.', ','), (8 - strlen(floatval($rM->cantidad))) + strlen(floatval($rM->cantidad)), ' ', STR_PAD_LEFT) . " ".str_pad(utf8_decode($rM->abreviatura), 10, ' ', STR_PAD_LEFT)." " . str_pad(number_format($rM->precio_unitario, 2, '.', ','), 12, ' ', STR_PAD_LEFT) . " " . str_pad(number_format(($rM->sub_total), 2, '.', ','), (9 - strlen(number_format(($rM->sub_total), 2, '.', ','))) + strlen(number_format(($rM->sub_total), 2, '.', ',')), ' ', STR_PAD_LEFT));
            $textypost += 3;
        }
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, "SON: " . NumerosEnLetras::convertir(number_format($facturacion->exoneradas, 2, '.', ','), 'soles',false,'centimos'));
        $y4 = $fpdf->GetY();
        $textypost = $y4 + 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        $fpdf->Cell(0, 0, "OP. EXONERADAS  : S/" . str_pad(number_format($facturacion->exoneradas, 2, '.', ','), (10 - strlen($facturacion->exoneradas)) + strlen($facturacion->exoneradas), ' ', STR_PAD_LEFT));
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        $fpdf->Cell(0, 0, "DESCUENTO       : S/" . str_pad(number_format($facturacion->descuento_global, 2, '.', ','), (10 - strlen($facturacion->descuento_global)) + strlen($facturacion->descuento_global), ' ', STR_PAD_LEFT));
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        //$facturacion->totaligv
        $fpdf->Cell(0, 0, "IGV             : S/" . str_pad(number_format($facturacion->totaligv, 2, '.', ','), (10 - strlen($facturacion->totaligv)) + strlen($facturacion->totaligv), ' ', STR_PAD_LEFT));
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        //$facturacion->totalventas
        $fpdf->Cell(0, 0, "TOTAL A PAGAR   : S/" . str_pad(number_format($facturacion->totalventas, 2, '.', ','), (10 - strlen($facturacion->totalventas)) + strlen($facturacion->totalventas), ' ', STR_PAD_LEFT));
        $textypost += 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
        
        $texto_qr = utf8_decode($establecimiento->nombre_comercial."-".$establecimiento->numero_documento." ").
        "\nFecha/Hora: ".$facturacion->fecha_emision.
        "\nComprobante: ".$facturacion->serie_comprobante.'-'.$facturacion->numero_comprobante.
        "\nTotal: ".$facturacion->totalventas;
        $textypost += 5;
        $fpdf->SetXY(23, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("Representación impresa del comprobante electrónico, esta puede ser consultada en ...."));
        $imageqr=QrCode::format('png')->generate($texto_qr);
        Storage::disk('local')->put("qr_code/qr.png", $imageqr);
        $limageqr=(Storage::path("qr_code/qr.png"));
        $fpdf->Image($limageqr, 5, $textypost, 18, 18);
        $y5 = $fpdf->GetY();
        $textypost = $y5 + 8;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 3;
        $fpdf->SetXY(8, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("BIENES TRANSFERIDOS EN LA AMAZONÍA"), 0, 1, "C");
        $textypost += 3;
        $fpdf->SetXY(9, $textypost);
        $fpdf->Cell(0, 0, "PARA SER CONSUMIDOS EN LA MISMA", 0, 1, "C");
        $textypost += 6;
        $fpdf->SetXY(9, $textypost);
        $fpdf->Cell(0, 0, "GRACIAS POR SU PREFERENCIA...!!", 0, 1, "C");
        $fpdf->SetTitle((($tipeid==2)? "NOTA DE CREDITO":(($facturacion->codigo_sunat=="03")?"BOLETA DE VENTA ELECTRONICA":"FACTURA ELECTRONICA"))." ".($tipeid==1?$facturacion->serie_comprobante.'-'.$facturacion->numero_comprobante:$nota_credito->iddocumento));
        $fpdf->Output();
        exit;       
    }	
}