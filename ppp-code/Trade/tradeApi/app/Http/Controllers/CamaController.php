<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Cama;

class CamaController extends Controller
{
    public function index(Request $request){

        //AQUI SE GENERA LA CONSULTA
        $cama = DB::table('cama')
        ->select('cama.*')
        ->get();
                    
        if(!empty($cama)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($cama),
                "detalles"=>$cama			    		
            );
            return json_encode($json, true);
        }else{
            $json = array(
                "status"=>200,
                "mensaje"=>"No hay ningún curso registrado",
                "detalles"=>null			    		
            );
        } 	
         
        
        return json_encode($json, true);
    } 
}
