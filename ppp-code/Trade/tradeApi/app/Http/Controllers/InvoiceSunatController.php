<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
//use GuzzleHttp\Client;

use App\InvoiceSunat;
use App\Establecimiento;

class InvoiceSunatController extends Controller
{
    public function index(Request $request){
        $establecimiento = Establecimiento::where("establecimiento_id",$request->establecimientoid)->get();
        $establecimiento[0]->certificado=base64_encode(Storage::get("sunat/certificado".$request->establecimientoid.".pfx"));
		$json = array();
		if(!empty($establecimiento)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($establecimiento),
				"detalles"=>$establecimiento
				
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
    public function set_invoice_sunat_insert(Request $request){
        
        if(!empty($request->all())){
            
			$validator = Validator::make($request->all(), [
				'idventa' => 'required',
                'tramaxmlsinfirma' => 'required',				
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
                if(InvoiceSunat::where("idventa", $request->input("idventa"))->count()>0){
                    $json = array(
                        "status"=>400,
                        "mensaje"=>"El comprobante ya cuenta con CPE",
                        "detalles"=> null                     
                    ); 
                }else{
                    $invoicesunat= new InvoiceSunat();
                    $invoicesunat->idventa=$request->input("idventa");
                    $invoicesunat->mensajeerror=$request->input("mensajeerror");
                    $invoicesunat->tramaxmlsinfirma=$request->input("tramaxmlsinfirma");
                    $invoicesunat->crespuesta_sinfirmado=$request->input("crespuesta_sinfirmado");
                    $invoicesunat->mensajerespuesta=$request->input("mensajerespuesta");
                    $invoicesunat->save();
                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Registro exitoso, el comprobante ha sido guardado",
                        "detalles"=> $invoicesunat                      
                    ); 
                }
                
            }
        }else{
            $json = array(
                "status"=>400,
                "mensaje"=>"Los registros no pueden estar vacíos",
                "detalles"=>null                
            ); 
        }
        return $json;
    }
    
    public function set_invoice_sunat_update(Request $request){
        if(!empty($request->all())){
			$validator = Validator::make($request->all(), [
				'idventa' => 'required',
                'tramaxmlsinfirma' => 'required',				
                'resumenfirma' => 'required'				
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
                $affected  = InvoiceSunat::where("idventa", $request->input("idventa"))->update(
                    [
                        'mensajeerror'=>$request->input("mensajeerror"),
                        'mensajerespuestra'=>'Firma generada',
                        'crespuesta_firmado'=>'0',
                        'resumenfirma'=>$request->input("resumenfirma"),
                        'tramaxmlfirmado'=>$request->input("tramaxmlfirmado")
                    ]);
                $json = array(
                    "status"=>200,
                    "mensaje"=>'El comprobante ha sido firmado' ,
                    "detalles"=> null     
                ); 
            }
        }else{
            $json = array(
				"status"=>400,
				"mensaje"=>"Los registros no pueden estar vacíos",
				"detalles"=>null            
			);
        }
        
    }
    /* public function upload_certificado(Request $request){
        $certificado=base64_decode($request->input("certificado"));

        Storage::disk('local')->put("sunat/certificado".$request->input("establecimientoid").".pfx",$certificado);
        return $request->all();
    } */
}
?>