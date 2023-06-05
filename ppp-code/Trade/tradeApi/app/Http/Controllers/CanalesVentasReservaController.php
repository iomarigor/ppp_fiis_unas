<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CanalesVentasReserva;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CanalesVentasReservaController extends Controller
{
    public function index(Request $request){

    	
    	$json = array(); 
        //AQUI SE GENERA LA CONSULTA
        
        $canales = DB::table('canales_venta_reserva')->get();

        if(!empty($canales)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($canales),
                "detalles"=>$canales			    		
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
