<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\PaquetesTuristicos;

class PaquetesTuristicosController extends Controller
{
     /*=============================================
    Mostrar todos los registros
    =============================================*/
    public function index(Request $request){

        //AQUI SE GENERA LA CONSULTA
        $paquetes = DB::table('paquetes_turisticos')
        ->select('paquetes_turisticos.*')
        ->get();
                    
        if(!empty($paquetes)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($paquetes),
                "detalles"=>$paquetes			    		
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

    public function set_paquete_turs_insert(Request $request){
		$denominacion = $request->input("descripcion");
		$json = array();
		//Recoger datos
        $datos = array( 
            "descripcion"=>$request->input("descripcion"),         
            "numero_personas"=>$request->input("numero_personas"),
            "tipo_habitacion_id"=>$request->input("tipo_habitacion_id"),
            "numero_noches"=>$request->input("numero_noches"),
            "lugares"=>$request->input("lugares"),
            "tarifa"=>$request->input("tarifa")

        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'descripcion' => 'required|string|max:255',				
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

				$validar = DB::table('paquetes_turisticos')		
				->where('descripcion','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$paquetesturisticos = new PaquetesTuristicos();
					$paquetesturisticos->descripcion = $datos["descripcion"];
                    $paquetesturisticos->numero_personas = $datos["numero_personas"];
                    $paquetesturisticos->tipo_habitacion_id = $datos["tipo_habitacion_id"];
                    $paquetesturisticos->numero_noches = $datos["numero_noches"];
                    $paquetesturisticos->lugares = $datos["lugares"];
                    $paquetesturisticos->tarifa = $datos["tarifa"];			
					$paquetesturisticos->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, paquete turistico ha sido guardado",
						"detalles"=> $paquetesturisticos                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"El paquete que intenta registrar ya existe en la base de datos",
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
	public function set_paquete_turs_update(Request $request){
		
		$id = $request->input("paquete_turisticos_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "descripcion"=>$request->input("descripcion"),
            "numero_personas"=>$request->input("numero_personas"),
            "tipo_habitacion_id"=>$request->input("tipo_habitacion_id"),
            "numero_noches"=>$request->input("numero_noches"),
            "lugares"=>$request->input("lugares"),
            "tarifa"=>$request->input("tarifa")
        );

		if(!empty($datos)){         
			$validar = DB::table('paquetes_turisticos')		
			->where('paquete_turisticos_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$paquetesturisticos = PaquetesTuristicos::where("paquete_turisticos_id", $id)->update($datos);
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

	public function set_paquete_turs_delete(Request $request){
        $id = $request->input("paquete_turisticos_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = PaquetesTuristicos::where("paquete_turisticos_id", $id)->get();
        if(!$validar->count()==0){                     
            $paquetesturisticos = PaquetesTuristicos::where("paquete_turisticos_id", $id)->delete();
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

	public function set_paquete_turs_cancel(Request $request){
		
		$id = $request->input("paquete_turisticos_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('paquetes_turisticos')		
			->where('paquete_turisticos_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = PaquetesTuristicos::where("paquete_turisticos_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_paquete_turs_id($paquete_turisticos_id){
		$json = array();
		
		$paquetesturisticos = DB::table('paquete_turisticos')
		->where('paquete_turisticos_id','=',$paquete_turisticos_id)
		->get();

		if(!empty($paquetesturisticos)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($paquetesturisticos),
				"detalles"=>$paquetesturisticos			    		
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
