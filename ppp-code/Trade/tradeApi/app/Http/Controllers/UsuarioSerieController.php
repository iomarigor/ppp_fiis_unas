<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UsuarioSerie;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UsuarioSerieController extends Controller
{
    public function index(Request $request){
   			
		$usuario = DB::table('serie_comprobante_usuario as scu')
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=','scu.id_serie_comprobante')
        ->join('users as us','us.id','=','scu.id_usuario')
        ->join('comprobante as co','co.comprobante_id','=','sc.comprobante_id')
        ->select(DB::raw('scu.*,us.username,concat(sc.serie_comprobante) AS serie, co.codigo_sunat,co.descripcion'))
        ->get();
		$json = array();
		if(!empty($usuario)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($usuario),
				"detalles"=>$usuario
				
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

    public function set_usuario_serie_insert(Request $request){
		$idusuario = $request->input("id_usuario");
        $idseriecomprobante = $request->input("id_serie_comprobante");

		$json = array();
		//Recoger datos
        $datos = array( 
            "id_usuario"=>$request->input("id_usuario"),
			"id_serie_comprobante"=>$request->input("id_serie_comprobante")        
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'id_usuario' => 'required',
				'id_serie_comprobante' => 'required'
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

				$validar = DB::table('serie_comprobante_usuario')		
				->where([
                    ['id_usuario','=',$idusuario],
                    ['id_serie_comprobante','=',$idseriecomprobante]
                ])            
				->get();

				if ($validar->count()==0){
					$usuario = new UsuarioSerie();
					$usuario->id_usuario = $datos["id_usuario"];	
					$usuario->id_serie_comprobante = $datos["id_serie_comprobante"]; 
					$usuario->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, usuario serie ha sido guardado",
						"detalles"=> $usuario                       
					); 
				}
				else {
					$json = array(
						"status"=>400,
						"mensaje"=>"El usuario serie que intenta registrar ya existe en la base de datos",
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

	public function set_usuario_serie_delete(Request $request){
        $id = $request->input("id");
    	$json = array();
		
        $validar = UsuarioSerie::where("id", $id)->get();
        if(!$validar->count()==0){                     
            $usuario = UsuarioSerie::where("id", $id)->delete();
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

	public function set_usuario_serie_cancel(Request $request){
		
		$id = $request->input("id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('serie_comprobante_usuario')		
			->where('id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = UsuarioSerie::where("id", $id)->update(['estado'=>$datos['estado']]);
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
}
