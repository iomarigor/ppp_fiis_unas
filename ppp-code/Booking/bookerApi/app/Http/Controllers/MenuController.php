<?php

namespace App\Http\Controllers;

use App\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use JWTAuth;

use Tymon\JWTAuth\Exceptions\JWTException;

class MenuController extends Controller
{
    public function index(Request $request){
   			
		$menu = DB::table("menu as m")
        ->leftJoin("menu as me","m.padre_id","=","me.menu_id")
        ->select('m.*','me.etiqueta as padre')
        ->orderBy('m.menu_id', 'desc')
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
    public function get_menu_padres(Request $request){
        $menu= DB::table('menu as m')
        ->whereNull('m.padre_id')
        ->orderBy('m.orden', 'asc')->get(); 
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
    public function get_menus(Request $request){
        $menu= DB::table('menu as m')
        ->orderBy('m.menu_id', 'asc')->get(); 
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
    public function set_menu_insert(Request $request)
    {
        $json = array();
        $validator = Validator::make($request->all(), [
            'menu'     => 'required|string',
            'etiqueta'    => 'required|string',
            'url'    => 'required|string',
            'icono' => 'required|string',
            'padre_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
        $data=[
            $request->input('menu'),
            $request->input('etiqueta'),
            $request->input('url'),
            $request->input('icono'),
            $request->input('padre_id'),
            $request->input('orden')
        ];
        $menu = DB::insert("insert into menu (menu,etiqueta,url,icono,padre_id,orden) values (?,?,?,?,?,?)",$data);
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
        return json_encode($json, true);
    }
    public function set_menu_update(Request $request){
		
		$id = $request->input("menu_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "menu"=>$request->input("menu"),
            "etiqueta"=>$request->input("etiqueta"),
            "url"=>$request->input("url"),
            "icono"=>$request->input("icono"),
            "padre_id"=>$request->input("padre_id"),
        );

		if(!empty($datos)){         
			$validar = DB::table('menu')		
			->where('menu_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$menu = Menu::where("menu_id", $id)->update($datos);
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
    public function set_menu_delete(Request $request){
        $id = $request->input("menu_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Menu::where("menu_id", $id)->get();
        if(!$validar->count()==0){                     
            $menu = Menu::where("menu_id", $id)->delete();
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