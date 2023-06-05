<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TipoPago;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TipoPagoController extends Controller
{
    public function index(Request $request){
   			
		$tipopago = TipoPago::all();
		$json = array();
		if(!empty($tipopago)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($tipopago),
				"detalles"=>$tipopago
				
			);

		}else{

			$json = array(

				"status"=>400,
				"mensaje"=>"No hay ningún tipo pago registrado",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
	}
}
