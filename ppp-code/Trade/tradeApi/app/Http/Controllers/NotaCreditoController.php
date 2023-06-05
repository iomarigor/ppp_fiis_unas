<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\NotaCredito;
use App\NotaCreditoDetalle;
use App\Discrepancia;

use App\Facturacion;
use App\FacturacionDetalle;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class NotaCreditoController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$nota = DB::table('nota_credito_debito as n')
        ->select('n.*',DB::raw('ivs.crespuesta_sinfirmado,dsc.descripcion,ivs.crespuesta_firmado,ivs.crespuesta_envio,ivs.mensajeerror,ivs.mensajerespuesta,ivs.tipo_documento,fac.usuario_id'))
        ->leftJoin('tipo_moneda as tm','tm.tipo_moneda_id', '=','n.tipo_moneda_id')
        ->leftJoin('tipo_operacion as top','top.tipo_operacion_id','=', 'n.tipo_operacion_id') 
        ->leftJoin('discrepancias as dsc','dsc.idnota','=', 'n.nota_id') 
        ->leftJoin('facturacion as fac','fac.facturacion_id','=', 'n.facturacion_id')
        ->leftJoin('invoice_sunat as ivs',function($join)
                         {
                             $join->on('ivs.idventa','=', 'n.nota_id');
                             $join->on('ivs.tipo_documento','=',DB::raw(2));
                         })
        ->get();
        $notaa=[];
        foreach($nota as $not){
            $band=true;
            foreach($notaa as $nott){
                if($not->nota_id==$nott->nota_id){
                    $band=false;
                    break;
                }
            }
            if($band){
                array_push($notaa,$not);
            }
        }
		$json = array();
		if(!empty($notaa)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($notaa),
				"detalles"=>$notaa				
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

	public function set_nota_credito_insert(Request $request){
        $nota = $request->input('nota_credito');
        $detalle = $request->input('detalle');
        $idserie = $nota['serie_comprobante_id'];
        $correlativo = $nota['correlativo'];
        $tipodiscrepancia = $nota['tipo'];
        $nroreferencia = $nota['nroreferencia'];
        $desccripcion = $nota['descripcion'];
        $facturacionid =$nota['facturacion_id'];
       
        $json = array();
        $idnota = DB::table('nota_credito_debito')->insertGetId([
            'iddocumento'=>$nota['iddocumento'],            
            'tipodocumento'=>$nota['tipodocumento'],
            'facturacion_id'=>$nota['facturacion_id'],
            'fechaemision' =>$nota['fechaemision'],
            'tipo_moneda_id'=>$nota['tipo_moneda_id'],
            'tipo_operacion_id'=>$nota['tipo_operacion_id'],
            'gravadas'=>$nota['gravadas'],
            'exoneradas'=>$nota['exoneradas'],
            'inafectas'=>$nota['inafectas'],
            'gratuitas'=>$nota['gratuitas'],            
            'descuentoglobal'=>$nota['descuentoglobal'],
            'totaligv'=>$nota['totaligv'],
            'totalisc'=>$nota['totalisc'],
            'totalotrostributos'=>$nota['totalotrostributos'],
            'totalventa'=>$nota['totalventa'],
            'montoletras'=>$nota['montoletras'],
            'idusuario'=>$nota['idusuario']           
            ]
        );
        //REGISTRO DE DISCREPANCIA
        $discrepancia = new Discrepancia();
					$discrepancia->idnota = $idnota;
                    $discrepancia->tipo = $tipodiscrepancia;	
                    $discrepancia->nroreferencia = $nroreferencia;	
                    $discrepancia->descripcion = $desccripcion;				
		$discrepancia->save();         

        //REGISTRAMOS LA O LAS HABITACIONES SELECCIONADAS A LA facturacion
        foreach($detalle as $value){
            $detalle = new NotaCreditoDetalle(); 
            $detalle->nota_id=$idnota;
            $detalle->codigoitem=$value['codigoitem'];
            $detalle->idunidadmedida=$value['idunidadmedida'];
            $detalle->cantidad=$value['cantidad'];
            $detalle->preciounitario=$value['preciounitario'];
            $detalle->preciopreferencial=$value['preciopreferencial'];
            $detalle->descuento=$value['descuento'];
            $detalle->tipoprecio=$value['tipoprecio'];
            $detalle->tipoimpuesto=$value['tipoimpuesto'];
            $detalle->impuesto=$value['impuesto'];
            $detalle->impuestoselectivo=$value['impuestoselectivo'];
            $detalle->otroimpuesto=$value['otroimpuesto'];
            $detalle->totalventa=$value['totalventa'];
            $detalle->save();            
        }

        //ACTUALIZAMOS LA SERIE DEL COMPROBANTE
        $affected = DB::table('serie_comprobante')
        ->where('serie_comprobante_id',$idserie)
        ->update(['correlativo' => $correlativo]);     
       
			
        //ACTUALIZAMOS EL IDNOTA EN FACTURACION
        $affected = DB::table('facturacion')
        ->where('facturacion_id',$facturacionid)
        ->update(['nota_id' => $idnota]); 

        //ACTUALIZAMOS EL IDNOTA EN FACTURACION
        /* $affected = DB::table('invoice_sunat')
        ->where('idventa',$facturacionid)
        ->update(['tipo_documento' => 2]); */ 
        
        $json = array(			    		
            "status"=>200,
            "mensaje"=>"Grabacion exitosa",
            "detalles"=>$nota				    	
        );   
        if($this->get_facturacion_delete($facturacionid)["status"]==400){
            $json = array(			    		
                "status"=>400,
                "mensaje"=>"Error al actualizar unidades",
                "detalles"=>$nota				    	
            );   
        }
        return json_encode($json, true);
	}
    private function get_facturacion_delete($id){
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
                        
                        if($factura->reserva_estancia_Id!=0){
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
			
        return $json;
    }
    
}