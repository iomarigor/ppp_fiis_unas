<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Habitacion;
use App\Usuario;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
class HabitacionController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
    	$json = array(); 	
    			
    			$habitacion = DB::table("habitacion")
		->where('habitacion.estado','!=',-1) 
		->get(); 
    		
		    	if(!empty($habitacion)){

			    	$json = array(

			    		"status"=>200,
			    		"mensaje"=>"total_registros =".count($habitacion),
			    		"detalles"=>$habitacion
			    		
			    	);

			    	return json_encode($json, true);

			    }else{

			    	$json = array(

			    		"status"=>400,
			    		"mensaje"=>"No hay ningún curso registrado",
			    		"detalles"=>null
			    		
			    	);

			    }
    	return json_encode($json, true);
    } 

	public function set_habitacion_insert(Request $request){
		$numerohabitacion = $request->input("numero_habitacion");
		$json = array();
		//Recoger datos
        $datos = array( 
            
			"ubicacion_id"=>$request->input("ubicacion_id"),
			"numero_habitacion"=>$request->input("numero_habitacion"),
			"cantidad_personas"=>$request->input("cantidad_personas"),
			"cantidad_ninos"=>$request->input("cantidad_ninos"),
			"area"=>$request->input("area")         
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'numero_habitacion' => 'required|string|max:255',				
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

				$validar = DB::table('habitacion')		
				->where('numero_habitacion','=',$numerohabitacion)            
				->get();

				if ($validar->count()==0){
					$habitacion = new Habitacion();
					$habitacion->ubicacion_id = $datos["ubicacion_id"];	
					$habitacion->numero_habitacion = $datos["numero_habitacion"];
					$habitacion->cantidad_personas = $datos["cantidad_personas"];
					$habitacion->cantidad_ninos = $datos["cantidad_ninos"];
					$habitacion->area = $datos["area"];		
					$habitacion->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, subclase ha sido guardado",
						"detalles"=> $marca                       
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

	public function set_habitacion_update(Request $request){
		
		$id = $request->input("habitacion_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "ubicacion_id"=>$request->input("ubicacion_id"),
			"numero_habitacion"=>$request->input("numero_habitacion"),
			"cantidad_personas"=>$request->input("cantidad_personas"),
			"cantidad_ninos"=>$request->input("cantidad_ninos"),
			"area"=>$request->input("area")           
        );

		if(!empty($datos)){         
			$validar = DB::table('habitacion')		
			->where('habitacion_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$habitacion = Habitacion::where("habitacion_id", $id)->update($datos);
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

	public function set_habitacion_delete(Request $request){
        $id = $request->input("habitacion_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Habitacion::where("habitacion_id", $id)->get();
        if(!$validar->count()==0){                     
            $marca = Habitacion::where("habitacion_id", $id)->update(['estado'=>-1]);
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

	public function set_habitacion_cancel(Request $request){
		
		$id = $request->input("habitacion_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('habitacion')		
			->where('habitacion_id','=',$id)            
			->get();
			$estado='';
			if (!$validar->count()==0){
				$affected  = Habitacion::where("habitacion_id", $id)->update(['estado'=>$datos['estado']]);
				switch($datos['estado']){
					case 1: 
						$estado = 'Activado';
						break;
					case 2: 
						$estado	= 'Inactivo';
						break;
					case 3: $estado = 'En mantenimiento';
						break;
				}
				$json = array(
					"status"=>200,
					"mensaje"=>'Se cambio de estado a  '. $estado,
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

	public function get_habitacion_id($habitacion_id){
		$json = array();
		
		$habitacion = DB::table('habitacion')
		->where('habitacion_id','=',$habitacion_id)
		->get();

		if(!empty($habitacion)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($habitacion),
				"detalles"=>$habitacion			    		
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