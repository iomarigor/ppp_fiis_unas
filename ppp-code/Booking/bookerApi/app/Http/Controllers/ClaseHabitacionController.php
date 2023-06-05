<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ClaseHabitacion;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class ClaseHabitacionController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/
    public function index(Request $request){
   			
		$clase = DB::table("clase_habitacion as ch")
         ->leftJoin('tipo_habitacion as th','th.tipo_habitacion_id','=','ch.tipo_habitacion_id')
         ->select('ch.*','th.tipo_habitacion')
		->where('ch.estado','!=',-1) 
		->get();  
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
	
	public function set_claseHabitacion_insert(Request $request){
		$denominacion = $request->input("clase_habitacion");
		$tarifa_publicada = $request->input("tarifa_publicada");
		$tarifa_corporativa = $request->input("tarifa_corporativa");
		$tipo_habitacion_id = $request->input("tipo_habitacion_id");
		$json = array();
		//Recoger datos
        $datos = array( 
            "clase_habitacion"=>$request->input("clase_habitacion"),  
			"tarifa_publicada" =>$request->input("tarifa_publicada") ,
			"tarifa_corporativa" =>$request->input("tarifa_corporativa"), 
			"tipo_habitacion_id" =>$request->input("tipo_habitacion_id")         
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'clase_habitacion' => 'required|string|max:255',				
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

				$validar = DB::table('clase_habitacion')		
				->where('clase_habitacion','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$clase = new ClaseHabitacion();
					$clase->clase_habitacion = $datos["clase_habitacion"];	
					$clase->tarifa_publicada = $datos["tarifa_publicada"];	
					$clase->tarifa_corporativa = $datos["tarifa_corporativa"];	
					$clase->tipo_habitacion_id = $datos["tipo_habitacion_id"];						
					$clase->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, clase de habitacion ha sido guardado",
						"detalles"=> $clase                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La clase habitacion que intenta registrar ya existe en la base de datos",
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
	public function set_claseHabitacion_update(Request $request){
		
		$id = $request->input("clase_habitacion_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "clase_habitacion"=>$request->input("clase_habitacion"),
			"tarifa_publicada"=>$request->input("tarifa_publicada"),
			"tarifa_corporativa"=>$request->input("tarifa_corporativa"),
			"tipo_habitacion_id"=>$request->input("tipo_habitacion_id")          
        );

		if(!empty($datos)){         
			$validar = DB::table('clase_habitacion')		
			->where('clase_habitacion_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$clase = ClaseHabitacion::where("clase_habitacion_id", $id)->update($datos);
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

	public function set_claseHabitacion_delete(Request $request){
        $id = $request->input("clase_habitacion_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = ClaseHabitacion::where("clase_habitacion_id", $id)->get();
        if(!$validar->count()==0){                     
            $clase = ClaseHabitacion::where("clase_habitacion_id", $id)->update(['estado'=>-1]);
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

	public function set_claseHabitacion_cancel(Request $request){
		
		$id = $request->input("clase_habitacion_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('clase_habitacion')		
			->where('clase_habitacion_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Clase::where("clase_habitacion_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_claseHabitacion_id($clase_id){
		$json = array();
		
		$clase = DB::table('clase_habitacion')
		->where('clase_habitacion_id','=',$clase_id)
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