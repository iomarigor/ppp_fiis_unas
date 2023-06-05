<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Bancos;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BancosController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){	
    			
		$Bancos = Bancos::all();
	
		if(!empty($Bancos)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros =".count($Bancos),
				"detalles"=>$Bancos
				
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
