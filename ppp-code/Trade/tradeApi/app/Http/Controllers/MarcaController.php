<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Marca;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
class MarcaController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$marca = Marca::all();
		$json = array();
		if(!empty($marca)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($marca),
				"detalles"=>$marca
				
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

	public function set_marca_insert(Request $request){
		$denominacion = $request->input("marca");
		$json = array();
		//Recoger datos
        $datos = array( 
            "marca"=>$request->input("marca"),         
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'marca' => 'required|string|max:255',				
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

				$validar = DB::table('marca')		
				->where('marca','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$marca = new Marca();
					$marca->marca = $datos["marca"];			
					$marca->save();

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
	public function set_marca_update(Request $request){
		
		$id = $request->input("marca_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "marca"=>$request->input("marca")             
        );

		if(!empty($datos)){         
			$validar = DB::table('marca')		
			->where('marca_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$marca = Marca::where("marca_id", $id)->update($datos);
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

	public function set_marca_delete(Request $request){
        $id = $request->input("marca_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Marca::where("marca_id", $id)->get();
        if(!$validar->count()==0){                     
            $marca = Marca::where("marca_id", $id)->delete();
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

	public function set_marca_cancel(Request $request){
		
		$id = $request->input("marca_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('marca')		
			->where('marca_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Marca::where("marca_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_marca_id($marca_id){
		$json = array();
		
		$marca = DB::table('marca')
		->where('marca_id','=',$marca_id)
		->get();

		if(!empty($marca)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($marca),
				"detalles"=>$marca			    		
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
