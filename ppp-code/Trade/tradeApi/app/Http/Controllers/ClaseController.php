<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Clase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ClaseController extends Controller
{
     /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$clase = Clase::all();
		$json = array();
		if(!empty($clase)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($clase),
				"detalles"=>$clase
				
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
	
	public function set_clase_insert(Request $request){
		$denominacion = $request->input("clase");
		$json = array();
		//Recoger datos
        $datos = array( 
            "clase"=>$request->input("clase")            
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'clase' => 'required|string|max:255',				
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

				$validar = DB::table('clase')		
				->where('clase','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$clase = new Clase();
					$clase->clase = $datos["clase"];						
					$clase->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, clase ha sido guardado",
						"detalles"=> $clase                       
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
	public function set_clase_update(Request $request){
		
		$id = $request->input("clase_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "clase"=>$request->input("clase")            
        );

		if(!empty($datos)){         
			$validar = DB::table('clase')		
			->where('clase_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$clase = Clase::where("clase_id", $id)->update($datos);
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

	public function set_clase_delete(Request $request){
        $id = $request->input("clase_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Clase::where("clase_id", $id)->get();
        if(!$validar->count()==0){                     
            $clase = Clase::where("clase_id", $id)->delete();
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

	public function set_clase_cancel(Request $request){
		
		$id = $request->input("clase_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('clase')		
			->where('clase_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Clase::where("clase_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_clase_id($clase_id){
		$json = array();
		
		$clase = DB::table('clase')
		->where('clase_id','=',$clase_id)
		->get();

		if(!empty($clase)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($clase),
				"detalles"=>$clase			    		
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
