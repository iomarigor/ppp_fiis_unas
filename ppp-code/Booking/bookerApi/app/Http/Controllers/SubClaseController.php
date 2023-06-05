<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SubClase;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SubClaseController extends Controller
{
   /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$subclase = SubClase::all();
		$json = array();
		if(!empty($subclase)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($subclase),
				"detalles"=>$subclase
				
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
	
	public function set_subclase_insert(Request $request){
		$denominacion = $request->input("sub_clase");
		$json = array();
		//Recoger datos
        $datos = array( 
            "sub_clase"=>$request->input("sub_clase"),
			"clase_id"=>$request->input("clase_id")           
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'sub_clase' => 'required|string|max:255',				
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

				$validar = DB::table('sub_clase')		
				->where('sub_clase','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$subclase = new SubClase();
					$subclase->sub_clase = $datos["sub_clase"];
					$subclase->clase_id = $datos["clase_id"];				
					$subclase->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, subclase ha sido guardado",
						"detalles"=> $subclase                       
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
	public function set_subclase_update(Request $request){
		
		$id = $request->input("sub_clase_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "sub_clase"=>$request->input("sub_clase"),
			"clase_id"=>$request->input("clase_id")              
        );

		if(!empty($datos)){         
			$validar = DB::table('sub_clase')		
			->where('sub_clase_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$subclase = SubClase::where("sub_clase_id", $id)->update($datos);
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

	public function set_subclase_delete(Request $request){
        $id = $request->input("sub_clase_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = SubClase::where("sub_clase_id", $id)->get();
        if(!$validar->count()==0){                     
            $subclase = SubClase::where("sub_clase_id", $id)->delete();
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

	public function set_subclase_cancel(Request $request){
		
		$id = $request->input("sub_clase_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('sub_clase')		
			->where('sub_clase_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = SubClase::where("sub_clase_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_clase_id($sub_clase_id){
		$json = array();
		
		$subclase = DB::table('sub_clase')
		->where('sub_clase_id','=',$sub_clase_id)
		->get();

		if(!empty($subclase)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($subclase),
				"detalles"=>$subclase			    		
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
