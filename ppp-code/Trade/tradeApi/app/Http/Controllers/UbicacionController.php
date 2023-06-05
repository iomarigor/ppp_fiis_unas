<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ubicacion;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UbicacionController extends Controller
{
    public function index(Request $request){
   			
		$ubicacion = Ubicacion::all();
		$json = array();
		if(!empty($ubicacion)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($ubicacion),
				"detalles"=>$ubicacion
				
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
}
