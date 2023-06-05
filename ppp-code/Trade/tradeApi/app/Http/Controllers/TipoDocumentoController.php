<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TipoDocumento;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TipoDocumentoController extends Controller
{
    public function index(Request $request){
   			
		$tipodocumento = TipoDocumento::all();
		$json = array();
		if(!empty($tipodocumento)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($tipodocumento),
				"detalles"=>$tipodocumento
				
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
