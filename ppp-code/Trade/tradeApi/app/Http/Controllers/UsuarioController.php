<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Usuario;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;


class UsuarioController extends Controller
{
    public function index(Request $request){
   			
		$usuario= DB::table('users as u')
        ->select('u.*',DB::raw('es.sucursal, e.nombre_comercial as establecimiento'))
        ->join('establecimiento_sucursal as es','u.sucursal_id','=','es.establecimiento_sucursal_id')
        ->join('establecimiento as e','u.establecimiento_id','e.establecimiento_id')
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

    public function set_usuario_insert(Request $request){
		$username = $request->input("username");
		$json = array();
		//Recoger datos
        $datos = array( 
            "name"=>$request->input("name"),
			"username"=>$request->input("username"),
            "email"=>$request->input("email"),
            "password"=>Hash::make($request->input("password")),
            "rol"=>$request->input("rol"),
            "imagen_perfil"=>$request->input("imagen_perfil"),
            "establecimiento_id"=>$request->input("establecimiento_id"),
            "sucursal_id"=>$request->input("sucursal_id")           
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'name' => 'required|string|max:255',
				'username' => 'required|string|max:255',
                'password' => 'required|string|max:255',			
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

				$validar = DB::table('users')		
				->where('username','=',$username)            
				->get();

				if ($validar->count()==0){
					$usuario = new Usuario();
					$usuario->name = $datos["name"];	
					$usuario->username = $datos["username"];
                    $usuario->email = $datos["email"];
                    $usuario->password = $datos["password"];
                    $usuario->rol = $datos["rol"];		
                    $usuario->imagen_perfil = $datos["imagen_perfil"];
                    $usuario->establecimiento_id = $datos["establecimiento_id"];
                    $usuario->sucursal_id = $datos["sucursal_id"];
					$usuario->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, usuario ha sido guardado",
						"detalles"=> $usuario                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"El usuario que intenta registrar ya existe en la base de datos",
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

	public function set_usuario_update(Request $request){
		
		$id = $request->input("id");
		$pwd = $request->input("password");
		$json = array();
		//Recoger datos
		if($pwd ==''){
			$datos = array( 
				"name"=>$request->input("name"),
				"username"=>$request->input("username"),
				"email"=>$request->input("email"),				
				"rol"=>$request->input("rol"),
				"imagen_perfil"=>$request->input("imagen_perfil"),
				"establecimiento_id"=>$request->input("establecimiento_id"),
				"sucursal_id"=>$request->input("sucursal_id")           
			);  
		}else{
			$datos = array( 
				"name"=>$request->input("name"),
				"username"=>$request->input("username"),
				"email"=>$request->input("email"),
				"password"=>Hash::make($request->input("password")),
				"rol"=>$request->input("rol"),
				"imagen_perfil"=>$request->input("imagen_perfil"),
				"establecimiento_id"=>$request->input("establecimiento_id"),
				"sucursal_id"=>$request->input("sucursal_id")           
			);     
		}

		if(!empty($datos)){         
			$validar = DB::table('users')		
			->where('id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$usuario = Usuario::where("id", $id)->update($datos);
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

	public function set_usuario_delete(Request $request){
        $id = $request->input("id");
    	$json = array();
		
        $validar = Usuario::where("id", $id)->get();
        if(!$validar->count()==0){                     
            $usuario = Usuario::where("id", $id)->delete();
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

	public function set_usuario_cancel(Request $request){
		
		$id = $request->input("id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('users')		
			->where('id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Usuario::where("id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_usuario_id($id){
		$json = array();
		
		$usuario = DB::table('users')
		->where('id','=',$id)
		->get();
	
		if(!empty($usuario)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($usuario),
				"detalles"=>$usuario
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
