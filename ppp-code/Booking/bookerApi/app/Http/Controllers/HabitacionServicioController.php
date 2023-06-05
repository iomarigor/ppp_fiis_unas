<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\HabitacionServicio;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class HabitacionServicioController extends Controller
{
    public function index(Request $request){
   			
		$habitacionservicio = HabitacionServicio::all();
		$json = array();
		if(!empty($habitacionservicio)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($habitacionservicio),
				"detalles"=>$habitacionservicio
				
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

	public function set_habitacion_servicio_insert(Request $request){
		$habitacion_id = $request->input("habitacion_id");
        $servicio_id = $request->input("servicio_id");
		$json = array();
		//Recoger datos
        $datos = array( 
            "habitacion_id"=>$request->input("habitacion_id"),         
            "servicio_id"=>$request->input("servicio_id")
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'habitacion_id' => 'required',
                'servicio_id' => 'required',				
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

				$validar = DB::table('habitacion_servicio')		
				->where('habitacion_id','=',$habitacion_id)
                ->where('servicio_id','=',$servicio_id)              
				->get();

				if ($validar->count()==0){
					$habitacionservicio = new HabitacionServicio();
					$habitacionservicio->habitacion_id = $datos["habitacion_id"];
                    $habitacionservicio->servicio_id = $datos["servicio_id"];			
					$habitacionservicio->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, servicio de habitacion ha sido guardado",
						"detalles"=> $habitacionservicio                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"El servicio que intenta registrar ya existe en la base de datos",
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

	public function set_habitacion_servicio_delete(Request $request){
        $id = $request->input("habitacion_servicio_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = HabitacionServicio::where("habitacion_servicio_id", $id)->get();
        if(!$validar->count()==0){                     
            $habitacioncama = HabitacionServicio::where("habitacion_servicio_id", $id)->delete();
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
	
	public function get_habitacion_servicio_id($habitacion_id){
		$json = array();
		
		$habitacioncama = DB::table('habitacion_servicio')
        ->join('servicio','habitacion_servicio.servicio_id','=','servicio.servicio_id')
        ->select('habitacion_servicio.*','servicio.servicio')
		->where('habitacion_servicio.habitacion_id','=',$habitacion_id)
		->get();

		if(!empty($habitacioncama)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($habitacioncama),
				"detalles"=>$habitacioncama			    		
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