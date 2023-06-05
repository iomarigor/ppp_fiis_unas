<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Servicio;

class ServicioController extends Controller
{
    public function index(Request $request){

        //AQUI SE GENERA LA CONSULTA
        $servicio = DB::table('servicio')
        ->select('servicio.*')
        ->get();
                    
        if(!empty($servicio)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($servicio),
                "detalles"=>$servicio			    		
            );
            return json_encode($json, true);
        }else{
            $json = array(
                "status"=>200,
                "mensaje"=>"No hay ningún servicio registrado",
                "detalles"=>null			    		
            );
        } 	
         
        
        return json_encode($json, true);
    } 
}
