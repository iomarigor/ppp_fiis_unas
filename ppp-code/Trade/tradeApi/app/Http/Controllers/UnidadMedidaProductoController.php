<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\UnidadMedidaProducto;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UnidadMedidaProductoController extends Controller
{
    public function index(Request $request){
   		$idproducto = $request->input('producto_id');

		$unidadmedidaproducto = DB::table('unidadmedida_producto as ump')
        ->join('unidad_medida as um','um.unidad_medida_id','=','ump.unidad_medida_id')
        ->select('ump.*','um.abreviatura')
        ->where('ump.producto_id','=',$idproducto)
        ->get();
		$json = array();
		if(!empty($unidadmedidaproducto)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($unidadmedidaproducto),
				"detalles"=>$unidadmedidaproducto
				
			);

		}else{

			$json = array(

				"status"=>400,
				"mensaje"=>"No hay ninguna unidad registrada",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
	} 

	public function set_unidadmedida_producto_insert(Request $request){
		$idunidadmedida = $request->input("unidad_medida_id");
        $idproducto = $request->input("producto_id");
		$json = array();
		//Recoger datos
        $datos = array( 
            "unidad_medida_id"=>$request->input("unidad_medida_id"),
			"producto_id"=>$request->input("producto_id"),
            "cantidad"=>$request->input("cantidad"), 
            "preciocompra"=>$request->input("preciocompra"), 
            "preciocosto"=>$request->input("preciocosto"), 
            "utilidad"=>$request->input("utilidad"),          
            "precioventa"=>$request->input("precioventa"), 
            "tasacredito"=>$request->input("tasacredito"), 
            "preciocredito"=>$request->input("preciocredito"), 
            "tasa1"=>$request->input("tasa1"), 
            "precio1"=>$request->input("precio1"), 
            "tasa2"=>$request->input("tasa2"),
            "precio2"=>$request->input("precio2"), 
            "tasa3"=>$request->input("tasa3"), 
            "precio3"=>$request->input("precio3"), 

        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'unidad_medida_id' => 'required',
				'producto_id' => 'required',				
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

				$validar = DB::table('unidadmedida_producto')		
				->where([
                    ['unidad_medida_id','=',$idunidadmedida],
                    ['producto_id','=',$idproducto]
                ])            
				->get();

				if ($validar->count()==0){
					$unidadmedida = new UnidadMedidaProducto();
					$unidadmedida->unidad_medida_id = $datos["unidad_medida_id"];	
					$unidadmedida->producto_id = $datos["producto_id"];
                    $unidadmedida->cantidad = $datos["cantidad"];	
                    $unidadmedida->preciocompra = $datos["preciocompra"];	
                    $unidadmedida->preciocosto = $datos["preciocosto"];			
                    $unidadmedida->utilidad = $datos["utilidad"];	
                    $unidadmedida->precioventa = $datos["precioventa"];	
                    $unidadmedida->tasacredito = $datos["tasacredito"];	
                    $unidadmedida->preciocredito = $datos["preciocredito"];	
                    $unidadmedida->tasa1 = $datos["tasa1"];
                    $unidadmedida->precio1 = $datos["precio1"];	
                    $unidadmedida->tasa2 = $datos["tasa2"];
                    $unidadmedida->precio2 = $datos["precio2"];
                    $unidadmedida->tasa3 = $datos["tasa3"];
                    $unidadmedida->precio3 = $datos["precio3"];
					$unidadmedida->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, unidad de medida ha sido guardado",
						"detalles"=> $unidadmedida                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La undiad de medida que intenta registrar ya existe en la base de datos",
						"detalles"=> $validar                       
					);
				}           
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

	public function set_unidadmedida_producto_update(Request $request){
		
		$idunidadmedida = $request->input("unidad_medida_id");
        $idproducto = $request->input("producto_id");
		$json = array();
		//Recoger datos
        $datos = array(           
            "cantidad"=>$request->input("cantidad"), 
            "preciocompra"=>$request->input("preciocompra"), 
            "preciocosto"=>$request->input("preciocosto"), 
            "utilidad"=>$request->input("utilidad"),          
            "precioventa"=>$request->input("precioventa"), 
            "tasacredito"=>$request->input("tasacredito"), 
            "preciocredito"=>$request->input("preciocredito"), 
            "tasa1"=>$request->input("tasa1"), 
            "precio1"=>$request->input("precio1"), 
            "tasa2"=>$request->input("tasa2"),
            "precio2"=>$request->input("precio2"), 
            "tasa3"=>$request->input("tasa3"), 
            "precio3"=>$request->input("precio3")
        );       

		if(!empty($datos)){         
			$validar = DB::table('unidadmedida_producto')		
				->where([
                    ['unidad_medida_id','=',$idunidadmedida],
                    ['producto_id','=',$idproducto]
                ])            
			->get();


			if (!$validar->count()==0){
				$unidadmedida = UnidadMedidaProducto::where([
                    ['unidad_medida_id','=',$idunidadmedida],
                    ['producto_id','=',$idproducto]
                ])->update($datos);
				$json = array(
					"status"=>200,
					"mensaje"=>"Registro exitoso, ha sido actualizado",
					"detalles"=>$datos                             
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

	public function set_unidadmedida_producto_delete(Request $request){
        $idunidadmedida = $request->input("unidad_medida_id");
        $idproducto = $request->input("producto_id");
    	$json = array();
		
        $validar = UnidadMedidaProducto::where([
            ['unidad_medida_id','=',$idunidadmedida],
            ['producto_id','=',$idproducto]
        ])->get();

        if(!$validar->count()==0){                     
            $unidadmedida = UnidadMedidaProducto::where([
                ['unidad_medida_id','=',$idunidadmedida],
                ['producto_id','=',$idproducto]
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

    public function get_unidadmedida_producto_id($producto_id,$unidad_medida_id){
       
		$json = array();
		
		$unidadmedida = DB::table('unidadmedida_producto')
		->where([
            ['unidad_medida_id','=',$unidad_medida_id],
            ['producto_id','=',$producto_id]
        ])
		->get();

		if(!empty($unidadmedida)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($unidadmedida),
				"detalles"=>$unidadmedida			    		
			);
			return json_encode($json, true);
		}else{
			$json = array(
				"status"=>200,
				"mensaje"=>"No hay ningún curso registrado",
				"detalles"=>null			    		
			);
		}
    	return json_encode($json, true);
	}
}
