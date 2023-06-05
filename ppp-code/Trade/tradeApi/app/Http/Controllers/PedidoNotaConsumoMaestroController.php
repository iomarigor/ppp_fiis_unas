<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\PedidoNotaConsumoMaestro;
use App\PedidoNotaConsumoMaestroDetalle;
use Illuminate\Support\Facades\Validator;
use App\Establecimiento;
use PDF;
use Codedge\Fpdf\Fpdf\Fpdf;
use App\NumerosEnLetras;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class PedidoNotaConsumoMaestroController extends Controller
{

    public function index(Request $request){
        $pedido = DB::table('pedido_nota_consumo_maestro as pedd')
        ->join('pedido_nota_consumo_maestro_detalle as ped','ped.pedido_nota_consumo_maestro_id','=','pedd.pedido_nota_consumo_maestro_id')
        ->leftjoin('persona as per','per.persona_id','=','pedd.persona_id')
        ->leftjoin('habitacion as ha','ha.habitacion_id','=','pedd.habitacion_id')        
        ->select(DB::raw("ifnull(pedd.reserva_estancia_id,0) as reserva_estancia_id,ped.pedido_nota_consumo_maestro_id,ifnull(per.persona_id,0) as persona_id,ifnull(per.razon_social_nombre,'-') AS cliente,ha.numero_habitacion,pedd.fecha_emision,sum(ped.sub_total) AS importe"))
        ->where('pedd.estado','=','0')
        ->groupBy('pedd.pedido_nota_consumo_maestro_id')
        ->get(); 
        $pedidoT=[];
        foreach($pedido as $dp){
            $pedidoDetalle = DB::table('pedido_nota_consumo_maestro_detalle as pedd')        
            ->join('producto as p','p.producto_id','=','pedd.producto_id')
            ->join('unidad_medida as um','um.unidad_medida_id','=','pedd.unidad_medida_id')
            ->select('pedd.*',DB::raw('p.denominacion,um.abreviatura'))     
            ->where('pedd.pedido_nota_consumo_maestro_id','=',$dp->pedido_nota_consumo_maestro_id)
            ->where('pedd.estado_facturacion','=','0')
            ->get();
            $dp->detalleCant=count($pedidoDetalle);
            array_push($pedidoT, $dp);
        }
        if(!$pedido->count()==0){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($pedidoT),
                "detalles"=>$pedidoT			    		
            );
            
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"No hay ningún pedido registrado",
                "detalles"=>null			    		
            );
        } 
    	return json_encode($json, true);
    }

    public function get_pedido_nota_consumo_maestro($id){
        $pedido_id=$id;
        $pedido = DB::table('pedido_nota_consumo_maestro as pncm')
        ->join('persona as per','per.persona_id','=','pncm.persona_id')
        ->leftjoin('habitacion as h','h.habitacion_id','=','pncm.habitacion_id')
        ->leftjoin('reserva_estancia as re','re.reserva_estancia_id','=','pncm.reserva_estancia_id')
        ->select('pncm.pedido_nota_consumo_maestro_id','pncm.fecha_emision','per.razon_social_nombre','h.numero_habitacion','pncm.reserva_estancia_id','pncm.estado')
        ->where([
            ['pncm.pedido_nota_consumo_maestro_id','=',$pedido_id]
        ])
        ->get();
           
        $pedido_detalle = DB::table('pedido_nota_consumo_maestro_detalle as pncmd')       
        ->join('producto as pro', 'pro.producto_id', '=', 'pncmd.producto_id')
        ->join('unidad_medida as um', 'um.unidad_medida_id', '=', 'pncmd.unidad_medida_id')
        ->where('pncmd.pedido_nota_consumo_maestro_id','=',$pedido_id)
        ->select('pncmd.pedido_nota_consumo_maestro_id','pro.producto_id','pro.denominacion','um.abreviatura','pncmd.cantidad','pncmd.precio_unitario','pncmd.precio_unitario',
        'pncmd.sub_total','pncmd.estado_facturacion')
        ->get();

        if(!$pedido->count()==0){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($pedido),
                "cabecera"=>$pedido,
                "detalles"=>$pedido_detalle		    		
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
    public function get_list_pedido_nota_consumo_maestro($id,$tipo){
        $pedido_id=$id;
        $pedido = DB::table('pedido_nota_consumo_maestro as pncm')
        ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncmd.pedido_nota_consumo_maestro_id','=','pncm.pedido_nota_consumo_maestro_id')
        ->join('producto as pro','pro.producto_id','=','pncmd.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','pncmd.unidad_medida_id')
        ->leftJoin('persona as per','per.persona_id','=','pncm.persona_id')
        ->leftJoin('habitacion as h','h.habitacion_id','=','pncm.habitacion_id')
        ->leftJoin('reserva_estancia as re','re.reserva_estancia_id','=','pncm.reserva_estancia_id')
        ->select('pncm.pedido_nota_consumo_maestro_id','pncm.fecha_emision','per.razon_social_nombre','h.numero_habitacion','pncm.reserva_estancia_id','pro.producto_id','pro.denominacion','um.abreviatura','pncmd.cantidad','pncmd.precio_unitario','pncmd.precio_unitario',
        'pncmd.sub_total','pncmd.estado_facturacion')
        ->where([
            ['pncm.reserva_estancia_id','=',$pedido_id],
            ['pncm.tipo','=',$tipo]
        ])
        ->get();
                    
        if(!$pedido->count()==0){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($pedido),
                "detalles"=>$pedido			    		
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

    public function set_pedido_nota_consumo_maestro(Request $request){
        $json = array();        
        $reservaEstanciaTemp=DB::table('reserva_estancia')
        ->where("reserva_estancia_id","=",$request->input("reserva_estancia_id") )
        ->get()[0];
        
        //Recoger datos
        $pedido = array( 
            "tipo"=>$request->input("tipo"),         
            "habitacion_id"=>$request->input("habitacion_id"),
            "reserva_estancia_id"=>$request->input("reserva_estancia_id"),
            "persona_id"=>$reservaEstanciaTemp->persona_id        
        );   
              
        $pedido_detalle =$request->input("detalles");
        if(!empty($pedido)){
        
            //Validar datos
            $validator = Validator::make($pedido, [
                'habitacion_id' => 'required|numeric'
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
                $pedidos_id = DB::table('pedido_nota_consumo_maestro')->insertGetId([
                    'tipo'=>$pedido['tipo'],
                    'habitacion_id'=>$pedido['habitacion_id'],  
                    'reserva_estancia_id'  => $pedido['reserva_estancia_id'],
                    "persona_id"=>$pedido['persona_id']
                ]);               

                foreach($pedido_detalle as $value){
                    $detalle = new PedidoNotaConsumoMaestroDetalle(); 
                    $detalle->pedido_nota_consumo_maestro_id=$pedidos_id;
                    $detalle->producto_id=$value['producto_id'];
                    $detalle->unidad_medida_id=$value['unidad_medida_id'];
                    $detalle->cantidad=$value['cantidad'];
                    $detalle->precio_unitario=$value['precio_unitario'];
                    $detalle->sub_total=$value['sub_total'];
                    $detalle->save();
                    DB::table('producto')
                    ->where('producto_id',$value['producto_id'])
                    ->update(['existencia' => DB::raw('existencia -'. intval($value['cantidad']))]);
                }
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro exitoso, su curso ha sido guardado",
                    "detalles"=> $pedido                       
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


    public function del_pedido_nota_consumo_maestro(Request $request){
        $pedido_id = $request->input("pedido_nota_consumo_maestro_id");
        
    	$json = array();
        $validar = PedidoNotaConsumoMaestro::where('pedido_nota_consumo_maestro_id','=', $pedido_id
        )->get();
        if(!$validar->count()==0){     
                           
            $pedido = PedidoNotaConsumoMaestro::where('pedido_nota_consumo_maestro_id','=', $pedido_id                
            )->delete();
            $pedido_detalleTemp=PedidoNotaConsumoMaestroDetalle::where('pedido_nota_consumo_maestro_id','=', $pedido_id                
            )->get()[0];
            DB::table('producto')
                    ->where('producto_id',$pedido_detalleTemp->producto_id)
                    ->update(['existencia' => DB::raw('existencia +'. intval($pedido_detalleTemp->cantidad))]);
            /* echo json_encode($pedido_detalleTemp);
            return; */
            $pedido_detalle = PedidoNotaConsumoMaestroDetalle::where('pedido_nota_consumo_maestro_id','=', $pedido_id                
            )->delete();
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

    public function get_habitacion_reserva_modal(Request $request){
        $habitacion = DB::table('reserva_estancia as re')
        ->join('reserva_estancia_habitacion as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
        ->join('habitacion as ha','ha.habitacion_id','=','reh.habitacion_id') 
        ->join('persona as per','per.persona_id','=','re.persona_id')               
        ->select(DB::raw("ha.habitacion_id,reh.reserva_estancia_id,per.razon_social_nombre,ha.numero_habitacion"))
        ->where([
            ['re.estado','=',1],
            ['re.tipo_reserva_estancia','=',1],
            ['ha.numero_habitacion','like','%'.$request->get("parametro").'%']
        ])
        ->orWhere([
            ['re.estado','=',1],
            ['re.tipo_reserva_estancia','=',1],
            ['per.razon_social_nombre','like','%'.strtoupper($request->get("parametro")).'%'],
        ])
        ->orWhere([
            ['re.estado','=',1],
            ['re.tipo_reserva_estancia','=',1],
            ['per.nombre_comercial','like','%'.strtoupper($request->get("parametro")).'%']
        ])
        ->get(); 

        if(!$habitacion->count()==0){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($habitacion),
                "detalles"=>$habitacion			    		
            );
            
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"No hay ningún pedido registrado",
                "detalles"=>null			    		
            );
        } 
    	return json_encode($json, true); 
    }

    public function set_pedido_nota_consumo_maestro_form_pedido(Request $request){
        $json = array();        
        
        //Recoger datos
        $pedido = array( 
            "persona_id" => $request->input("persona_id"),
            "tipo"=>$request->input("tipo"),         
            "habitacion_id"=>$request->input("habitacion_id"),
            "reserva_estancia_id"=>$request->input("reserva_estancia_id")            
        );             
        $pedido_detalle =$request->input("detalles");
        if(!empty($pedido)){
        
            //Validar datos
            if($pedido['tipo']=='CS'){
                $validator = Validator::make($pedido, [
                    'habitacion_id' => 'required'
                ]);
            }else{
                $validator = Validator::make($pedido, [
                    'persona_id' => 'required|numeric'
                ]);
            }
            
            //Si falla la validación
            if ($validator->fails()) {
                $errors = $validator->errors();
                $json = array(                    
                    "status"=>400,
                    "mensaje"=>$errors,
                    "detalles"=>null                    
                );
               
            }else{
                $pedidos_id = DB::table('pedido_nota_consumo_maestro')->insertGetId([
                    'persona_id' => $pedido['persona_id'],
                    'tipo'=>$pedido['tipo'],
                    'habitacion_id'=>$pedido['habitacion_id'],  
                    'reserva_estancia_id'  => $pedido['reserva_estancia_id']
                ]);               

                foreach($pedido_detalle as $value){
                    $pedido_detalle = new PedidoNotaConsumoMaestroDetalle(); 
                    $pedido_detalle->pedido_nota_consumo_maestro_id=$pedidos_id;
                    $pedido_detalle->producto_id=$value['producto_id'];
                    $pedido_detalle->unidad_medida_id=$value['unidad_medida_id'];
                    $pedido_detalle->cantidad=$value['cantidad'];
                    $pedido_detalle->precio_unitario=$value['precio_unitario'];
                    $pedido_detalle->sub_total=$value['sub_total'];
                    $pedido_detalle->save();
                    DB::table('producto')
                    ->where('producto_id',$value['producto_id'])
                    ->update(['existencia' => DB::raw('existencia -'. intval($value['cantidad']))]);
                }
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro exitoso, su curso ha sido guardado",
                    "detalles"=> $pedido                       
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

    public function get_pedido_cabecera_detalle_lista($id){      

        $pedido = DB::table('pedido_nota_consumo_maestro as ped')         
         ->leftJoin('persona as p','p.persona_id','=','ped.persona_id')
         ->leftJoin('habitacion as h','h.habitacion_id','=','ped.habitacion_id')
         ->select('ped.*','p.razon_social_nombre','p.numero_documento','h.numero_habitacion')
         ->where('ped.pedido_nota_consumo_maestro_id','=',$id)
         ->get();
 
         $pedidoDetalle = DB::table('pedido_nota_consumo_maestro_detalle as pedd')        
         ->join('producto as p','p.producto_id','=','pedd.producto_id')
         ->join('unidad_medida as um','um.unidad_medida_id','=','pedd.unidad_medida_id')
         ->select('pedd.*',DB::raw('p.denominacion,um.abreviatura'))     
         ->where('pedd.pedido_nota_consumo_maestro_id','=',$id)
         ->orderBy('pedd.estado_facturacion', 'asc')
         ->get();
 
         $json = array();
         if(!empty($pedido)){
 
             $json = array(
 
                 "status"=>200,
                 "mensaje"=>"total_registros".count($pedido),
                 "detalles"=> array(
                         "pedido"=> $pedido,
                         "detalle" => $pedidoDetalle
                         )				
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
    public function get_pedido_print($id){   
            $pedido = DB::table('pedido_nota_consumo_maestro as ped')         
         ->leftJoin('persona as p','p.persona_id','=','ped.persona_id')
         ->leftJoin('habitacion as h','h.habitacion_id','=','ped.habitacion_id')
         ->select('ped.*','p.razon_social_nombre','p.numero_documento','h.numero_habitacion','p.direccion')
         ->where('ped.pedido_nota_consumo_maestro_id','=',$id)
         ->get();
         
         $pedidoDetalle = DB::table('pedido_nota_consumo_maestro_detalle as pedd')        
         ->join('producto as p','p.producto_id','=','pedd.producto_id')
         ->join('unidad_medida as um','um.unidad_medida_id','=','pedd.unidad_medida_id')
         ->select('pedd.*',DB::raw('p.denominacion,um.abreviatura'))     
         ->where('pedd.pedido_nota_consumo_maestro_id','=',$id)
         ->get();
 
        $establecimiento = Establecimiento::first();

        if(empty($pedido)|| (count($pedido)==0)){
            return json_encode(array(
                "status"=>400,
                "mensaje"=>"No hay ningún curso registrado",
                "detalles"=>null				
            ));
          }

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
        $textypost += 4;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->SetFont('Courier', 'B', 11);
        $fpdf->Cell(0,0,utf8_decode("PEDIDO: N° ".$pedido[0]->pedido_nota_consumo_maestro_id),0,1,"C");
        $textypost+=4;

        $fpdf->Line(1,$textypost,79,$textypost);

        $textypost+=3;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y', strtotime(explode(' ',$pedido[0]->fecha_emision)[0])) . str_pad("HORA: " . date("H:i:s", strtotime(explode(' ',$pedido[0]->fecha_emision)[1])), 17, ' ', STR_PAD_LEFT));
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0, 0, utf8_decode("NOMBRE O RAZóN SOCIAL: ") . str_pad("RUC/DNI:" . utf8_decode($pedido[0]->numero_documento), 19, ' ', STR_PAD_LEFT));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost); 
        $fpdf->MultiCell(0, 3, utf8_decode($pedido[0]->razon_social_nombre));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("DIRECCIóN: ") . str_split(utf8_decode($pedido[0]->direccion), 27)[0]);
        

        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);
        
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("CANT. DESCRIPCIóN        P. UNIT SUB TOTAL"));
        $textypost += 2;
        $fpdf->Line(1, $textypost, 79, $textypost);

        $textypost += 2;
        $count=0;
		$total=0;
		$descontar=0;
		$totalPagar=0;
        foreach($pedidoDetalle as $rM){
            $count++;
            $total+=floatval($rM->sub_total);
            //$descontar=$rM->descuento;
            $fpdf->SetXY(2, $textypost);
            $fpdf->MultiCell(0, 3, '*' . utf8_decode($rM->denominacion));
            $y3 = $fpdf->GetY();
            $textypost = $y3 + 2;
            $fpdf->SetXY(2, $textypost);
            $fpdf->Cell(0, 0, str_pad(number_format(floatval($rM->cantidad), 2, '.', ','), (8 - strlen(floatval($rM->cantidad))) + strlen(floatval($rM->cantidad)), ' ', STR_PAD_LEFT) . " ".str_pad(utf8_decode($rM->abreviatura), 10, ' ', STR_PAD_LEFT)." " . str_pad(number_format($rM->precio_unitario, 2, '.', ','), 12, ' ', STR_PAD_LEFT) . " " . str_pad(number_format(($rM->sub_total), 2, '.', ','), (9 - strlen(number_format(($rM->sub_total), 2, '.', ','))) + strlen(number_format(($rM->sub_total), 2, '.', ',')), ' ', STR_PAD_LEFT));
            $textypost += 3;
        }
        $fpdf->Line(1, $textypost, 79, $textypost);
        if($pedido[0]->numero_habitacion){
            $textypost+=4;
            $fpdf->setXY(5,$textypost);
            $fpdf->Cell(0,0,utf8_decode("HABITACIÓN: N° ".$pedido[0]->numero_habitacion),0,1,"C");
            $textypost+=4;
            $fpdf->Line(1,$textypost,79,$textypost);
        }
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, "SON: " . NumerosEnLetras::convertir(number_format($total, 2, '.', ','), 'soles',false,'centimos'));
        $y4 = $fpdf->GetY();
        $textypost = $y4 + 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        $fpdf->Cell(0, 0, "OP. EXONERADAS  : S/" . str_pad(number_format($total, 2, '.', ','), (10 - strlen($total)) + strlen($total), ' ', STR_PAD_LEFT));
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        $fpdf->Cell(0, 0, "DESCUENTO       : S/" . str_pad(number_format($descontar, 2, '.', ','), (10 - strlen($descontar)) + strlen($descontar), ' ', STR_PAD_LEFT));
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        //$facturacion->totaligv
        $fpdf->Cell(0, 0, "IGV             : S/" . str_pad(number_format(0, 2, '.', ','), (10 - strlen(0)) + strlen(0), ' ', STR_PAD_LEFT));
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        //$facturacion->totalventas
        $fpdf->Cell(0, 0, "TOTAL A PAGAR   : S/" . str_pad(number_format($total, 2, '.', ','), (10 - strlen($total)) + strlen($total), ' ', STR_PAD_LEFT));
        $textypost += 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 5;
        $fpdf->SetXY(9, $textypost);
        $fpdf->Cell(0, 0, "GRACIAS POR SU PREFERENCIA...!!", 0, 1, "C");
        $fpdf->Output();
        exit;
    }

    public function set_pedido_nota_consumo_maestro_form_pedido_update(Request $request){
		
        $pedido = $request->input('pedido');
        $idpedido = $pedido['pedido_nota_consumo_maestro_id'];

        $detalle = $request->input('detalle');
		//Recoger datos
		$datosPedido = array( 
            "persona_id"=>$pedido['persona_id'],            
            "tipo"=>$pedido['tipo'],
            "habitacion_id"=>$pedido["habitacion_id"],
            "reserva_estancia_id"=>$pedido["reserva_estancia_id"]            
        );

		if(!empty($datosPedido)){         
			$validar = DB::table('pedido_nota_consumo_maestro')		
			->where('pedido_nota_consumo_maestro_id','=',$idpedido)            
			->get();

			if (!$validar->count()==0){
				$pedidos = PedidoNotaConsumoMaestro::where("pedido_nota_consumo_maestro_id", $idpedido)->update($datosPedido);
                //ELIMINAMOS PRIMERO EL DETALLE DE FACTURA
                $pedidodetalle = PedidoNotaConsumoMaestroDetalle::where("pedido_nota_consumo_maestro_id", $idpedido)->delete();
                foreach($detalle as $value){
                    $detalle = new PedidoNotaConsumoMaestroDetalle(); 
                    $detalle->pedido_nota_consumo_maestro_id=$idpedido;
                    $detalle->producto_id=$value['producto_id'];
                    $detalle->unidad_medida_id=$value['unidad_medida_id'];
                    $detalle->cantidad=$value['cantidad'];
                    $detalle->precio_unitario=$value['precio_unitario'];                   
                    $detalle->sub_total=$value['sub_total'];
                    $detalle->save();
                }

				$json = array(
					"status"=>200,
					"mensaje"=>"Registro exitoso, ha sido actualizado",
					"detalles"=>$datosPedido                            
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

    public function set_pedido_nota_consumo_maestro_y_detalle_delete(Request $request){
        $id = $request->input("pedido_nota_consumo_maestro_id");
    	$json = array();
        $validar = PedidoNotaConsumoMaestro::where("pedido_nota_consumo_maestro_id", $id)->get();
        if(!$validar->count()==0){                     
            $pedido = PedidoNotaConsumoMaestro::where("pedido_nota_consumo_maestro_id", $id)->update(['estado'=>-1]);
            //$pedidoDetalle = PedidoNotaConsumoMaestroDetalle::where("pedido_nota_consumo_maestro_id", $id)->delete();
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
}

