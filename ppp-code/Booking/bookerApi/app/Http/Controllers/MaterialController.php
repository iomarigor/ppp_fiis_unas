<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Material;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MaterialController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$marterial = Material::all();
		$json = array();
		if(!empty($marterial)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($marterial),
				"detalles"=>$marterial
				
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
	public function set_material_insert(Request $request){
		$denominacion = $request->input("material");
		$json = array();
		//Recoger datos
        $datos = array( 
            "material"=>$request->input("material"),         
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'material' => 'required|string|max:255',				
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

				$validar = DB::table('material')		
				->where('material','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$material = new Material();
					$material->material = $datos["material"];			
					$material->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, subclase ha sido guardado",
						"detalles"=> $material                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La clase que intenta registrar ya existe en la base de datos",
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

	public function set_material_update(Request $request){
		
		$id = $request->input("material_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "material"=>$request->input("material")             
        );

		if(!empty($datos)){         
			$validar = DB::table('material')		
			->where('material_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$material = Material::where("material_id", $id)->update($datos);
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

	public function set_material_delete(Request $request){
        $id = $request->input("material_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Material::where("material_id", $id)->get();
        if(!$validar->count()==0){                     
            $marca = Material::where("material_id", $id)->delete();
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

	public function set_material_cancel(Request $request){
		
		$id = $request->input("material_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('material')		
			->where('material_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Material::where("material_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_material_id($material_id){
		$json = array();
		
		$material = DB::table('material')
		->where('material_id','=',$material_id)
		->get();

		if(!empty($material)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($material),
				"detalles"=>$material			    		
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
