<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Presentacion;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PresentacionController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$presentacion = Presentacion::all();
		$json = array();
		if(!empty($presentacion)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($presentacion),
				"detalles"=>$presentacion
				
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

	public function set_presentacion_insert(Request $request){
		$denominacion = $request->input("presentacion");
		$json = array();
		//Recoger datos
        $datos = array( 
            "presentacion"=>$request->input("presentacion"),         
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'presentacion' => 'required|string|max:255',				
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

				$validar = DB::table('presentacion')		
				->where('presentacion','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$presentacion = new Presentacion();
					$presentacion->presentacion = $datos["presentacion"];			
					$presentacion->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, subclase ha sido guardado",
						"detalles"=> $presentacion                       
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

	public function set_presentacion_update(Request $request){
		
		$id = $request->input("presentacion_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "presentacion"=>$request->input("presentacion")             
        );

		if(!empty($datos)){         
			$validar = DB::table('presentacion')		
			->where('presentacion_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$presentacion = presentacion::where("presentacion_id", $id)->update($datos);
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

	public function set_presentacion_delete(Request $request){
        $id = $request->input("presentacion_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Presentacion::where("presentacion_id", $id)->get();
        if(!$validar->count()==0){                     
            $presentacion = Presentacion::where("presentacion_id", $id)->delete();
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

	public function set_presentacion_cancel(Request $request){
		
		$id = $request->input("presentacion_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('presentacion')		
			->where('presentacion_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Presentacion::where("presentacion_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_presentacion_id($presentacion_id){
		$json = array();
		
		$presentacion = DB::table('presentacion')
		->where('presentacion_id','=',$presentacion_id)
		->get();

		if(!empty($presentacion)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($presentacion),
				"detalles"=>$presentacion			    		
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
