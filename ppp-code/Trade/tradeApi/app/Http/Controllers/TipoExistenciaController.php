<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TipoExistencia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TipoExistenciaController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$tipoexistencia = TipoExistencia::all();
		$json = array();
		if(!empty($tipoexistencia)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($tipoexistencia),
				"detalles"=>$tipoexistencia
				
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

	public function set_tipoexistencia_insert(Request $request){
		$denominacion = $request->input("tipo_existencia");
		$json = array();
		//Recoger datos
        $datos = array(
			"codigo"=>$request->input("codigo"),         
            "tipo_existencia"=>$request->input("tipo_existencia")        
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'codigo' => 'string|max:2',
				'tipo_existencia' => 'required|string|max:255'			
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

				$validar = DB::table('tipo_existencia')		
				->where('tipo_existencia','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$tipoexistencia = new TipoExistencia();
					$tipoexistencia->codigo = $datos["codigo"];
					$tipoexistencia->tipo_existencia = $datos["tipo_existencia"];			
					$tipoexistencia->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, subclase ha sido guardado",
						"detalles"=> $tipoexistencia                       
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
	public function set_tipoexistencia_update(Request $request){
		
		$id = $request->input("tipo_existencia_id");
		$json = array();
		//Recoger datos
		$datos = array( 
			"codigo"=>$request->input("codigo"),
            "tipo_existencia"=>$request->input("tipo_existencia")             
        );

		if(!empty($datos)){         
			$validar = DB::table('tipo_existencia')		
			->where('tipo_existencia_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$tipoexistencia = TipoExistencia::where("tipo_existencia_id", $id)->update($datos);
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

	public function set_tipoexistencia_delete(Request $request){
        $id = $request->input("tipo_existencia_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = TipoExistencia::where("tipo_existencia_id", $id)->get();
        if(!$validar->count()==0){                     
            $tipoexistencia = TipoExistencia::where("tipo_existencia_id", $id)->delete();
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

	public function set_tipoexistencia_cancel(Request $request){
		
		$id = $request->input("tipo_existencia_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('tipo_existencia')		
			->where('tipo_existencia_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = TipoExistencia::where("tipo_existencia_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_tipoexistencia_id($tipo_existencia_id){
		$json = array();
		
		$tipoexistencia = DB::table('tipo_existencia')
		->where('tipo_existencia_id','=',$tipo_existencia_id)
		->get();

		if(!empty($tipoexistencia)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($tipoexistencia),
				"detalles"=>$tipoexistencia			    		
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
