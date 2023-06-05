<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\PedidoNotaConsumoMaestroDetalle;
use App\PedidoNotaConsumoMaestro;
use Illuminate\Support\Facades\Validator;

class PedidoNotaConsumoMaestroDetalleController extends Controller
{
    public function get_pedido_nota_consumo_maestro_Detalle_id($id){

    }
    public function get_list_pedido_nota_consumo_maestro_detalle($pedido_id){
        $json = array(); 
        //AQUI SE GENERA LA CONSULTA
        
        $pedido_detalle = DB::table('pedido_nota_consumo_maestro_detalle as pncmd')       
                ->join('producto as pro', 'pro.producto_id', '=', 'pncmd.producto_id')
                ->join('unidad_medida as um', 'um.unidad_medida_id', '=', 'pncmd.unidad_medida_id')
                ->where('pncmd.pedido_nota_consumo_maestro_id','=',$pedido_id)
                ->select('pncmd.pedido_nota_consumo_maestro_id','pro.producto_id','pro.denominacion','um.abreviatura','pncmd.cantidad','pncmd.precio_unitario','pncmd.precio_unitario',
                'pncmd.sub_total','pncmd.estado_facturacion')
                ->get();

        if(!empty($pedido_detalle)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros ".count($pedido_detalle),
                "detalles"=>$pedido_detalle			    		
            );
            
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"No hay ningún producto registrado",
                "detalles"=>null			    		
            );
        } 
    	return json_encode($json, true);
    }

    public function set_pedido_nota_consumo_maestro_detalle(Request $request){
        $json = array();


        //Recoger datos
        $datos = array( 
            "pedido_nota_consumo_maestro_id"=>$request->input("pedido_nota_consumo_maestro_id"),
            "producto_id"=>$request->input("producto_id"),
            "unidad_medida_id"->$request->input("unidad_medida_id"),            
            "cantidad"=>$request->input("cantidad"),
            "precio_unitario"=>$request->input("precio_unitario"),
            "sub_total"=>$request->input("sub_total"),
            "estado_facturacion"=>$request->input("estado_facturacion")
        );             
        
        if(!empty($datos)){
        
            $validar = DB::table('pedido_nota_consumo_maestro_detalle')		
            ->where('pedido_nota_consumo_maestro_id','=',$datos['pedido_nota_consumo_maestro_id'])
            ->where('producto_id','=',$datos['producto_id'])
            ->get();

            if ($validar->count()==0){
                
                //Validar datos
                $validator = Validator::make($datos, [
                    'producto_id' => 'required'
                ]);
                //Si falla la validación
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $json = array(                    
                        "status"=>400,
                        "mensaje"=>$errors,
                        "detalles"=>null                    
                    );

                
                }else{
                
                    $pedido = new PedidoNotaConsumoMaestroDetalle();
                    $pedido->pedido_nota_consumo_maestro_id =$datos["pedido_nota_consumo_maestro_id"];
                    $pedido->producto_id =  $datos["producto_id"];
                    $pedido->unidad_medida_id = $datos["unidad_medida_id"];
                    $pedido->cantidad = $datos["cantidad"];
                    $pedido->precio_unitario = $datos["precio_unitario"];
                    $pedido->sub_total = $datos["sub_total"];
                    $pedido->estado_facturacion = $datos["estado_facturacion"];
                    $pedido->save();

                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Registro exitoso, su registro ha sido guardado",
                        "detalles"=> $pedido                       
                    );            
                }
            }else{//SE VA ACTUALIZAR EL PRODUCTO AGREGADO AL DETALLE               

                $json = array(
                    "status"=>400,
                    "mensaje"=>"El articulo ya fue agregado.",
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

    public function up_pedido_nota_consumo_maestro_detalle(Request $request){
        
    }

    public function del_pedido_nota_consumo_maestro_detalle(Request $request){
        $pedido_id = $request->input("pedido_nota_consumo_maestro_id");
        $producto_id = $request->input("producto_id");
    	$json = array();
        $validar = PedidoNotaConsumoMaestroDetalle::where([
                    ['pedido_nota_consumo_maestro_id','=', $pedido_id],
                    ['producto_id','=',$producto_id]
        ])->get();
        if(!$validar->count()==0){                     
            $pedido = PedidoNotaConsumoMaestroDetalle::where([
                ['pedido_nota_consumo_maestro_id','=', $pedido_id],
                ['producto_id','=',$producto_id]
            ])->delete();
            $json = array(
                "status"=>200,
                "mensaje"=>"Se ha borrado el registro con éxito",
                "detalles"=>$validar
                
            ); 
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"El regsitro no existe",
                "detalles"=>null
            );            
        }   
    	return json_encode($json, true);
    }
}
