<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TipoHabitacion;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TipoHabitacionController extends Controller
{
    public function index(Request $request){
   			
		$tipohabitacion = TipoHabitacion::all();
		$json = array();
		if(!empty($tipohabitacion)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($tipohabitacion),
				"detalles"=>$tipohabitacion
				
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
