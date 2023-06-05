<?php

namespace App\Http\Controllers;
use App\TipoMoneda;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TipoMonedaController extends Controller
{
    public function index(Request $request){
   			
		$tipomoneda = TipoMoneda::all();
		$json = array();
		if(!empty($tipomoneda)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($tipomoneda),
				"detalles"=>$tipomoneda
				
			);

		}else{

			$json = array(

				"status"=>400,
				"mensaje"=>"No hay ningún tipo moneda registrado",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
	}
	public function get_precio_dollar (){
		//$data = Http::get('https://api.apis.net.pe/v1/tipo-cambio-sunat')->json();
		$url = env('URL_PRICE_DOLLA', 'https://api.apis.net.pe/v1/tipo-cambio-sunat');

		$opts = array(
			'http' => array(
				'method' => "GET"
			)
		);

		$context = stream_context_create($opts);
		$response = file_get_contents($url, false, $context);
		$data = json_decode($response);
		if(!empty($data)){
			$json= array(

				"status"=>200,
				"mensaje"=>"precio de dollar",
				"detalles"=>$data
				
			);
		}else{
			$json = array(

				"status"=>400,
				"mensaje"=>"Error al obtener el precio de dollar",
				"detalles"=>null				
			);
		}
		return json_encode($json, true);
	}
}
