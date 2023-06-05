<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Compra;
use App\Compra_Detalle;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    public function index(Request $request){
   			
		$facturacion = DB::table('facturacion as f')
        ->select('f.*',DB::raw('p.razon_social_nombre,p.numero_documento,p.direccion,tm.codigo,tp.tipo_pago,tfp.tipo_forma_pago,c.comprobante_id,c.codigo_sunat,sc.serie_comprobante'))
        ->join('persona as p','p.persona_id','=','f.persona_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id', '=','f.tipo_moneda_id')
        ->join('tipo_operacion as top','top.tipo_operacion_id','=', 'f.tipo_operacion_id')
        ->join('tipo_pago as tp','tp.tipo_pago_id','=', 'f.tipo_pago_id')
        ->join('tipo_forma_pago as tfp','tfp.tipo_forma_pago_id' ,'=', 'f.tipo_forma_pago_id')        
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'f.serie_comprobante_id')
        ->join('comprobante as c','c.comprobante_id','=', 'sc.comprobante_id')
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
            $detalle = new FacturacionDetalle(); 
            $detalle->facturacion_id=$idfacturacion;
            $detalle->producto_id=$value['producto_id'];
            $detalle->unidad_medida_id=$value['unidad_medida_id'];
            $detalle->cantidad=$value['cantidad'];
            $detalle->precio_unitario=$value['precio_unitario'];
            $detalle->descuento=$value['descuento'];
            $detalle->tipoprecio=$value['tipoprecio'];
            $detalle->tipoimpuesto=$value['tipoimpuesto'];
            $detalle->impuestoselectivo=$value['impuestoselectivo'];
            $detalle->otroimpuesto=$value['otroimpuesto'];
            $detalle->sub_total=$value['sub_total'];
            $detalle->save();

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
                //ELIMINAMOS PRIMERO EL DETALLE DE FACTURA
                $facturadetalle = FacturacionDetalle::where("facturacion_id", $idFac)->delete();
                foreach($detalle as $value){
                    $detalle = new FacturacionDetalle(); 
                    $detalle->facturacion_id=$idFac;
                    $detalle->producto_id=$value['producto_id'];
                    $detalle->unidad_medida_id=$value['unidad_medida_id'];
                    $detalle->cantidad=$value['cantidad'];
                    $detalle->precio_unitario=$value['precio_unitario'];
                    $detalle->descuento=$value['descuento'];
                    $detalle->tipoprecio=$value['tipoprecio'];
                    $detalle->tipoimpuesto=$value['tipoimpuesto'];
                    $detalle->impuestoselectivo=$value['impuestoselectivo'];
                    $detalle->otroimpuesto=$value['otroimpuesto'];
                    $detalle->sub_total=$value['sub_total'];
                    $detalle->save();
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
        ->select('f.*',DB::raw('p.razon_social_nombre,p.numero_documento,p.direccion,tm.codigo,tp.tipo_pago,tfp.tipo_forma_pago,c.codigo_sunat,c.comprobante_id,sc.serie_comprobante'))
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
}
