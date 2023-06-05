<?php
namespace App\Http\Controllers;

use App\UsuarioMenus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use JWTAuth;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tymon\JWTAuth\Exceptions\JWTException;

class UsuarioMenusController extends Controller
{
    public function index(Request $request){
        /* $id = $request->input("iduser");
		$menu = UsuarioMenus::where("iduser",$id)->get(); */
        $menu = DB::table("usuario_menus as um")
        ->join("users as u","um.iduser","=","u.id")
        ->join("menu as me","um.idmenus","=","me.menu_id")
        ->select('um.*','u.name as usuario','me.etiqueta as menuEtiqueta','me.menu as menu')
        ->orderBy('um.id', 'desc')
        ->get();
		$json = array();
		if(!empty($menu)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($menu),
				"detalles"=>$menu
				
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
    public function set_usuariomenu_insert(Request $request)
    {
        try {
            
            $json = array();
            $validator = Validator::make($request->all(), [
                'iduser'     => 'required',
                'idmenus'    => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }
            $data=[
                $request->input('iduser'),
                $request->input('idmenus'),
            ];
            $menu = DB::insert("insert into usuario_menus (iduser,idmenus) values (?,?)",$data);
            if ($menu){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro exitoso",
                    "detalles"=>$data                             
                );  			       
            } else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Error al registrar",
                    "detalles"=>null
                );
            }
        } catch (\Exception $e) {
            $json = array(
                "status"=>400,
                "mensaje"=>($e->getCode()=='23000')?"Menu ya fue asignado al usuario":$e->getMessage(),
                "detalles"=>null
            );
        }
        return json_encode($json, true);
    }
    public function set_usuariomenu_update(Request $request){
		
		$id = $request->input("id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "iduser"=>$request->input("iduser"),
            "idmenus"=>$request->input("idmenus")
        );

		if(!empty($datos)){         
			$validar = DB::table('usuario_menus')		
			->where('id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$menu = UsuarioMenus::where("id", $id)->update($datos);
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
    public function set_usuariomenu_delete(Request $request){
        $id = $request->input("id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = UsuarioMenus::where("id", $id)->get();
        if(!$validar->count()==0){                     
            $menu = UsuarioMenus::where("id", $id)->delete();
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
}
?>