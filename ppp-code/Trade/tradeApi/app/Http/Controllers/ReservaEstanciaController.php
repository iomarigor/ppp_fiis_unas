<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ReservaEstancia;
use App\Habitacion;
use App\ReservaEstanciaHabitacion;
use App\ReservaEstanciaHuesped;
use App\ReservaEstanciaVuelo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PDF;
/* use Codedge\Fpdf\Fpdf\Fpdf; */
use App\FpdfPerson;
use App\NumerosEnLetras;

class ReservaEstanciaController extends Controller
{
     /*=============================================
    Mostrar todos los registros
    =============================================*/
    public function index(Request $request){

            //AQUI SE GENERA LA CONSULTA
            $consumo = DB::table('pedido_nota_consumo_maestro as pncm')
            ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncm.pedido_nota_consumo_maestro_id','=','pncmd.pedido_nota_consumo_maestro_id')
            ->select('pncm.reserva_estancia_id',DB::raw('SUM(pncmd.sub_total) AS subtotal'))
            ->groupBy('pncm.reserva_estancia_id');

            $reserva = DB::table('reserva_estancia as re')       
            ->join('persona as per', 'per.persona_id', '=', 're.persona_id')
            ->join('paquetes_turisticos as pt','pt.paquete_turisticos_id','=','re.paquetes_turisticos_id')
            ->join('reserva_estancia_habitacion as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
            ->join('empleado as em','re.empleado_id','=','em.empleado_id')
            ->leftJoin('pago as pa','pa.reserva_estancia_id','=','re.reserva_estancia_id')
            ->leftJoinSub($consumo,'consumo', function($join) {
                        $join->on('consumo.reserva_estancia_id','=','re.reserva_estancia_id');
                    })
            ->select('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
            're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.numero_ninos','re.estado','re.tipo_reserva_estancia',
            're.tipo_especificacion','re.codigo_reserva','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
            'pt.descripcion','reh.early_checkin','reh.late_checkout','em.nombres','per.telefono',
            DB::raw('re.paquetes_tarifa as ptarifa'),DB::raw('ifnull(SUM(IF(pa.estado = 0,pa.monto_deposito,0)),0) AS pagos'),DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
            re.paquetes_tarifa+
            (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
		    (((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)) AS total'),
            DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
            re.paquetes_tarifa+
            (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
			(((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0))-ifnull(SUM(IF(pa.estado = 0,pa.monto_deposito,0)),0) AS saldo'))
            ->whereIn('re.estado',[1,2])
            ->groupBy('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
            're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.estado','re.numero_ninos','re.tipo_reserva_estancia',
            're.tipo_especificacion','re.codigo_reserva','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
            'pt.descripcion','re.paquetes_tarifa','reh.early_checkin','reh.late_checkout','pt.numero_noches','consumo.subtotal','em.nombres','per.telefono')
            ->get();
            /* for($i=0;$i<count($reserva);$i++){
                $abonosDeb= DB::table('pago')
                ->select(DB::raw('SUM(monto_deposito) as total'))
                ->where([
                    ['reserva_estancia_id','=',$reserva[0]->reserva_estancia_id],
                    ['estado','=',-1]
                    ])->get();
                $reserva[$i]->pagos=($reserva[$i]->pagos - $abonosDeb[0]->total);        
                $reserva[$i]->saldo=($reserva[$i]->saldo + $abonosDeb[0]->total);
            } */
            if(!empty($reserva)){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"total_registros =".count($reserva),
                    "detalles"=>$reserva			    		
                );
                return json_encode($json, true);
            }else{
                $json = array(
                    "status"=>200,
                    "mensaje"=>"No hay ninguna reserva registrada",
                    "detalles"=>null			    		
                );
            } 	
    		 	
    	    	
    	return json_encode($json, true);
    } 

    /*=============================================
    Crear un registro
    =============================================*/

    public function store(Request $request){

    
    	$json = array();

               
        //OBTENEMOS LOS DATOS ENVIADOS DESDE EL CLIENTE
        $reserva = $request->input('reserva');
        //GENERAMOS CODIGO DE RESERVA
        $codreserva = $reserva['tipo_reserva_estancia'] == 1 ? null : $this->generate_code_reserva(9);
        //------------------------------------>              
        
        //REGISTRAMOS LA HABITACION
        $flag = false;
        $rooms_states = array();
        $exist = 0;

        $habitaciones = $request->input('habitaciones');
        //VERIFICAMOS DISPONIBILIDAD DE LA HABITACION EN  BASE A LAS FECHAS SELECCIONADAS
        foreach($habitaciones as $value){                   
            $auxiliar=$this->verificar_disponibilidad_habitacion($value['habitacion_id'], $reserva['fecha_llegada'], $reserva['fecha_salida']);               
            if ($auxiliar[0] == false) {
                $exist += 1;
                array_push($rooms_states, $auxiliar[1]);
            }
        }
        
        if ($exist > 0) {
            $flag = false;
        } else {
            $flag = true;
        }
        //VALIDAMOS LA RESPUESTA DE VERIFICACION DE LA DISPONIBILIDAD DE HABITACION
        if ($flag == true) {
            //REGISTRAMOS LA RESERVA
            $idreserva = DB::table('reserva_estancia')->insertGetId([
                'fecha_reserva'=>$reserva['fecha_reserva'],
                'fecha_llegada'=>$reserva['fecha_llegada'],  
                'fecha_salida'  => $reserva['fecha_salida'],
                'estado_pago' => $reserva['estado_pago'],
                'numero_adultos'  => $reserva['numero_adultos'],
                'numero_ninos'  => $reserva['numero_ninos'],
                'estado'  => $reserva['estado'],
                'empleado_id'  => $reserva['empleado_id'],
                'tipo_reserva_estancia'  => $reserva['tipo_reserva_estancia'],
                'tipo_especificacion'  => $reserva['tipo_especificacion'],
                'codigo_reserva'  => $codreserva,
                'persona_id'  => $reserva['persona_id'],
                'direccion_persona_id'  => $reserva['direccion_persona_id'],
                'tiempo_confirmacion'  => $reserva['tiempo_confirmacion'],
                'tipo_pago'  => $reserva['tipo_pago'],
                'paquetes_turisticos_id'=>$reserva['paquetes_turisticos_id'],
                'paquetes_tarifa'=>$reserva['paquetes_tarifa'],
                'canales_venta_reserva_id'=>$reserva['canales_venta_reserva_id']
                ]
            );
 
            //REGISTRAMOS LA O LAS HABITACIONES SELECCIONADAS A LA RESERVA
            foreach($habitaciones as $value){
                $habitacion = new ReservaEstanciaHabitacion(); 
                $habitacion->habitacion_id=$value['habitacion_id'];
                $habitacion->reserva_estancia_id=$idreserva;
                $habitacion->clase_habitacion_id=$value['clase_habitacion_id'];
                $habitacion->tipo_tarifa=$value['tipo_tarifa'];
                $habitacion->tarifa=$value['tarifa'];
                $habitacion->estado=$value['estado'];
                $habitacion->estado_facturacion=$value['estado_facturacion'];
                $habitacion->save();
                //ACTUALIZAMOS EL ESTADO DE LA HABITACION                    
                $affected = DB::table('habitacion')
                ->where('habitacion_id',$value['habitacion_id'])
                ->update(['estado'=>($reserva['tipo_reserva_estancia'] == 1 ? 4 : ($reserva['tipo_pago'] == 1 ? 3 : 2))]);
            }                    

            //REGISTRAMOS LA HUESPED
            if ($reserva['tipo_reserva_estancia'] == 1) {
                
                $max_correlativo= DB::table('reserva_estancia_huesped')->max('correlativo');
                $numeracion = $max_correlativo+1;                       
                //MEJORAR ESTA PARTE DEL DEL CODIGO DE ACUERDO AL AVANCE
                $huespedes = $request->input('huesped');
                foreach($huespedes as $value){
                    $huesped = new ReservaEstanciaHuesped(); 
                    $huesped->persona_id=$value['persona_id'];
                    $huesped->reserva_estancia_id=$idreserva;
                    $huesped->aereolinea=$value['aereolinea'];
                    $huesped->numero_vuelo=$value['numero_vuelo'];
                    $huesped->correlativo=$numeracion;
                    $huesped->save();
                    $numeracion += 1;  
                }

            }else if ($reserva['tipo_reserva_estancia'] == 2) {
                $max_correlativo= DB::table('reserva_estancia_huesped')->max('correlativo');
                $numeracion = $max_correlativo+1; 
                $huespedes = $request->input('huesped');
                foreach($huespedes as $value){
                    $huesped = new ReservaEstanciaHuesped(); 
                    $huesped->persona_id=$value['persona_id'];
                    $huesped->reserva_estancia_id=$idreserva;
                    $huesped->aereolinea=$value['aereolinea'];
                    $huesped->numero_vuelo=$value['numero_vuelo'];
                    $huesped->correlativo=$numeracion;
                    $huesped->save();
                    $numeracion += 1;  
                }
                //REGISTRAMOS LOS VUELOS
                $vuelos = $request->input('vuelo');                                             
                foreach($vuelos as $value){
                    $vuelo = new ReservaEstanciaVuelo(); 
                    $vuelo->aereolinea=$value['aereolinea'];
                    $vuelo->numero_vuelo=$value['numero_vuelo'];
                    $vuelo->reserva_estancia_id=$idreserva;
                    $vuelo->save();            
                }
                
            }
            //MANDAMOS UNA RESPUESTA DE GRABACION EXITOSA
            //OBTENER LA RESERVA REGISTRADA
           $reserva_registrada = DB::table('reserva_estancia')->where('reserva_estancia_id','=',$idreserva)->get();
          
            $json = array(			    		
                "status"=>200,
                "mensaje"=>"Grabacion exitosa",
                "detalles"=>$reserva_registrada				    	
            );                
        }else{
            $json = array(			    		
                "status"=>400,
                "mensaje"=>"Ya Existe una reserva para esta habitacion, con las fechas indicadas",
                "detalles"=>null
            );                
        }
             
        return json_encode($json, true);
    }

    private function generate_code_reserva($longitud) {
        $key = '';
        $pattern = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $max = strlen($pattern)-1;

        for($i=0;$i < $longitud;$i++) $key .= $pattern[mt_rand(0,$max)];

        if ($this->check_code_reserva($key) > 0) {
            $this->generate_code_reserva(9);
        } else {
            return $key;
        }
    }
    private function check_code_reserva($code) {
        return DB::table('reserva_estancia')                
                ->where('codigo_reserva','=',$code)->count();
    }

    public function getreserva_fecha(Request $request){
        $fini=$request->get('f1').' 13:00:00';
        $ffin=$request->get('f2').' 12:00:00';

        $reserva_huesped=DB::table('reserva_estancia')       
        ->join('persona', 'persona.persona_id', '=', 'reserva_estancia.persona_id')
        ->join('reserva_estancia_habitacion','reserva_estancia_habitacion.reserva_estancia_id','=','reserva_estancia.reserva_estancia_id')
        ->select('reserva_estancia.*','persona.razon_social_nombre','reserva_estancia_habitacion.habitacion_id')
        ->where('reserva_estancia.fecha_llegada','>=',strval($fini))
        ->where('reserva_estancia.fecha_salida','<=',strval($ffin))
        ->orWhereRaw("reserva_estancia.fecha_llegada between ? and ?",[strval($fini),strval($ffin)])
        ->orWhereRaw("reserva_estancia.fecha_salida between ? and ?",[strval($fini),strval($ffin)])
        ->get(); 
       
		if($reserva_huesped->count()>0){
			$json = array(
				"status"=>200,
				"mensaje"=>count($reserva_huesped),
                "detalles"=>$reserva_huesped			    		
			);
			
		}else{
			$json = array(
				"status"=>400,
				"mensaje"=>"No hay registros",
				"detalles"=>null			    		
			);
		}
    	return json_encode($json, true);
    }

    //METODO QUE SE USA PARA ACTUALIZAR MIENTRAS SE DESPLAZA EN LA GRILLA
    public function putreserva_fechas(Request $request){
        $id = $request->input('reserva_estancia_id');
        $fini=$request->input('f1').' 13:00:00';
        $ffin=$request->input('f2').' 12:00:00';
        $habitacion_id=$request->input('h');

        $resultado = DB::table('reserva_estancia')       
        ->join('persona', 'persona.persona_id', '=', 'reserva_estancia.persona_id')
        ->join('reserva_estancia_habitacion', function ($join) use($habitacion_id) {
            $join->on('reserva_estancia_habitacion.reserva_estancia_id','=','reserva_estancia.reserva_estancia_id')
                 ->where('reserva_estancia_habitacion.habitacion_id','=',$habitacion_id);
        })
        ->where('reserva_estancia.fecha_llegada','>=',strval($fini))
        ->where('reserva_estancia.fecha_salida','<=',strval($ffin))
        ->orWhereRaw("reserva_estancia.fecha_llegada between ? and ?",[strval($fini),strval($ffin)])
        ->orWhereRaw("reserva_estancia.fecha_salida between ? and ?",[strval($fini),strval($ffin)])
        ->exists();

        if($resultado == false){
            $reserva = ReservaEstancia::where("reserva_estancia_id", $id)
            ->update(['fecha_llegada'=>$fini,'fecha_salida'=>$ffin]);
            //ACTUALIZAMOS LA HABITACION EN LA TABLA RESERVA_ESTANCIA_HABITACION
            $reserva_habitacion = ReservaEstanciaHabitacion::where("reserva_estancia_id", $id)
                                                            ->update(['habitacion_id'=>$habitacion_id]);
            $json = array(
                "status"=>200,
                "mensaje"=>"Registro exitoso, ha sido actualizado",
                "detalles"=>$reserva_habitacion                    
            );
        }else{
            $reserva = ReservaEstancia::where("reserva_estancia_id", $id)
            ->update(['fecha_llegada'=>$fini,'fecha_salida'=>$ffin]);
            //ACTUALIZAMOS LA HABITACION EN LA TABLA RESERVA_ESTANCIA_HABITACION
            $reserva_habitacion = ReservaEstanciaHabitacion::where("reserva_estancia_id", $id)
                                                            ->update(['habitacion_id'=>$habitacion_id]);
            $json = array(
                "status"=>200,
                "mensaje"=>"Registro exitoso, ha sido actualizado",
                "detalles"=>$reserva_habitacion                    
            );
            //$json = array(
            //    "status"=>400,
            //    "mensaje"=>"Existe reserva con esas fechas",
            //    "detalles"=>null			    		
            //);
        }
        return json_encode($json, true);
    }
    
    private function verificar_disponibilidad_habitacion($habitacion, $fecha_llegada, $fecha_salida) {
        $reservas_estancias = DB::table('reserva_estancia_habitacion')
                        ->join('reserva_estancia', 'reserva_estancia.reserva_estancia_id', '=', 'reserva_estancia_habitacion.reserva_estancia_id')
                        ->join('habitacion', 'habitacion.habitacion_id', '=', 'reserva_estancia_habitacion.habitacion_id')
                        ->select('reserva_estancia.*', 'habitacion.numero_habitacion')
                        ->where([
                            ['reserva_estancia.estado','=','1'],
                            ['reserva_estancia_habitacion.habitacion_id','=',$habitacion],
                            ['reserva_estancia_habitacion.estado','<>','0']
                        ])->get();
        
        if ($reservas_estancias->count() == 0) {
            return array(true, null);
        } else {
            
            $flag = 0;
            $habitacion_states = array();
            $vfl = date('Y/m/d', strtotime($fecha_llegada));
            $vfs = date('Y/m/d', strtotime($fecha_salida));
             
            foreach ($reservas_estancias as $reserva_estancia) {
               
                $fl = strtotime($reserva_estancia->fecha_llegada);
                $fs = strtotime($reserva_estancia->fecha_salida);
                if ($vfl >= $fl && $vfl <= $fs) {
                    $flag += 1;
                } else if ($vfs >= $fl && $vfs <= $fs) {
                    $flag += 1;
                }
                
                
                array_push($habitacion_states, $reserva_estancia);
            }           
            
            if ($flag > 0) {
                return array(false, $habitacion_states);
            } else {
                return array(true, null);
            }
        }
    }
    
    public function check_in(Request $request){
       $id = $request->input("reserva_estancia_id");      
       $fcheckin_fecha = date('Y-m-d');
       $fcheckin_hora = date('H:i:s');
       //VERIFICAMOS SI SE AGREGO HUESPED A LA RESERVA ESTANCIA HABITACION
       $validaexistenciahuespedes = DB::table('reserva_estancia_huesped')
       ->where('reserva_estancia_huesped.reserva_estancia_id',$id)       
       ->exists();
       if($validaexistenciahuespedes==true){
            $resultado = DB::table('reserva_estancia')
            ->where('reserva_estancia.reserva_estancia_id',$id)
            //->where('reserva_estancia.fecha_llegada','>=',$fcheckin_fecha)
            ->where('reserva_estancia.tipo_reserva_estancia',2)      
            ->exists();

            if($resultado == true){
                    
                $reserva = ReservaEstancia::where("reserva_estancia_id", $id)
                ->update(['fecha_checkin'=>$fcheckin_fecha.' '.$fcheckin_hora,'tipo_reserva_estancia'=>1]);
                
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro exitoso, Se realizo checkin", 
                    "detalles"=> $reserva                                      
                );
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"No existe reserva " .' '.$fcheckin_fecha .' '. $fcheckin_hora,
                    "detalles"=>null            			    		
                );
            }
       }else{
        $json = array(
            "status"=>400,
            "mensaje"=>"Aun no se ha agregado huesped a la reserva",
            "detalles"=>null            			    		
        );
       }
            
        return json_encode($json, true);  
    }

    public function check_out(Request $request){
        $id = $request->input("reserva_estancia_id");      
        $fcheckout_fecha = date('Y-m-d');
        $fcheckout_hora = date('H:i:s');
 
         $resultado = DB::table('reserva_estancia')
         ->where([
            ['reserva_estancia.reserva_estancia_id','=',$id],
            //['reserva_estancia.fecha_salida','<',$fcheckout_fecha.' '.$fcheckout_hora],
            ['reserva_estancia.tipo_reserva_estancia','=',1]
        ])      
         ->exists();
         
         if($resultado == true){
          
             $reserva = ReservaEstancia::where("reserva_estancia_id", $id)
             ->update(['fecha_checkout'=>$fcheckout_fecha.' '.$fcheckout_hora,'estado'=>2]);
             
             $json = array(
                 "status"=>200,
                 "mensaje"=>"Registro exitoso, Se realizo checkout",
                 "detalles"=> $reserva                              
             );
         }else{
             $json = array(
                 "status"=>400,
                 "mensaje"=>"Esta intentando salir antes de fecha",
                 "detalles"=>$fcheckout_fecha               			    		
             );
         }
         return json_encode($json, true);  
    }
    
    public function actualiza_cant_adulto_niño(Request $request){
        $id = $request->input("reserva_estancia_id");
        $nadulto = $request->input("numero_adultos");
        $nninos = $request->input("numero_ninos");     
       
 
         $resultado = DB::table('reserva_estancia')
         ->where('reserva_estancia.reserva_estancia_id',$id)           
         ->exists();
 
         if($resultado == true){          
             $reserva = ReservaEstancia::where("reserva_estancia_id", $id)
             ->update(['numero_adultos'=>$nadulto,'numero_ninos'=>$nninos]);
             
             $json = array(
                 "status"=>200,
                 "mensaje"=>"Registro exitoso, Se actualizo correctamente",
                 "detalles"=> $reserva                              
             );
         }else{
             $json = array(
                 "status"=>400,
                 "mensaje"=>"No existe estancia",
                 "detalles"=>null                			    		
             );
         }
         return json_encode($json, true);  
    }

    public function del_reserva_estancia(Request $request){
        $id = $request->input("reserva_estancia_id");
    	$json = array();
        $validar = ReservaEstancia::where("reserva_estancia_id", $id)->get();
        if(!$validar->count()==0){                     
            $reserva = ReservaEstancia::where("reserva_estancia_id", $id)->delete();
            $json = array(
                "status"=>200,
                "mensaje"=>"Se ha borrado el registro con éxito",
                "detalles"=>$validar
                
            ); 
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"El registro no existe",
                "detalles"=>null
            );            
        }   
    	return json_encode($json, true);
    }
    public function get_reserva_tarifas_paq_hab(Request $request){
        $reserva=DB::table('reserva_estancia as re')      
        ->join('reserva_estancia_habitacion as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
        ->select('re.reserva_estancia_id','reh.clase_habitacion_id','reh.reserva_estancia_habitacion_id','reh.tipo_tarifa','reh.tarifa',
                    're.paquetes_turisticos_id','re.paquetes_tarifa',
                   're.canales_venta_reserva_id','re.numero_adultos','re.numero_ninos')
        ->where('re.reserva_estancia_id','=',$request->get("param"))
        ->get(); 
       
		if($reserva->count()>0){
			$json = array(
				"status"=>200,
				"mensaje"=>count($reserva),
                "detalles"=>$reserva			    		
			);
			
		}else{
			$json = array(
				"status"=>400,
				"mensaje"=>"No hay registros",
				"detalles"=>null			    		
			);
		}
    	return json_encode($json, true);
    }
    public function put_reserva_tarifas_paq_hab(Request $request){
        $json = array();
        $datos = array(
                "reserva_estancia_id"=>$request->input("reserva_estancia_id"),
                "clase_habitacion_id"=> $request->input("clase_habitacion_id"),
                "reserva_estancia_habitacion_id"=> $request->input("reserva_estancia_habitacion_id"),
                "tipo_tarifa"=> $request->input("tipo_tarifa"),
                "tarifa"=> $request->input("tarifa"),
                "paquetes_turisticos_id"=> $request->input("paquetes_turisticos_id"),
                "paquetes_tarifa"=> $request->input("paquetes_tarifa"),
                "canales_venta_reserva_id"=> $request->input("canales_venta_reserva_id"),
                "numero_adultos"=> $request->input("numero_adultos"),
                "numero_ninos"=> $request->input("numero_ninos")
        );

 
         $reserva = DB::table('reserva_estancia')
         ->where('reserva_estancia.reserva_estancia_id',$datos['reserva_estancia_id'])           
         ->exists();
         $habitacion = DB::table('reserva_estancia_habitacion')
         ->where('reserva_estancia_habitacion.reserva_estancia_habitacion_id',$datos['reserva_estancia_habitacion_id'])           
         ->exists();

         if($reserva == true && $habitacion == true){          
             $reserva = ReservaEstancia::where("reserva_estancia_id", $datos['reserva_estancia_id'])
             ->update([                 
                 'paquetes_turisticos_id'=>$datos['paquetes_turisticos_id'],
                 'paquetes_tarifa'=>$datos['paquetes_tarifa'],
                 'canales_venta_reserva_id'=>$datos['canales_venta_reserva_id'],
                 'numero_adultos'=>$datos['numero_adultos'],
                 'numero_ninos'=>$datos['numero_ninos']
             ]);

             $reserva = ReservaEstanciaHabitacion::where("reserva_estancia_habitacion_id", $datos['reserva_estancia_habitacion_id'])
             ->update([
                'clase_habitacion_id'=>$datos['clase_habitacion_id'],
                 'tipo_tarifa'=>$datos['tipo_tarifa'],
                 'tarifa'=>$datos['tarifa']
                 ]);
             
             $json = array(
                 "status"=>200,
                 "mensaje"=>"Registro exitoso, Se actualizo correctamente",
                 "detalles"=> $reserva                              
             );
         }else{
             $json = array(
                 "status"=>400,
                 "mensaje"=>"No existe registro para actualizar",
                 "detalles"=>null                			    		
             );
         }      
         
         return json_encode($json, true);
    }

    public function get_anular_estancia($reserva_id){
        $json = array();
        $consumo = DB::table('pedido_nota_consumo_maestro as pncm')
            ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncm.pedido_nota_consumo_maestro_id','=','pncmd.pedido_nota_consumo_maestro_id')
            ->where([
                ["pncm.reserva_estancia_id","=",$reserva_id],
                ["pncmd.estado_facturacion","=","0"]
            ])->count();
            $pagos = DB::table('pago')
            ->where([
                ["reserva_estancia_id","=",$reserva_id],
                ["estado_facturacion","=","0"],
                ["estado","!=",-1]
            ])->count();
            
            if($consumo<=0 && $pagos<=0){
                $data=DB::table('reserva_estancia')
                ->where('reserva_estancia_id',$reserva_id)
                ->update(['estado'=>-1]);
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Estancia anulada",
                    "estado"=>$data                                
                );  	
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Estancia no se puede cancelar por que tiene consumos / pagos pendientes",
                    "detalles"=>null
                );     
            }
            echo json_encode($json);
    }


    //REPORTE ESTADISTICO

    public function get_estadistico_01(Request $request){
        $fini=date('Y/m/d', strtotime($request->input('f1')));
        $ffin=date('Y/m/d', strtotime($request->input('f2')));
        $cuadroe01=DB::select('call sp_estadistico_01(?,?)',array(strval($fini),strval($ffin))); 
                  
            if(!empty($cuadroe01)){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"total_registros =".count($cuadroe01),
                    "detalles" => array(
                        "cuadro01" => $cuadroe01,
                    )
                );
            }else{
                $json = array(
                    "status"=>200,
                    "mensaje"=>"No hay ningún curso registrado",
                    "detalles"=> array(
                        "cuadro01" => null,
                    )                    			    		
                );
            }  

            return json_encode($json, true);
    }

    public function get_estadistico_02(Request $request){
        $fini=date('Y/m/d', strtotime($request->input('f1')));
        $ffin=date('Y/m/d', strtotime($request->input('f2')));
        $cuadroe01=DB::table('reserva_estancia as re')
            ->select("ch.clase_habitacion",
                    DB::raw("COUNT(*) AS cantidad"))
            ->join('reserva_estancia_habitacion as reh', 'reh.reserva_estancia_id', '=', 're.reserva_estancia_id')
            ->join('clase_habitacion as ch', 'ch.clase_habitacion_id', '=', 'reh.clase_habitacion_id')          
            ->WhereRaw(" date(re.fecha_reserva) between ? and ?",[strval($fini),strval($ffin)])
            ->groupBy('ch.clase_habitacion')
            ->get();
            if(!empty($cuadroe01)){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"total_registros =".count($cuadroe01),
                    "detalles" => array(
                        "cuadro01" => $cuadroe01,
                    )
                );
                
            }else{
                $json = array(
                    "status"=>200,
                    "mensaje"=>"No hay ningún curso registrado",
                    "detalle"=>null			    		
                );
            }  
            return json_encode($json, true);
    }

    public function get_estadistico_03(Request $request){
        $fini=date('Y/m/d', strtotime($request->input('f1')));
        $ffin=date('Y/m/d', strtotime($request->input('f2')));
        $cuadroe01=DB::table('reserva_estancia as re')       
            ->select("cvr.canales_venta_reserva",
                    DB::raw("COUNT(*) AS cantidad"))
            ->join('canales_venta_reserva as cvr', 'cvr.canales_venta_reserva_id', '=', 're.canales_venta_reserva_id')              
            ->WhereRaw(" date(re.fecha_reserva) between ? and ?",[strval($fini),strval($ffin)])
            ->groupBy('cvr.canales_venta_reserva')
            ->get();
            if(!empty($cuadroe01)){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"total_registros =".count($cuadroe01),
                    "detalles" => array(
                        "cuadro01" => $cuadroe01,
                    )
                );
               
            }else{
                $json = array(
                    "status"=>200,
                    "mensaje"=>"No hay ningún curso registrado",
                    "detalle"=>null			    		
                );
            } 
            return json_encode($json, true);
    }
    public function get_estadistico_04(Request $request){
        $fini=date('Y/m/d', strtotime($request->input('f1')));
        $ffin=date('Y/m/d', strtotime($request->input('f2')));
        $cuadroe01=DB::table('reserva_estancia as re')       
            ->select("em.nombres",
                    DB::raw("COUNT(*) AS cantidad"))
            ->join('empleado as em', 'em.empleado_id', '=', 're.empleado_id')              
            ->WhereRaw(" date(re.fecha_reserva) between ? and ?",[strval($fini),strval($ffin)])
            ->groupBy('em.nombres')
            ->get();
            if(!empty($cuadroe01)){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"total_registros =".count($cuadroe01),
                    "detalles" => array(
                        "cuadro01" => $cuadroe01,
                    )
                );
               
            }else{
                $json = array(
                    "status"=>200,
                    "mensaje"=>"No hay ningún curso registrado",
                    "detalle"=>null			    		
                );
            }
            return json_encode($json, true); 
    }
    public function get_estadistico_05(Request $request){
        $fini=date('Y/m/d', strtotime($request->input('f1')));
        $ffin=date('Y/m/d', strtotime($request->input('f2')));
        $cuadroe01=DB::table('reserva_estancia as re')       
            ->select("pt.descripcion",
                    DB::raw("COUNT(*) AS cantidad"))
            ->join('paquetes_turisticos as pt', 'pt.paquete_turisticos_id', '=', 're.paquetes_turisticos_id')              
            ->WhereRaw(" date(re.fecha_reserva) between ? and ?",[strval($fini),strval($ffin)])
            ->groupBy('pt.descripcion')
            ->get();
            if(!empty($cuadroe01)){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"total_registros =".count($cuadroe01),
                    "detalles" => array(
                        "cuadro01" => $cuadroe01,
                    )
                );
                
            }else{
                $json = array(
                    "status"=>200,
                    "mensaje"=>"No hay ningún curso registrado",
                    "detalle"=>null			    		
                );
            } 
            return json_encode($json, true); 
    }

    //PARA JALAR INFORMACION A LA VENTA
    public function get_reserva_estancia_cabecera_list(Request $request){
        
        $reserva=DB::select('call sp_reserva_estancia_cabecera_list()'); 
        $reservaT=[];
        foreach($reserva as $rs){
            
            $consumo = DB::table('pedido_nota_consumo_maestro_detalle as ped')
            ->join('pedido_nota_consumo_maestro as pedd','pedd.pedido_nota_consumo_maestro_id','=','ped.pedido_nota_consumo_maestro_id')
            ->join('producto as pro','pro.producto_id','=','ped.producto_id')
            ->join('unidad_medida as um','um.unidad_medida_id','=','ped.unidad_medida_id')
            ->select(DB::raw('ped.pedido_nota_consumo_maestro_id,pro.producto_id,um.abreviatura,pro.denominacion,ped.cantidad,ped.precio_unitario,ped.sub_total,pedd.reserva_estancia_id,ped.estado_facturacion,um.unidad_medida_id,ped.estado_facturacion'))
            ->where('pedd.reserva_estancia_id','=',$rs->reserva_estancia_id)
            ->where('ped.estado_facturacion','=','0')
            ->get();
            
            $pagos = DB::table('pago as pa')
            ->join('reserva_estancia as re','re.reserva_estancia_id','=','pa.reserva_estancia_id')
            ->join('persona as per','per.persona_id','=','re.persona_id')
            ->select(DB::raw('pa.pago_id,pa.iddocumento,pa.fecha_hora_deposito,per.razon_social_nombre,pa.concepto,pa.reserva_estancia_id,pa.monto_deposito,ifnull(pa.estado,0) AS estado,pa.estado_facturacion'))
            ->where('pa.reserva_estancia_id','=',$rs->reserva_estancia_id)
            ->where('pa.estado_facturacion','=','0')
            ->get();
            $count= count($pagos)+ count($consumo);
            $rs->detalleCant=$count;
            array_push($reservaT,$rs);
        }
            if(!empty($reserva)){
                $json = array(
                    "status"=>200,
                    "mensaje"=>"total_registros =".count($reservaT),
                    "detalles" => array(
                        "reserva" => $reservaT,
                    )
                );
            }else{
                $json = array(
                    "status"=>200,
                    "mensaje"=>"No hay ningún curso registrado",
                    "detalles"=> array(
                        "reserva" => null,
                    )                    			    		
                );
            }  

            return json_encode($json, true);
    }

    public function get_pago_consumo_list($reservaid){        

        $consumo = DB::table('pedido_nota_consumo_maestro_detalle as ped')
        ->join('pedido_nota_consumo_maestro as pedd','pedd.pedido_nota_consumo_maestro_id','=','ped.pedido_nota_consumo_maestro_id')
        ->join('producto as pro','pro.producto_id','=','ped.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','ped.unidad_medida_id')
        ->select(DB::raw('ped.pedido_nota_consumo_maestro_id,pro.producto_id,um.abreviatura,pro.denominacion,ped.cantidad,ped.precio_unitario,ped.sub_total,pedd.reserva_estancia_id,ped.estado_facturacion,um.unidad_medida_id,ped.estado_facturacion'))
        ->where('pedd.reserva_estancia_id','=',$reservaid)
        ->orderBy('ped.estado_facturacion', 'asc')
        ->get();
        
        $pagos = DB::table('pago as pa')
        ->join('reserva_estancia as re','re.reserva_estancia_id','=','pa.reserva_estancia_id')
        ->join('persona as per','per.persona_id','=','re.persona_id')
        ->select(DB::raw('pa.pago_id,pa.iddocumento,pa.fecha_hora_deposito,per.razon_social_nombre,pa.concepto,pa.reserva_estancia_id,pa.monto_deposito,ifnull(pa.estado,0) AS estado,pa.estado_facturacion'))
        ->where([
            ['pa.reserva_estancia_id','=',$reservaid],
            ['pa.estado','!=',-1]
            ])
        ->orderBy('pa.estado_facturacion', 'asc')
        ->get();

        $json = array();
		if(!empty($consumo)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros ".$reservaid,
				"detalles"=> array(
                        "consumo" => $consumo,
                        "pagos" => $pagos                    )				
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
    public function get_reporte_diario_arrivos(){
        $detalle= DB::table('reserva_estancia as re')
        ->rightJoin('reserva_estancia_huesped as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
        ->leftJoin('reserva_estancia_vuelo as rev','re.reserva_estancia_id','=', 'rev.reserva_estancia_id')
        ->join('reserva_estancia_habitacion as reha','reha.reserva_estancia_id','=', 're.reserva_estancia_id')
        ->join('persona as p','p.persona_id' ,'=', 're.persona_id')
        ->join('habitacion as ha', 'reha.habitacion_id','=','ha.habitacion_id')
        ->select('re.codigo_reserva', 'ha.numero_habitacion', 'p.razon_social_nombre', 'p.telefono', 'rev.aereolinea',
        'reh.persona_id')
        ->groupBy('reh.persona_id')
        ->groupBy('reha.reserva_estancia_habitacion_id')
        ->where([
            ['re.fecha_checkin','=',null]
        ])
        ->whereDay('re.fecha_llegada',date("d"))
        ->orderBy('re.fecha_llegada','desc')
        ->get();
        
        for($i=0;$i<count($detalle);$i++){
            $detalle[$i]->pasajeroRZ=DB::table('persona')
                ->where('persona_id',$detalle[$i]->persona_id)
                ->get()[0]->razon_social_nombre;
        }
            $fpdf= new FpdfPerson();
            $fpdf->AddPage();

            $fpdf->SetFont('Courier', 'B', 14);
            $textypost=8;
            $fpdf->setXY(5,$textypost);
            
            $fpdf->Cell(0,0,"ARRIVOS DEL DIA",0,1,"C");
            $fpdf->Image("http://cdn.onlinewebfonts.com/svg/img_154778.png",70,($textypost-4),-2700);
            $textypost += 8;
            $fpdf->SetFont('Courier', 'B', 10);
            $fpdf->setXY(5,$textypost);
            if(count($detalle)<=0){
                $fpdf->SetFont('Courier', 'B', 12);
                $textypost+=8;
                $fpdf->setXY(5,$textypost);
                
                $fpdf->Cell(0,0,utf8_decode("No ahí arrivos registrados para hoy"),0,1,"C");
            }else{
                //Headers table
                $fpdf->SetWidths(Array(23,25,60,40,52));
                $fpdf->SetLineHeight(7);
                $fpdf->Row(Array(
                    utf8_decode("Codigó Reserva"),
                    utf8_decode("Habitación"),
                    utf8_decode("Contacto"),
                    utf8_decode("Vuelos"),
                    utf8_decode("Pasajeros")
                ));
                foreach($detalle as $data){
                        $fpdf->setX(5);
                        $fpdf->Row(Array(
                        utf8_decode($data->codigo_reserva),
                        utf8_decode($data->numero_habitacion),
                        ($data->telefono)?utf8_decode($data->razon_social_nombre." \nTelf.: ".$data->telefono):utf8_decode($data->razon_social_nombre),
                        utf8_decode($data->aereolinea),
                        utf8_decode($data->pasajeroRZ)
                    ));                
                }
            }
            
            $fpdf->Output();
            exit;
    }
    public function get_reporte_diario_salidas(){
        $detalle= DB::table('reserva_estancia as re')
        ->rightJoin('reserva_estancia_huesped as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
        ->leftJoin('reserva_estancia_vuelo as rev','re.reserva_estancia_id','=', 'rev.reserva_estancia_id')
        ->join('reserva_estancia_habitacion as reha','reha.reserva_estancia_id','=', 're.reserva_estancia_id')
        ->join('persona as p','p.persona_id' ,'=', 're.persona_id')
        ->join('habitacion as ha', 'reha.habitacion_id','=','ha.habitacion_id')
        ->select('re.codigo_reserva', 'ha.numero_habitacion', 'p.razon_social_nombre', 'p.telefono', 'rev.aereolinea',
        'reh.persona_id')
        ->groupBy('reh.persona_id')
        ->groupBy('reha.reserva_estancia_habitacion_id')
        /* ->where([
            ['re.fecha_checkin','!=',null]
        ]) */
        ->whereDay('re.fecha_salida',date("d"))
        ->orderBy('re.fecha_salida','desc')
        ->get();
        
        for($i=0;$i<count($detalle);$i++){
            $detalle[$i]->pasajeroRZ=DB::table('persona')
                ->where('persona_id',$detalle[$i]->persona_id)
                ->get()[0]->razon_social_nombre;
        }
            $fpdf= new FpdfPerson();
            $fpdf->AddPage();

            $fpdf->SetFont('Courier', 'B', 14);
            $textypost=8;
            $fpdf->setXY(5,$textypost);
            
            $fpdf->Cell(0,0,"SALIDAS DEL DIA",0,1,"C");
            $fpdf->Image("https://cdn-icons-png.flaticon.com/512/32/32205.png",70,($textypost-4),-2700);
            $textypost += 8;
            $fpdf->SetFont('Courier', 'B', 10);
            $fpdf->setXY(5,$textypost);
            if(count($detalle)<=0){
                $fpdf->SetFont('Courier', 'B', 12);
                $textypost+=8;
                $fpdf->setXY(5,$textypost);
                
                $fpdf->Cell(0,0,utf8_decode("No ahí salidas registradas para hoy"),0,1,"C");
            }else{
                //Headers table
                $fpdf->SetWidths(Array(23,25,60,40,52));
                $fpdf->SetLineHeight(7);
                $fpdf->Row(Array(
                    utf8_decode("Codigó Reserva"),
                    utf8_decode("Habitación"),
                    utf8_decode("Contacto"),
                    utf8_decode("Vuelos"),
                    utf8_decode("Pasajeros")
                ));
                foreach($detalle as $data){
                        $fpdf->setX(5);
                        $fpdf->Row(Array(
                        utf8_decode($data->codigo_reserva),
                        utf8_decode($data->numero_habitacion),
                        ($data->telefono)?utf8_decode($data->razon_social_nombre." \nTelf.: ".$data->telefono):utf8_decode($data->razon_social_nombre),
                        utf8_decode($data->aereolinea),
                        utf8_decode($data->pasajeroRZ)
                    ));                
                }
            }
            
            $fpdf->Output();
            exit;
    }
    public function get_resumen_reserva_estancia(Request $request){
        $consumo = DB::table('pedido_nota_consumo_maestro as pncm')
            ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncm.pedido_nota_consumo_maestro_id','=','pncmd.pedido_nota_consumo_maestro_id')
            ->select('pncm.reserva_estancia_id',DB::raw('SUM(pncmd.sub_total) AS subtotal'))
            ->groupBy('pncm.reserva_estancia_id');

        $reserva = DB::table('reserva_estancia as re')       
        ->join('persona as per', 'per.persona_id', '=', 're.persona_id')
        ->join('paquetes_turisticos as pt','pt.paquete_turisticos_id','=','re.paquetes_turisticos_id')
        ->join('reserva_estancia_habitacion as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
        ->join('clase_habitacion as ch','ch.clase_habitacion_id','=','reh.clase_habitacion_id')
        ->join('habitacion as h','h.habitacion_id','=','reh.habitacion_id')
        ->join('canales_venta_reserva as cvr','cvr.canales_venta_reserva_id','=','re.canales_venta_reserva_id')
        ->leftJoin('pago as pa','pa.reserva_estancia_id','=','re.reserva_estancia_id')
        ->leftJoinSub($consumo,'consumo', function($join) {
                    $join->on('consumo.reserva_estancia_id','=','re.reserva_estancia_id');
                })
        ->select('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
        're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.numero_ninos','re.codigo_reserva','h.numero_habitacion','ch.clase_habitacion','cvr.canales_venta_reserva'
        ,'per.razon_social_nombre','reh.tarifa',
        'pt.descripcion','reh.early_checkin','reh.late_checkout',
        DB::raw('pt.tarifa as ptarifa'),DB::raw('ifnull(SUM(IF(pa.estado = 0,pa.monto_deposito,0)),0) AS pagos'),DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
        pt.tarifa+
        (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
        (((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)) AS total'),
        DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
        pt.tarifa+
        (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
        (((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0))-ifnull(SUM(IF(pa.estado = 0,pa.monto_deposito,0)),0) AS saldo'))
        ->where('re.reserva_estancia_id','=',$request->get('param'))
        ->groupBy('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
        're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.estado','re.numero_ninos','re.codigo_reserva','h.numero_habitacion','ch.clase_habitacion','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
        'pt.descripcion','pt.tarifa','reh.early_checkin','reh.late_checkout','pt.numero_noches','consumo.subtotal','cvr.canales_venta_reserva')
        ->get();
        $consumo=DB::table('pedido_nota_consumo_maestro as pncm')
        ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncmd.pedido_nota_consumo_maestro_id','=','pncm.pedido_nota_consumo_maestro_id')
        ->join('producto as p','p.producto_id','=','pncmd.producto_id')
        ->join('unidadmedida_producto as ump','ump.producto_id','=','pncmd.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','ump.unidad_medida_id')
        ->select('pncm.fecha_emision','pncmd.cantidad','p.denominacion','um.abreviatura','pncmd.sub_total')
        ->where('pncm.reserva_estancia_id','=',$request->get('param'))
        ->get();
        $abonos=DB::table('pago as pa')
        ->join('reserva_estancia as re','re.reserva_estancia_id','=','pa.reserva_estancia_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id','=','pa.tipo_moneda')
        ->select('pa.estado','pa.iddocumento','pa.fecha_hora_deposito','pa.concepto','pa.numero_deposito',
        DB::raw("(CASE when pa.medio_pago=1 then 'DC'
                       WHEN pa.medio_pago=2 then 'TB'
                       when pa.medio_pago=3 then 'EF' 
                       when pa.medio_pago=4 then 'VI' END) AS medio_pago"),            
        DB::raw("(CASE WHEN pa.tipo_moneda = 1 THEN 'SOLES' 
                        WHEN pa.tipo_moneda = 2 THEN 'DORALES' 
                        WHEN pa.tipo_moneda = 3 THEN 'EUROS' END) AS tipo_moneda"),'pa.monto_deposito')
        ->where('pa.reserva_estancia_id','=',$request->get('param'))
        ->get();
        /* $abonosDeb= DB::table('pago')
        ->select(DB::raw('SUM(monto_deposito) as total'))
        ->where([
            ['reserva_estancia_id','=',$request->get('param')],
            ['estado','=',-1]
            ])->get();
        $reserva["0"]->pagos=($reserva["0"]->pagos - $abonosDeb[0]->total);        
        $reserva["0"]->saldo=($reserva["0"]->saldo + $abonosDeb[0]->total); */
        if(!empty($reserva)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($reserva),
                "detalles" => array(
                    "resumen" => $reserva,
                    "consumo" => $consumo,
                    "abonos" => $abonos
                )
            );
            return json_encode($json, true);
        }else{
            $json = array(
                "status"=>200,
                "mensaje"=>"No hay ningún curso registrado",
                "detalle"=>null			    		
            );
        } 	
             
            
        return json_encode($json, true);
    }
    public function get_resumen_estacia_pdf($reservaid){
        $consumo = DB::table('pedido_nota_consumo_maestro as pncm')
            ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncm.pedido_nota_consumo_maestro_id','=','pncmd.pedido_nota_consumo_maestro_id')
            ->select('pncm.reserva_estancia_id',DB::raw('SUM(pncmd.sub_total) AS subtotal'))
            ->groupBy('pncm.reserva_estancia_id');

        $reserva = DB::table('reserva_estancia as re')       
        ->join('persona as per', 'per.persona_id', '=', 're.persona_id')
        ->join('paquetes_turisticos as pt','pt.paquete_turisticos_id','=','re.paquetes_turisticos_id')
        ->join('reserva_estancia_habitacion as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
        ->join('clase_habitacion as ch','ch.clase_habitacion_id','=','reh.clase_habitacion_id')
        ->join('habitacion as h','h.habitacion_id','=','reh.habitacion_id')
        ->join('canales_venta_reserva as cvr','cvr.canales_venta_reserva_id','=','re.canales_venta_reserva_id')
        ->leftJoin('pago as pa','pa.reserva_estancia_id','=','re.reserva_estancia_id')
        ->leftJoinSub($consumo,'consumo', function($join) {
                    $join->on('consumo.reserva_estancia_id','=','re.reserva_estancia_id');
                })
        ->select('per.numero_documento','re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
        're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.numero_ninos','re.codigo_reserva','h.numero_habitacion','ch.clase_habitacion','cvr.canales_venta_reserva'
        ,'per.razon_social_nombre','reh.tarifa',
        'pt.descripcion','reh.early_checkin','reh.late_checkout',
        DB::raw('pt.tarifa as ptarifa'),DB::raw('ifnull(SUM(IF(pa.estado = 0,pa.monto_deposito,0)),0) AS pagos'),DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
        pt.tarifa+
        (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
        (((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)) AS total'),
        DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
        pt.tarifa+
        (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
        (((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
        ifnull(reh.early_checkin,0)+
        ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0))-ifnull(SUM(IF(pa.estado = 0,pa.monto_deposito,0)),0) AS saldo'))
        ->where('re.reserva_estancia_id','=',$reservaid)
        ->groupBy('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
        're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.estado','re.numero_ninos','re.codigo_reserva','h.numero_habitacion','ch.clase_habitacion','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
        'pt.descripcion','pt.tarifa','reh.early_checkin','reh.late_checkout','pt.numero_noches','consumo.subtotal','cvr.canales_venta_reserva')
        ->get();
        $consumo=DB::table('pedido_nota_consumo_maestro as pncm')
        ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncmd.pedido_nota_consumo_maestro_id','=','pncm.pedido_nota_consumo_maestro_id')
        ->join('producto as p','p.producto_id','=','pncmd.producto_id')
        ->join('unidadmedida_producto as ump','ump.producto_id','=','pncmd.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','ump.unidad_medida_id')
        ->select('pncm.fecha_emision','pncmd.cantidad','p.denominacion','um.abreviatura','pncmd.sub_total')
        ->where('pncm.reserva_estancia_id','=',$reservaid)
        ->get();
        $abonos=DB::table('pago as pa')
        ->join('reserva_estancia as re','re.reserva_estancia_id','=','pa.reserva_estancia_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id','=','pa.tipo_moneda')
        ->select('pa.estado','pa.iddocumento','pa.fecha_hora_deposito','pa.concepto','pa.numero_deposito',
        DB::raw("(CASE when pa.medio_pago=1 then 'DC'
                       WHEN pa.medio_pago=2 then 'TB'
                       when pa.medio_pago=3 then 'EF' 
                       when pa.medio_pago=4 then 'VI' END) AS medio_pago"),            
        DB::raw("(CASE WHEN pa.tipo_moneda = 1 THEN 'SOLES' 
                        WHEN pa.tipo_moneda = 2 THEN 'DORALES' 
                        WHEN pa.tipo_moneda = 3 THEN 'EUROS' END) AS tipo_moneda"),'pa.monto_deposito')
        ->where('pa.reserva_estancia_id','=',$reservaid)
        ->get();
        /* $abonosDeb= DB::table('pago')
        ->select(DB::raw('SUM(monto_deposito) as total'))
        ->where([
            ['reserva_estancia_id','=',$reservaid],
            ['estado','=',-1]
            ])->get();
        $reserva["0"]->pagos=($reserva["0"]->pagos - $abonosDeb[0]->total);        
        $reserva["0"]->saldo=($reserva["0"]->saldo + $abonosDeb[0]->total); */
    $data=array(
        "resumen" => $reserva,
        "consumo" => $consumo,
        "abonos" => $abonos
    );
    //return json_encode($data);
    $pdf= PDF::loadView('ResumenReservaEstancia',compact('data'));        
        $pdf->setPaper(array(0,0,595.28,420.94),'portrait');        
        return $pdf->stream('resumenreserva.pdf');    
    }
}