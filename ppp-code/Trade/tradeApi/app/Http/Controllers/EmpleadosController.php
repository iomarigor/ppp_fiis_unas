<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Empleados;

class EmpleadosController extends Controller
{
      /*=============================================
    Mostrar todos los registros
    =============================================*/
    public function index(Request $request){

        //AQUI SE GENERA LA CONSULTA
        $empleado = DB::table('empleado')
        ->select('empleado.*')
        ->get();
                    
        if(!empty($empleado)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($empleado),
                "detalles"=>$empleado			    		
            );
            return json_encode($json, true);
        }else{
            $json = array(
                "status"=>200,
                "mensaje"=>"No hay ningún empleado registrado",
                "detalles"=>null			    		
            );
        } 	
         
        
    return json_encode($json, true);
    }
}
