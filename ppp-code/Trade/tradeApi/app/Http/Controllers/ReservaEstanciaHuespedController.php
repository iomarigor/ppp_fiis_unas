<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PDF;
use App\ReservaEstanciaHuesped;
use App\Persona;

class ReservaEstanciaHuespedController extends Controller
{
    public function index(Request $request){

    	
    	$json = array(); 
        //AQUI SE GENERA LA CONSULTA
        
        $huesped = DB::table('reserva_estancia_huesped')       
                ->join('persona', 'persona.persona_id', '=', 'reserva_estancia_huesped.persona_id')
                ->select('reserva_estancia_huesped.*','persona.razon_social_nombre')
                ->get();

        if(!empty($huesped)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros ".count($huesped),
                "detalles"=>$huesped			    		
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

    public function registra_huesped_reserva(Request $request){
        $personaid = $request->input("persona_id");
        $reservaestanciahuespedid = $request->input("reserva_estancia_huesped_id");
    	$json = array();

        //Recoger datos
        $datos = array( 
			"persona_id"=>$request->input("persona_id"),
			"medio_transporte"=>$request->input("medio_transporte"),
			"procedencia_id"=>$request->input("procedencia_id"),
			"destino_id"=>$request->input("destino_id"),			
            "reserva_estancia_id"=>$request->input("reserva_estancia_id"), 
            "habitacion_id"=>$request->input("habitacion_id"),   
            "motivo_viaje"=>$request->input("motivo_viaje"),                   
            "descripcion_motivo_viaje"=>$request->input("descripcion_motivo_viaje"),
            "aereolinea"=>$request->input("aereolinea"),
            "numero_vuelo"=>$request->input("numero_vuelo"),
            "profesion"=>$request->input("profesion"),
            "estado_civil"=>$request->input("estado_civil"),
            "fecha_nacimiento"=>$request->input("fecha_nacimiento"),
            "nacionalidad"=>$request->input("nacionalidad")
    	);             
        
        if(!empty($datos)){
            //validamos si existe ya la huesped agregado a la estancia
            $validar = DB::table('reserva_estancia_huesped')		
            ->where('reserva_estancia_id','=',$datos['reserva_estancia_id'])
            ->where('persona_id','=',$datos['persona_id'])
            ->get();

            if ($validar->count()==0){

                //Validar datos
                $validator = Validator::make($datos, [
                    'reserva_estancia_id' => 'required',
                    'persona_id' => 'required',
                ]);
                //Si falla la validación
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $json = array(                    
                        "status"=>404,
                        "mensaje"=>$errors,
                        "detalles"=> null                   
                    );

                    
                }else{
                    $max_correlativo= DB::table('reserva_estancia_huesped')->max('correlativo');
                    $numeracion = $max_correlativo+1;

                    $huesped = new ReservaEstanciaHuesped();
                    $huesped->persona_id =$datos["persona_id"];
                    $huesped->medio_transporte = $datos["medio_transporte"];
                    $huesped->procedencia_id = $datos["procedencia_id"];
                    $huesped->destino_id = $datos["destino_id"];
                    $huesped->reserva_estancia_id = $datos["reserva_estancia_id"];
                    $huesped->habitacion_id = $datos["habitacion_id"];
                    $huesped->correlativo = $numeracion; 
                    $huesped->motivo_viaje = $datos["motivo_viaje"];
                    $huesped->descripcion_motivo_viaje = $datos["descripcion_motivo_viaje"];
                    $huesped->aereolinea = $datos["aereolinea"];
                    $huesped->numero_vuelo = $datos["numero_vuelo"];
                    $huesped->ubica_persona=1;
                    $huesped->save();
                    //ACTUALIZAR LA PROFESION CUANDO SE INSERTA POR DEFECTO EL HUESPED
                    $persona = Persona::where("persona_id", $personaid)
                            ->update([
                                'profesion'=>$datos['profesion'],
                                'estado_civil'=>$datos['estado_civil'],
                                'fecha_nacimiento'=>$datos['fecha_nacimiento'],
                                'nacionalidad'=>$datos['nacionalidad']
                            ]);

                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Registro exitoso, la huesped ha sido guardado",
                        "detalles"=>$huesped                     
                    );            
                }
                }else{//SE VA ACTUALIZAR LA PERSONA
                        $validar = DB::table('persona')		
                        ->where('persona_id','=',$personaid)            
                        ->get();
            
                        if (!$validar->count()==0){
                            $persona = Persona::where("persona_id", $personaid)
                            ->update([
                                'profesion'=>$datos['profesion'],
                                'estado_civil'=>$datos['estado_civil'],
                                'fecha_nacimiento'=>$datos['fecha_nacimiento'],
                                'nacionalidad'=>$datos['nacionalidad']
                            ]);

                            $huesped_reserva= ReservaEstanciaHuesped::where('reserva_estancia_huesped_id',$reservaestanciahuespedid)
                            ->update([
                                'medio_transporte'=>$datos['medio_transporte'],
                                'procedencia_id'=>$datos['procedencia_id'],
                                'destino_id'=>$datos['destino_id'],
                                'motivo_viaje'=>$datos['motivo_viaje']
                            ]);

                            $json = array(
                                "status"=>200,
                                "mensaje"=>"Registro exitoso, ha sido actualizado",
                                "detalles"=>$huesped_reserva                     
                            );  			       
                        } else{
                            $json = array(
                                "status"=>400,
                                "mensaje"=>"Los registros no existe",
                                "detalles"=>null
                            );
                        }
                }	
                //$json = array(
                    //"status"=>400,
                    //"mensaje"=>"Ya existe un registro con los datos que intenta ingresar",
                    //"detalles"=>null
                    
                    //); 
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Los registros no pueden estar vacíos",
                    "detalles"=>null
                );			
            }        
        return json_encode($json, true);
    }

    public function actualiza_huesped_reserva(Request $request){
    	$id = $request->input("reserva_estancia_huesped_id");
    	$json = array();
        //Recoger datos
        $datos = array( "medio_transporte"=>$request->input("medio_transporte"),
                        "procedencia_id"=>$request->input("procedencia_id"),
                        "destino_id"=>$request->input("destino_id"),
                        "motivo_viaje"=>$request->input("motivo_viaje"),
                        "descripcion_motivo_viaje"=>$request->input("descripcion_motivo_viaje"),
                        "aereolinea"=>$request->input("aereolinea"),
                        "numero_vuelo"=>$request->input("numero_vuelo")
        );

        if(!empty($datos)){         
            $validar = DB::table('reserva_estancia_huesped')		
            ->where('reserva_estancia_huesped_id','=',$id)            
            ->get();

            if (!$validar->count()==0){
                $huesped = ReservaEstanciaHuesped::where("reserva_estancia_huesped_id", $id)->update($datos);
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

    public function delete_huesped_reserva(Request $request){
        $id = $request->input("reserva_estancia_huesped_id");
    	$json = array();
        $validar = ReservaEstanciaHuesped::where("reserva_estancia_huesped_id", $id)->get();
        if(!$validar->count()==0){                     
            $huesped = ReservaEstanciaHuesped::where("reserva_estancia_huesped_id", $id)->delete();
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

    public function gethuespedreservaestancia(Request $request){
        $reserva_huesped=DB::table('reserva_estancia_huesped')
        ->join('reserva_estancia', 'reserva_estancia.reserva_estancia_id', '=', 'reserva_estancia_huesped.reserva_estancia_id')
        ->join('persona', 'persona.persona_id', '=', 'reserva_estancia_huesped.persona_id')
        ->select('reserva_estancia.reserva_estancia_id', 'reserva_estancia_huesped.*')
        ->where([
            ['reserva_estancia.reserva_estancia_id','=',$request->get('reservaid')],
            ['reserva_estancia_huesped.persona_id','=',$request->get('huespedid')]
        ])->get();  		
        
		if($reserva_huesped->count()>0){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros = ".count($reserva_huesped),
				"detalles"=>$reserva_huesped			    		
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

    public function mostrar_huesped_reserva($id){
        //AQUI SE GENERA LA CONSULTA
        $reserva_id=$id;
        $reserva = DB::table('reserva_estancia_huesped')
        ->join('persona', 'persona.persona_id', '=', 'reserva_estancia_huesped.persona_id')
        ->leftJoin('profesion','profesion.profesion_id','=','persona.profesion')
        ->select( 'reserva_estancia_huesped.*','persona.razon_social_nombre','profesion.profesion_id','profesion.profesion')
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
                "status"=>200,
                "mensaje"=>"No hay ningún curso registrado",
                "detalles"=>null			    		
            );
        } 	
             
            
        return json_encode($json, true);
    }

    public function mostrar_procedencia_destino(){
        $procedencia=DB::table('procedencia_destino')
        ->select('procedencia_destino_id', 'procedencia_destino')        
        ->get();  		
        
		if($procedencia->count()>0){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($procedencia),
				"detalles"=>$procedencia			    		
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
    public function mostrar_profesion(){
        $procedencia=DB::table('profesion')
        ->select('profesion_id', 'profesion')        
        ->get();  		
        
		if($procedencia->count()>0){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($procedencia),
				"detalles"=>$procedencia			    		
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

    public function pdf_ficha_ingreso($idre,$idper){
        //return "idre=".$idre." idper=".$idper;
        $huesped = DB::table('reserva_estancia as re')
        ->rightJoin('reserva_estancia_huesped as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
        ->rightJoin('reserva_estancia_habitacion as reha','reha.reserva_estancia_id','=','re.reserva_estancia_id')
        ->leftJoin('procedencia_destino as pro','pro.procedencia_destino_id','=','reh.procedencia_id')
        ->leftJoin('procedencia_destino  as prod','prod.procedencia_destino_id','=','reh.procedencia_id')
        ->leftJoin('habitacion as h','reha.habitacion_id','=','h.habitacion_id')
        ->leftJoin('persona as pre','pre.persona_id','=','re.persona_id')
        ->leftJoin('persona as pha','pha.persona_id','=','reh.persona_id')
        ->leftJoin('profesion as prof','prof.profesion_id','=','pha.profesion')
        ->select('re.fecha_llegada','re.fecha_salida',
                DB::raw("(CASE WHEN reh.medio_transporte = 1 THEN 'AEREO' 
                       WHEN reh.medio_transporte = 2 THEN 'TERRESTRE' END) AS 'medio_transporte'")
        ,'pro.procedencia_destino AS procedencia','prod.procedencia_destino AS destino',
        'pha.nacionalidad', 'pha.telefono','reha.tarifa','h.numero_habitacion','pha.razon_social_nombre AS huesped','pha.numero_documento AS dni',
        'pre.razon_social_nombre AS empresa','pre.numero_documento AS ruc',
        'prof.profesion','pha.estado_civil', 'reh.motivo_viaje')
        ->where([
                ['reh.reserva_estancia_huesped_id','=',$idper],
                ['reh.reserva_estancia_id','=',$idre]
                ])
        ->get();
        
        $pdf= PDF::loadView('FichaIngreso',compact('huesped'));        
        $pdf->setPaper(array(0,0,595.28,420.94),'portrait');        
        return $pdf->stream('fichaingreso.pdf');
    }
}
