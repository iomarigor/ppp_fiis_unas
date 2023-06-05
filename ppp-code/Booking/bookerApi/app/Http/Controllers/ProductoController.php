<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Producto;

class ProductoController extends Controller
{
	public function index(Request $request){
   			
		$producto =  DB::table('producto')
		->orderBy('created_at', 'desc')
		->get();
		$json = array();
		if(!empty($producto)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($producto),
				"detalles"=>$producto
				
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

	public function set_producto_insert(Request $request){
		$denominacion = $request->input("denominacion");
		$json = array();
		//Recoger datos
        $datos = array( 
            "denominacion"=>$request->input("denominacion"),
            "denominacion_corta"=>$request->input("denominacion_corta"),
            "tipo_producto"=>$request->input("tipo_producto"),
            "stock_minimo"=>$request->input("stock_minimo"),
            "existencia"=>$request->input("existencia"),
            "codigo_barra"=>$request->input("codigo_barra"),
            "codigo_fabricante"=>$request->input("codigo_fabricante"),                
            "codigo_producto"=>$request->input("codigo_producto"),           
			"contabilizar"=>$request->input("contabilizar"),
			"inventariar"=>$request->input("inventariar"),
			"clase_id"=>$request->input("clase_id"),
			"sub_clase_id"=>$request->input("sub_clase_id"),
			"marca_id"=>$request->input("marca_id"),
			"material_id"=>$request->input("material_id"),
			"presentacion_id"=>$request->input("presentacion_id"),			
			"tipo_existencia_id"=>$request->input("tipo_existencia_id"),
			"icbper"=>$request->input("icbper"),
			"icbper_importe"=>$request->input("icbper_importe")
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'denominacion' => 'required|string|max:255',
				'denominacion_corta' => 'required|string|max:40'
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

				$validar = DB::table('producto')		
				->where('denominacion','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$producto = new Producto();
					$producto->denominacion = $datos["denominacion"];
					$producto->denominacion_corta =$datos["denominacion_corta"];
					$producto->tipo_producto = $datos["tipo_producto"];
					$producto->stock_minimo = $datos["stock_minimo"];
					$producto->existencia = $datos["existencia"];
					$producto->codigo_barra = $datos["codigo_barra"];
					$producto->codigo_fabricante = $datos["codigo_fabricante"];
					$producto->codigo_producto = $datos["codigo_producto"];					
					$producto->contabilizar = $datos["contabilizar"];
					$producto->inventariar = $datos["inventariar"];
					$producto->clase_id = $datos["clase_id"];
					$producto->sub_clase_id = $datos["sub_clase_id"];
					$producto->marca_id = $datos["marca_id"];
					$producto->material_id = $datos["material_id"];
					$producto->presentacion_id = $datos["presentacion_id"];					
					$producto->tipo_existencia_id = $datos["tipo_existencia_id"];
					$producto->icbper = $datos["icbper"];
					$producto->icbper_importe = $datos["icbper_importe"];

					$producto->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, producto/servicio ha sido guardado",
						"detalles"=> $producto                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"El producto que intenta registrar ya existe en la base de datos",
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
	public function set_producto_update(Request $request){
		
		$id = $request->input("producto_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "denominacion"=>$request->input("denominacion"),
            "denominacion_corta"=>$request->input("denominacion_corta"),
            "tipo_producto"=>$request->input("tipo_producto"),
            "stock_minimo"=>$request->input("stock_minimo"),
            "existencia"=>$request->input("existencia"),
            "codigo_barra"=>$request->input("codigo_barra"),
            "codigo_fabricante"=>$request->input("codigo_fabricante"),                
            "codigo_producto"=>$request->input("codigo_producto"),            
			"contabilizar"=>$request->input("contabilizar"),
			"inventariar"=>$request->input("inventariar"),
			"clase_id"=>$request->input("clase_id"),
			"sub_clase_id"=>$request->input("sub_clase_id"),
			"marca_id"=>$request->input("marca_id"),
			"material_id"=>$request->input("material_id"),
			"presentacion_id"=>$request->input("presentacion_id"),			
			"tipo_existencia_id"=>$request->input("tipo_existencia_id"),
			"icbper"=>$request->input("icbper"),
			"icbper_importe"=>$request->input("icbper_importe")
        );

		if(!empty($datos)){         
			$validar = DB::table('producto')		
			->where('producto_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$producto = Producto::where("producto_id", $id)->update($datos);
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

	public function set_producto_delete(Request $request){
        $id = $request->input("producto_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Producto::where("producto_id", $id)->get();
        if(!$validar->count()==0){                     
            $producto = Producto::where("producto_id", $id)->delete();
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

	public function set_producto_cancel(Request $request){
		
		$id = $request->input("producto_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('producto')		
			->where('producto_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Producto::where("producto_id", $id)->update(['estado'=>$datos['estado']]);
				$json = array(
					"status"=>200,
					"mensaje"=>($datos['estado']== 1)? 'El registro ha sido Activado':'El registro ha sido Anulado' ,
					"detalles"=>$affected                             
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

	public function get_producto_id($producto_id){
		$json = array();
		
		$producto = DB::table('producto')
		->where('producto_id','=',$producto_id)
		->get();

		if(!empty($producto)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($producto),
				"detalles"=>$producto			    		
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

    public function get_lista_producto(Request $request){
        $json = array(); 	
   		
		//AQUI SE GENERA LA CONSULTA
		$producto = DB::table('producto as pro')			
		->where('pro.denominacion','like','%'.strtoupper($request->get("param")).'%')
		->get();   		

		if(!empty($producto)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($producto),
				"detalles"=>$producto			    		
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
