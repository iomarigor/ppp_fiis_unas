<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Pago;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PDF;
use App\Establecimiento;
use Codedge\Fpdf\Fpdf\Fpdf;
class PagoController extends Controller
{
    public function index(Request $request){

    	
    	$json = array(); 
        //AQUI SE GENERA LA CONSULTA
        
        $pago = DB::table('pago')->get();

        if(!empty($pago)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($pago),
                "detalles"=>$pago			    		
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

    public function registrar_pagos(Request $request){
    
    	$json = array();


        //Recoger datos
        $datos = array( 
            "concepto"=>$request->input("concepto"),
            "fecha_hora_deposito"=>$request->input("fecha_hora_deposito"),
            "medio_pago"=>$request->input("medio_pago"),
            "entidad_bancaria"=>$request->input("entidad_bancaria"),
            "numero_deposito"=>$request->input("numero_deposito"),
            "monto_deposito"=>$request->input("monto_deposito"),
            "tipo_moneda"=>$request->input("tipo_moneda"),                
            "reserva_estancia_id"=>$request->input("reserva_estancia_id"),
            "habitacion_id"=>$request->input("habitacion_id"),
            "estado"=>0
        );             
        
        if(!empty($datos)){
            //VALIDAD SI MONTO ENVIADO ES MAYOR A SALDO DE CUENTA DE HUESPED
            $consumo = DB::table('pedido_nota_consumo_maestro as pncm')
            ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncm.pedido_nota_consumo_maestro_id','=','pncmd.pedido_nota_consumo_maestro_id')
            ->select('pncm.reserva_estancia_id',DB::raw('SUM(pncmd.sub_total) AS subtotal'))
            ->groupBy('pncm.reserva_estancia_id');
            $saldos = DB::table('reserva_estancia as re')       
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
            ->where('re.reserva_estancia_id','=',$datos['reserva_estancia_id'])
            ->groupBy('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
            're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.estado','re.numero_ninos','re.codigo_reserva','h.numero_habitacion','ch.clase_habitacion','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
                ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
            'pt.descripcion','pt.tarifa','reh.early_checkin','reh.late_checkout','pt.numero_noches','consumo.subtotal','cvr.canales_venta_reserva')
            ->get();
                //return json_encode($saldos);
            //$saldon=$saldos[0]->saldo-$request->input("monto_deposito");
            //$saldon=$saldos[0]->saldo;
           $saldon=floatval($saldos[0]->saldo)-floatval($request->input("monto_deposito"));
            /* foreach($saldos as $saldo=>$value){
                $saldon+=$saldo;
            } */
           
            if($saldon >= 0){
                //Validar datos
                $validator = Validator::make($datos, [
                    'concepto' => 'required|string|max:45',
                    'monto_deposito' => 'required|numeric',

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
                    $codigopago = $this->generate_code_pago(9);
                    $iddocumento = $this->genera_nro_comprobante_pago();
                    $pagos = new Pago();
                    $pagos->iddocumento = $iddocumento;
                    $pagos->codigo_pago = $codigopago;
                    $pagos->concepto = $datos["concepto"];
                    $pagos->fecha_hora_deposito = $datos["fecha_hora_deposito"];
                    $pagos->medio_pago = $datos["medio_pago"];
                    $pagos->entidad_bancaria = $datos["entidad_bancaria"];
                    $pagos->monto_deposito = $datos["monto_deposito"];
                    $pagos->numero_deposito = $datos["numero_deposito"];
                    $pagos->tipo_moneda = $datos["tipo_moneda"];
                    $pagos->reserva_estancia_id = $datos["reserva_estancia_id"];
                    $pagos->habitacion_id = $datos["habitacion_id"];
                    $pagos->estado=$datos["estado"];
                    $pagos->save();

                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Registro exitoso, su curso ha sido guardado",
                        "detalles"=> $pagos                       
                    );            
                }
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"El monto que intentando registrar excede al saldo",
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

    public function actualizar_pagos(Request $request){
        $id = $request->input("pago_id");
    	$json = array();
        //Recoger datos
        $datos = array( "concepto"=>$request->input("concepto"),
                        "fecha_hora_deposito"=>$request->input("fecha_hora_deposito"),
                        "medio_pago"=>$request->input("medio_pago"),
                        "entidad_bancaria"=>$request->input("entidad_bancaria"),
                        "numero_deposito"=>$request->input("numero_deposito"),
                        "monto_deposito"=>$request->input("monto_deposito"),
                        "tipo_moneda"=>$request->input("tipo_moneda")
        );

        if(!empty($datos)){         
            $validar = DB::table('pago')		
            ->where('pago_id','=',$id)            
            ->get();

            if (!$validar->count()==0){
                $vuelo = Pago::where("pago_id", $id)->update($datos);
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
    
    public function delete_pago(Request $request){
        $id = $request->input("pago_id");
    	$json = array();
        $validar = Pago::where("pago_id", $id)->get();
        if(!$validar->count()==0){                     
            $pago = Pago::where("pago_id", $id)->update(["estado"=>-1]);
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
    
    public function mostrar_pagos_reserva_estancia($id){
        $reserva_id=$id;
        $pagos = DB::table('pago')
        ->where([['pago.reserva_estancia_id',"=",$reserva_id],['pago.estado','!=',-1]])
        ->get();
                    
        if(!$pagos->count()==0){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($pagos),
                "detalles"=>$pagos			    		
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
    private function generate_code_pago($longitud) {
        $key = '';
        $pattern = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $max = strlen($pattern)-1;

        for($i=0;$i < $longitud;$i++) $key .= $pattern[mt_rand(0,$max)];        

        if ($this->check_code_pago($key) > 0) {
            $this->generate_code_pago(9);
        } else {
            return $key;
        }
    }
    private function check_code_pago($code) {
        return DB::table('pago')                
                ->where('codigo_pago','=',$code)->count();
    }

    public function pdf_nota_pago($id){
        $pagos = DB::table('pago')
        ->join('reserva_estancia','reserva_estancia.reserva_estancia_id','pago.reserva_estancia_id')
        ->join('habitacion','habitacion.habitacion_id','pago.habitacion_id')
        ->join('persona','persona.persona_id','reserva_estancia.persona_id')
        ->leftJoin('bancos','bancos.idbanco','pago.entidad_bancaria')
        ->select('persona.razon_social_nombre','persona.numero_documento','habitacion.numero_habitacion','pago.concepto','pago.fecha_hora_deposito',
          DB::raw("(CASE WHEN pago.medio_pago = 1 THEN 'DEPOSITO EN CUENTA' 
                         WHEN pago.medio_pago = 2 THEN 'TRANSFERENCIA BANCARIA' END) AS medio_pago"),
          'pago.entidad_bancaria','pago.numero_deposito','pago.monto_deposito',
          DB::raw("(CASE WHEN pago.tipo_moneda = 1 THEN 'SOLES' 
                         WHEN pago.tipo_moneda = 2 THEN 'DORALES' 
                         WHEN pago.tipo_moneda = 3 THEN 'EUROS' END) AS tipo_moneda"),'bancos.banco','pago.iddocumento')
        ->where([['pago.pago_id',"=",$id],['pago.estado','!=',-1]])
        ->get();
        
        $pdf= PDF::loadView('NotaPago',compact('pagos'));        
        $pdf->setPaper(array(0,0,595.28,420.94),'portrait');        
        return $pdf->stream('notapago.pdf');
    }
    public function pdf_nota_pago_ticket($id){
        $pagos = DB::table('pago')
        ->join('reserva_estancia','reserva_estancia.reserva_estancia_id','pago.reserva_estancia_id')
        ->join('habitacion','habitacion.habitacion_id','pago.habitacion_id')
        ->join('persona','persona.persona_id','reserva_estancia.persona_id')
        ->leftJoin('bancos','bancos.idbanco','pago.entidad_bancaria')
        ->select('persona.razon_social_nombre','persona.numero_documento','habitacion.numero_habitacion','pago.concepto','pago.fecha_hora_deposito',
          DB::raw("(CASE WHEN pago.medio_pago = 1 THEN 'DEPOSITO EN CUENTA' 
                         WHEN pago.medio_pago = 2 THEN 'TRANSFERENCIA BANCARIA' END) AS medio_pago"),
          'pago.entidad_bancaria','pago.numero_deposito','pago.monto_deposito',
          DB::raw("(CASE WHEN pago.tipo_moneda = 1 THEN 'SOLES' 
                         WHEN pago.tipo_moneda = 2 THEN 'DORALES' 
                         WHEN pago.tipo_moneda = 3 THEN 'EUROS' END) AS tipo_moneda"),'bancos.banco','pago.iddocumento')
        ->where([['pago.pago_id',"=",$id],['pago.estado','!=',-1]])
        ->get();
        $establecimiento = Establecimiento::first();
        $fpdf= new Fpdf('P','mm',array(80,350));
        $fpdf->AddPage();
        $fpdf->SetFont('Courier', 'B', 8);
        $textypost=5;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,$establecimiento->nombre_comercial,0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"RUC:".$establecimiento->numero_documento,0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DIRECCIÓN FISCAL:".$establecimiento->direccion_fiscal),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("DIRECCIÓN:".$establecimiento->direccion),0,1,"C");

        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->SetFont('Courier', 'B', 11);
        $fpdf->Cell(0,0,( "NOTA DE PAGO"),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->SetFont('Courier', 'B', 11);
        
            ///==================Numero de nota de pago
            $fpdf->Cell(0,0,$pagos[0]->iddocumento,0,1,"C");
        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=3;
        $fpdf->setXY(2,$textypost);
        /* $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y') . str_pad("HORA: " . date("H:i:s"), 17, ' ', STR_PAD_LEFT));
        $textypost+=4;        
        $fpdf->setXY(2,$textypost); */
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y') . str_pad("HORA: " . date("H:i:s"), 17, ' ', STR_PAD_LEFT));
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0, 0, utf8_decode("NOMBRE O RAZóN SOCIAL: ") . str_pad("RUC/DNI:" . utf8_decode($pagos[0]->numero_documento), 19, ' ', STR_PAD_LEFT));
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode($pagos[0]->razon_social_nombre));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("DIRECCIóN: ") . str_split(utf8_decode(""), 27)[0]);
        $textypost += 8;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("ENTIDAD BANCARIA: ") . utf8_decode($pagos[0]->banco));
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("MEDIO DE PAGO: ") . utf8_decode($pagos[0]->medio_pago));
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("HABITACIÓN: ") . utf8_decode($pagos[0]->numero_habitacion));
        $textypost+=4;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("F.PAGO CONCEPTO              MONEDA IMPORTE"));
        $textypost += 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 2;

            $fpdf->SetXY(2, $textypost);
            $fpdf->MultiCell(0, 3, '*' . utf8_decode($pagos[0]->concepto));
            $y3 = $fpdf->GetY();
            $textypost = $y3 + 2;
            $fpdf->SetXY(2, $textypost);
            $fpdf->Cell(0, 0, str_pad(utf8_decode(explode(' ',($pagos[0]->fecha_hora_deposito))[0]), 29,' ', STR_PAD_RIGHT)." " . str_pad($pagos[0]->tipo_moneda, 4, STR_PAD_LEFT). " " . str_pad($pagos[0]->monto_deposito, 4, STR_PAD_LEFT));
            $textypost += 3;
        $fpdf->Line(1, $textypost, 79, $textypost);
        
        $fpdf->Output();
        exit;       
        
    }
  
    private function genera_nro_comprobante_pago(){
        $pagos = DB::table('pago')
        ->selectRaw("CONCAT('NP01','-',repeat('0',7-CHAR_LENGTH((ifnull(convert(MAX(RIGHT(pago.iddocumento,7)), UNSIGNED),0)+1))),(ifnull(convert(MAX(RIGHT(pago.iddocumento,7)), UNSIGNED),0)+1)) as iddocumento")
        ->get();
        $iddocumento="NP01-0000000";
        foreach($pagos as $value){
            $iddocumento = $value->iddocumento;
        }        
        return $iddocumento;
    }

}