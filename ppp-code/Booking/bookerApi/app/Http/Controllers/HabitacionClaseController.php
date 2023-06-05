<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\HabitacionClase;
use App\Clase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class HabitacionClaseController extends Controller
{
    public function index(Request $request){
   			
		$habitacionclase = HabitacionClase::all();
		$json = array();
		if(!empty($habitacionclase)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($habitacionclase),
				"detalles"=>$habitacionclase
				
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

	public function set_habitacion_clase_insert(Request $request){
		$habitacion_id = $request->input("habitacion_id");
        $clasehabitacionid = $request->input("clase_habitacion_id");
        
		$json = array();
		//Recoger datos
        $datos = array( 
            "habitacion_id"=>$request->input("habitacion_id"),         
            "clase_habitacion_id"=>$request->input("clase_habitacion_id"),
            "principal"=>$request->input("principal")
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'habitacion_id' => 'required',
                'clase_habitacion_id' => 'required',				
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

				$validar = DB::table('habitacion_clase')		
				->where('habitacion_id','=',$habitacion_id)
                ->where('clase_habitacion_id','=',$clasehabitacionid)              
				->get();

				if ($validar->count()==0){
					$habitacionclase = new HabitacionClase();
					$habitacionclase->habitacion_id = $datos["habitacion_id"];
                    $habitacionclase->clase_habitacion_id = $datos["clase_habitacion_id"];
                    $habitacionclase->principal = $datos["principal"];			
					$habitacionclase->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, clase de habitacion ha sido guardado",
						"detalles"=> $habitacionclase                      
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

	public function set_habitacion_clase_delete(Request $request){
        $id = $request->input("habitacion_clase_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = HabitacionClase::where("habitacion_clase_id", $id)->get();
        if(!$validar->count()==0){                     
            $habitacionclase = HabitacionClase::where("habitacion_clase_id", $id)->delete();
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

    public function get_habitacion_clase_id($habitacion_id){
		$json = array();
		
		$habitacionclase = DB::table('habitacion_clase')
        ->join('clase_habitacion','habitacion_clase.clase_habitacion_id','=','clase_habitacion.clase_habitacion_id')
        ->select('habitacion_clase.*','clase_habitacion.clase_habitacion')
		->where('habitacion_clase.habitacion_id','=',$habitacion_id)
		->get();

		if(!empty($habitacionclase)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($habitacionclase),
				"detalles"=>$habitacionclase			    		
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
