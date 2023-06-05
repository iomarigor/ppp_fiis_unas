<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use App\Proforma;
use App\ProformaDetalle;
use Illuminate\Support\Facades\Validator;
use App\Establecimiento;
use PDF;
use Codedge\Fpdf\Fpdf\Fpdf;
use App\NumerosEnLetras;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class ProformaController extends Controller
{
    public function index(Request $request){
        $proforma = DB::table('proforma as prof')
        ->join('persona as per','per.persona_id','=','prof.persona_id')
        ->select(DB::raw("prof.*,per.razon_social_nombre,per.numero_documento"))
        ->where('prof.estado','=','0')       
        ->get(); 
        $proformaT=[];
        foreach($proforma as $pf){
            $proformaDetalle = DB::table('proforma_detalle as prod')        
            ->join('producto as pro','pro.producto_id','=','prod.id_producto')
            ->leftJoin('unidad_medida as um','um.unidad_medida_id','=','prod.unidad_medida_id')
            ->select('prod.*',DB::raw('pro.denominacion,um.abreviatura'))     
            ->where('prod.id_proforma','=',$pf->id)
            ->where('prod.estado_facturacion','=','0')
            ->get();
            $pf->detalleCant= count($proformaDetalle);
            array_push($proformaT,$pf);
        }
        if(!$proforma->count()==0){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($proformaT),
                "detalles"=>$proformaT			    		
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

    public function set_proforma_detalle_insert(Request $request){
        $json = array();        
        
        //Recoger datos
        $proforma = array( 
            "persona_id"=>$request->input("persona_id"),         
            "fecha_emision"=>$request->input("fecha_emision"),
            "sub_total"=>$request->input("sub_total"),
            "igv"=>$request->input("igv"),         
            "total_neto"=>$request->input("total_neto"),
            "total_productos"=>$request->input("total_productos"), 
            "id_vendedor"=>$request->input("id_vendedor"),         
            "id_sucursal"=>$request->input("id_sucursal")
        );             
        $proforma_detalle =$request->input("detalle");

        if(!empty($proforma)){
        
            //Validar datos
            $validator = Validator::make($proforma, [
                'persona_id' => 'required|numeric'
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
                $proforma_id = DB::table('proforma')->insertGetId([
                    'persona_id'=>$proforma['persona_id'],
                    'fecha_emision'=>$proforma['fecha_emision'],  
                    'sub_total'  => $proforma['sub_total'],
                    'igv'=>$proforma['igv'],
                    'total_neto'=>$proforma['total_neto'],  
                    'total_productos'  => $proforma['total_productos'],
                    'id_vendedor'=>$proforma['id_vendedor'],
                    'id_sucursal'=>$proforma['id_sucursal']
                ]);               

                foreach($proforma_detalle as $value){
                    $detalle = new ProformaDetalle(); 
                    $detalle->id_proforma=$proforma_id;
                    $detalle->id_producto=$value['id_producto'];
                    $detalle->unidad_medida_id=$value['unidad_medida_id'];
                    $detalle->cantidad=$value['cantidad'];
                    $detalle->precio_venta=$value['precio_venta'];
                    $detalle->sub_total=$value['sub_total'];
                    $detalle->save();
                }
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro exitoso, su curso ha sido guardado",
                    "detalles"=> $proforma                       
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
    public function set_proforma_detalle_update(Request $request){
		
        $proforma = $request->input('proforma');
        $idproforma = $proforma['id'];

        $detalle = $request->input('detalle');
		//Recoger datos
		$datosProforma = array( 
            "persona_id"=>$proforma['persona_id'],         
            "fecha_emision"=>$proforma["fecha_emision"],
            "sub_total"=>$proforma["sub_total"],
            "igv"=>$proforma["igv"],         
            "total_neto"=>$proforma["total_neto"],
            "total_productos"=>$proforma["total_productos"], 
            "id_vendedor"=>$proforma["id_vendedor"],         
            "id_sucursal"=>$proforma["id_sucursal"]       
        );

		if(!empty($datosProforma)){         
			$validar = DB::table('proforma')		
			->where('id','=',$idproforma)            
			->get();

			if (!$validar->count()==0){
				$proforma = Proforma::where("id", $idproforma)->update($datosProforma);
                //ELIMINAMOS PRIMERO EL DETALLE DE FACTURA
                $proformadetalle = ProformaDetalle::where("id_proforma", $idproforma)->delete();
                foreach($detalle as $value){
                    $detalle = new ProformaDetalle();                     
                    $detalle->id_proforma=$idproforma;
                    $detalle->id_producto=$value['id_producto'];
                    $detalle->unidad_medida_id=$value['unidad_medida_id'];
                    $detalle->cantidad=$value['cantidad'];
                    $detalle->precio_venta=$value['precio_venta'];
                    $detalle->sub_total=$value['sub_total'];
                    $detalle->save();
                }

				$json = array(
					"status"=>200,
					"mensaje"=>"Registro exitoso, ha sido actualizado",
					"detalles"=>$datosProforma                            
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

    public function get_proforma_cabecera_detalle_lista($id){      

        $proforma = DB::table('proforma as prof')         
         ->join('persona as per','per.persona_id','=','prof.persona_id')         
         ->select('prof.*',DB::raw('per.razon_social_nombre,per.numero_documento'))
         ->where('prof.id','=',$id)
         ->get();
 
         $proformaDetalle = DB::table('proforma_detalle as prod')        
         ->join('producto as pro','pro.producto_id','=','prod.id_producto')
         ->leftJoin('unidad_medida as um','um.unidad_medida_id','=','prod.unidad_medida_id')
         ->select('prod.*',DB::raw('pro.denominacion,um.abreviatura'))     
         ->where('prod.id_proforma','=',$id)
         ->orderBy('prod.estado_facturacion', 'asc')
         ->get();
 
         $json = array();
         if(!empty($proforma)){
 
             $json = array(
 
                 "status"=>200,
                 "mensaje"=>"total_registros".count($proforma),
                 "detalles"=> array(
                         "proforma"=> $proforma,
                         "detalle" => $proformaDetalle
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
    public function get_proforma_print($id){      

        $proforma = DB::table('proforma as prof')         
         ->join('persona as per','per.persona_id','=','prof.persona_id')         
         ->select('prof.*',DB::raw('per.razon_social_nombre,per.numero_documento, per.direccion'))
         ->where('prof.id','=',$id)
         ->get();
         $proformaDetalle = DB::table('proforma_detalle as prod')        
         ->join('producto as pro','pro.producto_id','=','prod.id_producto')
         ->leftJoin('unidad_medida as um','um.unidad_medida_id','=','prod.unidad_medida_id')
         ->select('prod.*',DB::raw('pro.denominacion,um.abreviatura'))     
         ->where('prod.id_proforma','=',$id)
         ->get();
         $establecimiento = Establecimiento::first();
         if(empty($proforma)|| (count($proforma)==0)){
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
        $fpdf->Cell(0,0,("PROFORMA"),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->SetFont('Courier', 'B', 11);
        
        $fpdf->Cell(0,0,$proforma[0]->id,0,1,"C");
        $textypost+=4;
        $fpdf->Line(1,$textypost,79,$textypost);

 
        $textypost+=3;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y', strtotime(explode(' ',$proforma[0]->fecha_emision)[0])) . str_pad("HORA: " . date("H:i:s", strtotime(explode(' ',$proforma[0]->fecha_emision)[1])), 17, ' ', STR_PAD_LEFT));
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0, 0, utf8_decode("NOMBRE O RAZóN SOCIAL: ") . str_pad("RUC/DNI:" . utf8_decode($proforma[0]->numero_documento), 19, ' ', STR_PAD_LEFT));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost); 
        $fpdf->MultiCell(0, 3, utf8_decode($proforma[0]->razon_social_nombre));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("DIRECCIóN: ") . str_split(utf8_decode($proforma[0]->direccion), 27)[0]);
        
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
        foreach($proformaDetalle as $rM){
            $count++;
            $total+=floatval($rM->sub_total);
            //$descontar=$rM->descuento;
            $fpdf->SetXY(2, $textypost);
            $fpdf->MultiCell(0, 3, '*' . utf8_decode($rM->denominacion));
            $y3 = $fpdf->GetY();
            $textypost = $y3 + 2;
            $fpdf->SetXY(2, $textypost);
            $fpdf->Cell(0, 0, str_pad(number_format(floatval($rM->cantidad), 2, '.', ','), (8 - strlen(floatval($rM->cantidad))) + strlen(floatval($rM->cantidad)), ' ', STR_PAD_LEFT) . " ".str_pad(utf8_decode($rM->abreviatura), 10, ' ', STR_PAD_LEFT)." " . str_pad(number_format($rM->precio_venta, 2, '.', ','), 12, ' ', STR_PAD_LEFT) . " " . str_pad(number_format(($rM->sub_total), 2, '.', ','), (9 - strlen(number_format(($rM->sub_total), 2, '.', ','))) + strlen(number_format(($rM->sub_total), 2, '.', ',')), ' ', STR_PAD_LEFT));
            $textypost += 3;
        }
        $fpdf->Line(1, $textypost, 79, $textypost);

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
        $fpdf->Cell(0, 0, "IGV             : S/" . str_pad(number_format($proforma[0]->igv, 2, '.', ','), (10 - strlen($proforma[0]->igv)) + strlen($proforma[0]->igv), ' ', STR_PAD_LEFT));
        $textypost += 3;
        $fpdf->SetXY(23, $textypost);
        //$facturacion->totalventas
        $fpdf->Cell(0, 0, "TOTAL A PAGAR   : S/" . str_pad(number_format($proforma[0]->total_neto, 2, '.', ','), (10 - strlen($proforma[0]->total_neto)) + strlen($proforma[0]->total_neto), ' ', STR_PAD_LEFT));
        $textypost += 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
        
        $texto_qr = utf8_decode($establecimiento->nombre_comercial."-".$establecimiento->numero_documento." ").
        "\nFecha/Hora: ".$proforma[0]->fecha_emision.
        "\nPedido: ".$proforma[0]->id.
        "\nTotal: ".$total;
        $textypost += 5;
        $fpdf->SetXY(23, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("Representación impresa del comprobante electrónico, esta puede ser consultada en ...."));
        $imageqr=QrCode::format('png')->generate($texto_qr);
        Storage::disk('local')->put("qr_code/qr.png", $imageqr);
        $limageqr=(Storage::path("qr_code/qr.png"));
        $fpdf->Image($limageqr, 5, $textypost, 18, 18);
        $y5 = $fpdf->GetY();
        $textypost = $y5 + 8;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 3;
        $fpdf->SetXY(8, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("BIENES TRANSFERIDOS EN LA AMAZONÍA"), 0, 1, "C");
        $textypost += 3;
        $fpdf->SetXY(9, $textypost);
        $fpdf->Cell(0, 0, "PARA SER CONSUMIDOS EN LA MISMA", 0, 1, "C");
        $textypost += 6;
        $fpdf->SetXY(9, $textypost);
        $fpdf->Cell(0, 0, "GRACIAS POR SU PREFERENCIA...!!", 0, 1, "C");
        $fpdf->Output();
        exit;
    }
    public function set_proforma_delete(Request $request){
        $id = $request->input("id");
    	$json = array();
        $validar = Proforma::where("id", $id)->get();
        if(!$validar->count()==0){                     
            $proforma = Proforma::where("id", $id)->update(['estado'=>-1]);
            //$proformaDetalle = ProformaDetalle::where("id_proforma", $id)->delete();
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
