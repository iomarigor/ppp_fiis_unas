<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\ReservaEstanciaVuelo;

class ReservaEstanciaVueloController extends Controller
{
    public function index(Request $request){

    	
    	$json = array(); 
        //AQUI SE GENERA LA CONSULTA
        
        $vuelo = DB::table('reserva_estancia_vuelo')->get();

        if(!empty($vuelo)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($vuelo),
                "detalles"=>$vuelo			    		
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

    public function registra_vuelo_reserva(Request $request){
    
    	$json = array();

        //Recoger datos
        $datos = array( 						
            "aereolinea"=>$request->input("aereolinea"),
			"numero_vuelo"=>$request->input("numero_vuelo"),
			"reserva_estancia_id"=>$request->input("reserva_estancia_id")            
    	);             
        
        if(!empty($datos)){
            //validamos si existe ya la vuelo agregado a la estancia
            $validar = DB::table('reserva_estancia_vuelo')		
            ->where('reserva_estancia_id','=',$datos['reserva_estancia_id'])
            ->where('numero_vuelo','=',$datos['numero_vuelo'])
            ->where('aereolinea','=',$datos['aereolinea'])
            ->get();

            if ($validar->count()==0){

                //Validar datos
                $validator = Validator::make($datos, [
                    'reserva_estancia_id' => 'required',
                    'aereolinea' => 'required',
                ]);
                //Si falla la validación
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $json = array(                    
                        "status"=>404,
                        "mensaje"=>$errors,
                        "detalles"=>null                   
                    );

                    
                }else{
                    $vuelo = new ReservaEstanciaVuelo();                   
                    $vuelo->aereolinea = $datos["aereolinea"];
                    $vuelo->numero_vuelo = $datos["numero_vuelo"];
                    $vuelo->reserva_estancia_id = $datos["reserva_estancia_id"];              
                    
                    $vuelo->save();

                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Registro exitoso, la vuelo ha sido guardado",
                        "detalles"=>$vuelo                     
                    );            
                }
                }else{
                    $json = array(
                    "status"=>400,
                    "mensaje"=>"Ya existe un registro con los datos que intenta ingresar",
                    "detalles"=>null                
                ); 
                }
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Los registros no pueden estar vacíos",
                    "detalles"=>null               
                );			
            }        
        return json_encode($json, true);
    }

    public function actualiza_vuelo_reserva(Request $request){
    	$id = $request->input("reserva_estancia_vuelo_id");
    	$json = array();
        //Recoger datos
        $datos = array( "aereolinea"=>$request->input("aereolinea"),
                        "numero_vuelo"=>$request->input("numero_vuelo"),
                        "reserva_estancia_id"=>$request->input("reserva_estancia_id")
        );

        if(!empty($datos)){         
            $validar = DB::table('reserva_estancia_vuelo')		
            ->where('reserva_estancia_vuelo_id','=',$id)            
            ->get();

            if (!$validar->count()==0){
                $vuelo = ReservaEstanciaVuelo::where("reserva_estancia_vuelo_id", $id)->update($datos);
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro exitoso, ha sido actualizado",
                    "detalles"=>$datos                                  
                );  			       
            } else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Los registros no existe",
                    "detalles"=>null
                );
            }

        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"Los registros no pueden estar vacíos",
                "detalles"=>null            
            );
        }
    	return json_encode($json, true);

    }

    public function delete_vuelo_reserva(Request $request){
        $id = $request->input("reserva_estancia_vuelo_id");
    	$json = array();
        $validar = ReservaEstanciaVuelo::where("reserva_estancia_vuelo_id", $id)->get();
        if(!$validar->count()==0){                     
            $vuelo = ReservaEstanciaVuelo::where("reserva_estancia_vuelo_id", $id)->delete();
            $json = array(
                "status"=>200,
                "mensaje"=>"Se ha borrado el registro con éxito",
                "detalles"=>$validar
                
            ); 
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"El regsitro no existe",
                "detalles"=>null
            );            
        }   
    	return json_encode($json, true);
    }

    public function mostrar_vuelos_reserva($id){
             //AQUI SE GENERA LA CONSULTA
             $reserva_id=$id;
             $reserva = DB::table('reserva_estancia_vuelo')
             ->where('reserva_estancia_id',$reserva_id)
             ->get();
                         
             if(!$reserva->count()==0){
                 $json = array(
                     "status"=>200,
                     "mensaje"=>"total_registros =".count($reserva),
                     "detalles"=>$reserva			    		
                 );
                 return json_encode($json, true);
             }else{
                 $json = array(
                     "status"=>400,
                     "mensaje" => "no hay nada",
                     "detalles"=>null		    		
                 );
             } 	
                  
                 
         return json_encode($json, true);
    }
}
