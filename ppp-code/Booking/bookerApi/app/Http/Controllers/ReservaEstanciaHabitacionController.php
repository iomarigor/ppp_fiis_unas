<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\ReservaEstanciaHabitacion;

class ReservaEstanciaHabitacionController extends Controller
{
    public function index(Request $request){

    	
    	$json = array(); 
        //AQUI SE GENERA LA CONSULTA
        $habitacion = ReservaEstanciaHabitacion::all();   		
        if(!empty($habitacion)){
            $json = array(
                "status"=>200,
                "mensaje"=>"Se encontraron registros",
                "detalles"=>$habitacion			    		
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

    public function store(Request $request){
    
    	$json = array();

        //Recoger datos
        $datos = array( 
			"habitacion_id"=>$request->input("habitacion_id"),
			"reserva_estancia_id"=>$request->input("reserva_estancia_id"),
			"clase_habitacion_id"=>$request->input("clase_habitacion_id"),
			"tipo_tarifa"=>$request->input("tipo_tarifa"),			
            "tarifa"=>$request->input("tarifa"), 
            "estado"=>$request->input("estado"),               
			"estado_facturacion"=>$request->input("estado_facturacion"),            
            "late_checkout"=>$request->input("late_checkout"),
            "early_checkin"=>$request->input("early_checkin")
    	);             
        
        if(!empty($datos)){
            //validamos si existe ya la habitacion agregado a la estancia
            $habitacion = DB::table('reserva_estancia_habitacion')		
            ->where('reserva_estancia_id','=',$datos['reserva_estancia_id'])
            ->orWhere('habitacion_id','=',$datos['habitacion_id'])
            ->get();

            if ($habitacion->count()==0){

                //Validar datos
                $validator = Validator::make($datos, [
                    'reserva_estancia_id' => 'required',
                    'habitacion_id' => 'required',
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
                    
                    $habitacion = new ReservaEstanciahabitacion();
                    $habitacion->habitacion_id =$datos["habitacion_id"];
                    $habitacion->reserva_estancia_id = $datos["reserva_estancia_id"];
                    $habitacion->clase_habitacion_id = $datos["clase_habitacion_id"];
                    $habitacion->tipo_tarifa = $datos["tipo_tarifa"];
                    $habitacion->tarifa = $datos["tarifa"];
                    $habitacion->estado = $datos["estado"];
                    $habitacion->estado_facturacion = $datos["estado_facturacion"];
                    $habitacion->late_checkout = $datos["late_checkout"];
                    $habitacion->early_checkin = $datos["early_checkin"];
                    
                    $habitacion->save();

                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Registro exitoso, la habitacion ha sido guardado",
                        "detalles"=>$habitacion                     
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

    public function update($id, Request $request){
    	
    	$json = array();
        //Recoger datos
        $datos = array( "clase_habitacion_id"=>$request->input("clase_habitacion_id"),
                        "tipo_tarifa"=>$request->input("tipo_tarifa"),
                        "tarifa"=>$request->input("tarifa"),
                        "late_checkout"=>$request->input("late_checkout"),
                        "early_checkin"=>$request->input("early_checkin"));

        if(!empty($datos)){
            //Validar datos
            $validator = Validator::make($datos, [
                'clase_habitacion_id' => 'required',
                'tipo_tarifa' => 'required',
                'tarifa' => 'required|numeric',
            ]);

            //Si falla la validación

            if ($validator->fails()) {
                $errors = $validator->errors();
                $json = array(                
                    "status"=>400,
                    "mensaje"=>$errors,
                    "detalles"=>null
                );            

            }else{            
                
                $datos = array("clase_habitacion_id"=>$datos["clase_habitacion_id"],
                                "tipo_tarifa"=>$datos["tipo_tarifa"],
                                "tarifa"=>$datos["tarifa"],
                                "late_checkout"=>$datos["late_checkout"],
                                "early_checkin"=>$datos["early_checkin"]);
                $habitacion = ReservaEstanciaHabitacion::where("reserva_estancia_habitacion_id", $id)->update($datos);
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro exitoso, ha sido actualizado",
                    "detalles"=>$datos                  
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

    public function destroy($id, Request $request){
   
    	$json = array();
        $validar = ReservaEstanciaHabitacion::where("reserva_estancia_habitacion_id", $id)->get();
        if (!$validar->count()==0){           
            $habitacion = ReservaEstanciaHabitacion::where("reserva_estancia_habitacion_id", $id)->delete();
            $json = array(
                "status"=>200,
                "mensaje"=>"Se ha borrado la habitacion con éxito",
                "detalles"=>$validar
            );
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"El habitacion no existe",
                "detalles"=>null
            ); 
        }   
    	return json_encode($json, true);
    }

    public function gethabitacionreservaestancia(Request $request){
        $reserva_habitacion=DB::table('reserva_estancia_habitacion')
        ->join('reserva_estancia', 'reserva_estancia.reserva_estancia_id', '=', 'reserva_estancia_habitacion.reserva_estancia_id')
        ->join('habitacion', 'habitacion.habitacion_id', '=', 'reserva_estancia_habitacion.habitacion_id')
        ->select('reserva_estancia.reserva_estancia_id', 'reserva_estancia_habitacion.*')
        ->where([
            ['reserva_estancia.reserva_estancia_id','=',$request->get('reservaid')],
            ['reserva_estancia_habitacion.habitacion_id','=',$request->get('habitacionid')]
        ])->get();  		
        
		if($reserva_habitacion->count()>0){
			$json = array(
				"status"=>200,
				"mensaje"=>"Numero de registros= ".count($reserva_habitacion),
				"detalles"=>$reserva_habitacion			    		
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
    
    public function putearlycheckin_latecheckout(Request $request){
        $reserva_id= $request->input('reserva_estancia_id');
        $early_valor = $request->input('early_checkin');
        $late_valor = $request->input('late_checkout');
               
        $reserva = ReservaEstanciaHabitacion::where("reserva_estancia_id", $reserva_id)
        ->update(['early_checkin'=>$early_valor,'late_checkout'=>$late_valor]);            
       
        $json = array(
            "status"=>200,
            "mensaje"=>"Registro exitoso, ha sido actualizado",
            "detalles"=> $reserva                               
        );
    return json_encode($json, true);
    }

    public function mostrar_extras_early_late($id){
        $reserva_habitacion=DB::table('reserva_estancia_habitacion')
        ->join('reserva_estancia', 'reserva_estancia.reserva_estancia_id', '=', 'reserva_estancia_habitacion.reserva_estancia_id')        
        ->select('reserva_estancia.reserva_estancia_id', 'reserva_estancia_habitacion.late_checkout','reserva_estancia_habitacion.early_checkin')
        ->where([
            ['reserva_estancia_habitacion.reserva_estancia_id','=',$id]
        ])->get();  		
        
		if($reserva_habitacion->count()>0){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros= ".count($reserva_habitacion),
				"detalles"=>$reserva_habitacion			    		
			);
			
		}else{
			$json = array(
				"status"=>400,
                "mensaje"=>"No hay ningún extra registrado",
                "detalles"=>null		    		
			);
		}
    	return json_encode($json, true);
    }

    public function actualiza_clase_tarifa(Request $request){
        $reserva_id= $request->input('reserva_estancia_habitacion_id');
        $clasehabitacionid = $request->input('clase_habitacion_id');
        $tipotarifa = $request->input('tipo_tarifa');
        $tarifa = $request->input('tarifa');
               
        $reserva = ReservaEstanciaHabitacion::where("reserva_estancia_habitacion_id", $reserva_id)
        ->update(['clase_habitacion_id'=>$clasehabitacionid,'tipo_tarifa'=>$tipotarifa,'tarifa'=>$tarifa]);            
       
        $json = array(
            "status"=>200,
            "mensaje"=>"Registro exitoso, ha sido actualizado",
            "detalles"=> $reserva                               
        );
        return json_encode($json, true);
    }

}
