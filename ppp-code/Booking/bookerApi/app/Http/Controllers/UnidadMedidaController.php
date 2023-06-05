<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\UnidadMedida;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UnidadMedidaController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$unidadmedida = UnidadMedida::all();
		$json = array();
		if(!empty($unidadmedida)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($unidadmedida),
				"detalles"=>$unidadmedida
				
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

	public function set_unidadmedida_insert(Request $request){
		$denominacion = $request->input("unidad_medida");
		$json = array();
		//Recoger datos
        $datos = array( 
            "unidad_medida"=>$request->input("unidad_medida"),
			"abreviatura"=>$request->input("abreviatura"),         
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'unidad_medida' => 'required|string|max:255',
				'abreviatura' => 'required|string|max:255',				
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

				$validar = DB::table('unidad_medida')		
				->where('unidad_medida','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$unidadmedida = new UnidadMedida();
					$unidadmedida->unidad_medida = $datos["unidad_medida"];	
					$unidadmedida->abreviatura = $datos["abreviatura"];		
					$unidadmedida->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, unidad de medida ha sido guardado",
						"detalles"=> $unidadmedida                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La undiad de medida que intenta registrar ya existe en la base de datos",
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
	public function set_unidadmedida_update(Request $request){
		
		$id = $request->input("unidad_medida_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "unidad_medida"=>$request->input("unidad_medida"),
			"abreviatura"=>$request->input("abreviatura")             
        );

		if(!empty($datos)){         
			$validar = DB::table('unidad_medida')		
			->where('unidad_medida_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$unidadmedida = UnidadMedida::where("unidad_medida_id", $id)->update($datos);
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

	public function set_unidadmedida_delete(Request $request){
        $id = $request->input("unidad_medida_id");
    	$json = array();
		
        $validar = UnidadMedida::where("unidad_medida_id", $id)->get();
        if(!$validar->count()==0){                     
            $unidadmedida = UnidadMedida::where("unidad_medida_id", $id)->delete();
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

	public function set_unidadmedida_cancel(Request $request){
		
		$id = $request->input("unidad_medida_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('unidad_medida')		
			->where('unidad_medida_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = UnidadMedida::where("unidad_medida_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_unidadmedida_id($unidad_medida_id){
		$json = array();
		
		$unidadmedida = DB::table('unidad_medida')
		->where('unidad_medida_id','=',$unidad_medida_id)
		->get();

		if(!empty($unidadmedida)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($unidadmedida),
				"detalles"=>$unidadmedida			    		
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
