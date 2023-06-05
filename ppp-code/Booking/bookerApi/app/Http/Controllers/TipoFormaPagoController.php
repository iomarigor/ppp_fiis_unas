<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TipoFormaPago;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TipoFormaPagoController extends Controller
{
    public function index(Request $request){
   			
		$tipoformapago = TipoFormaPago::all();
		$json = array();
		if(!empty($tipoformapago)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($tipoformapago),
				"detalles"=>$tipoformapago
				
			);

		}else{

			$json = array(

				"status"=>400,
				"mensaje"=>"No hay ningún forma de pago registrado",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
	}

    public function get_tipo_forma_pago_x_tipo_pago($tipo_pago_id){
		$json = array();
		
		$tipoformapago = DB::table('tipo_forma_pago')
		->where('tipo_pago_id','=',$tipo_pago_id)
		->get();

		if(!empty($tipoformapago)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($tipoformapago),
				"detalles"=>$tipoformapago			    		
			);
			return json_encode($json, true);
		}else{
			$json = array(
				"status"=>200,
				"mensaje"=>"No hay ningún tipo forma de pago registrado",
				"detalles"=>null			    		
			);
		}
    	return json_encode($json, true);
	}
}
