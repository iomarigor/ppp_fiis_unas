<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\HabitacionCama;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class HabitacionCamaController extends Controller
{
    public function index(Request $request){
   			
		$habitacioncama = HabitacionCama::all();
		$json = array();
		if(!empty($habitacioncama)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($habitacioncama),
				"detalles"=>$habitacioncama
				
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

	public function set_habitacion_cama_insert(Request $request){
		$habitacion_id = $request->input("habitacion_id");
        $cama_id = $request->input("cama_id");
        
		$json = array();
		//Recoger datos
        $datos = array( 
            "habitacion_id"=>$request->input("habitacion_id"),         
            "cama_id"=>$request->input("cama_id"),
            "cantidad"=>$request->input("cantidad")
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'habitacion_id' => 'required',
                'cama_id' => 'required',				
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

				$validar = DB::table('habitacion_cama')		
				->where('habitacion_id','=',$habitacion_id)
                ->where('cama_id','=',$cama_id)              
				->get();

				if ($validar->count()==0){
					$habitacioncama = new HabitacionCama();
					$habitacioncama->habitacion_id = $datos["habitacion_id"];
                    $habitacioncama->cama_id = $datos["cama_id"];
                    $habitacioncama->cantidad = $datos["cantidad"];			
					$habitacioncama->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, cama de habitacion ha sido guardado",
						"detalles"=> $habitacioncama                      
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La cama que intenta registrar ya existe en la base de datos",
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

	public function set_habitacion_cama_delete(Request $request){
        $id = $request->input("habitacion_cama_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = HabitacionCama::where("habitacion_cama_id", $id)->get();
        if(!$validar->count()==0){                     
            $habitacioncama = HabitacionCama::where("habitacion_cama_id", $id)->delete();
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

	public function get_habitacion_cama_id($habitacion_id){
		$json = array();
		
		$habitacioncama = DB::table('habitacion_cama')
        ->join('cama','habitacion_cama.cama_id','=','cama.cama_id')
        ->select('habitacion_cama.*','cama.cama')
		->where('habitacion_cama.habitacion_id','=',$habitacion_id)
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
