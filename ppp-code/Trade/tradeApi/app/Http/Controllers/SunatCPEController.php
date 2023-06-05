<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;
use App\InvoiceSunat;
use App\Establecimiento;

class SunatCPEController extends Controller
{
    public function Consulta_DNI($dni){
        $client = new Client([
            // Base URI is used with relative requests
            'base_uri' => env('URL_SUNAT_DNI'),
            // You can set any number of default request options.
            'timeout'  => 20.00,
        ]);
        $datos= array(
            "token"=>env('URL_SUNAT_DNI_TOKEN')
        );
        $response  =  $client->request('GET','dni/'.$dni,['query'=>$datos]);
        
        return $response->getBody()->getContents();
    }

    public function Consulta_RUC($ruc){
        $client = new Client([
            // Base URI is used with relative requests
            //'base_uri' => env('URL_SUNAT_RUC')."search?businessId=".$ruc."&apikey=".env('TOKEN_SUNAT_RUC'),
            'base_uri' => env('URL_SUNAT_RUC'),
            // You can set any number of default request options.
            'timeout'  => 3.14,
        ]);
        $datos= array(
            "businessId"=>$ruc,
            "apikey"=>env('TOKEN_SUNAT_RUC')
        );
        $response  =  $client->request('GET','search',['query'=>$datos]);
        
        return $response->getBody()->getContents();
    }
    
    public function generar_comprobante(Request $request){
        if(InvoiceSunat::where("idventa", $request->input("facturacion_id"))->where("tipo_documento",$request->input("tipo_documento"))->count()>0){
            $json = array(
                "status"=>400,
                "mensaje"=>"El comprobante ya cuenta con CPE",
                "detalles"=> null                   
            ); 
        }else{
            $tipo_documento=$request->input("tipo_documento");
            //try{
                $client = new Client([
                    'base_uri' => env('URL_FACTURACION_SUNAT'),
                    //'timeout'  => 2.0,
                ]);
            /* }catch(Exception $e){
                $json = array(                    
					"status"=>400,
					"mensaje"=>"Servicio de facturación fuera de servicio",
					"detalles"=>$e->getMessage()                    
				);
                return $json;
            } */
            $datos=(array) $request->all();

            unset($datos["facturacion_id"]);
            unset($datos["tipo_documento"]);
            if($tipo_documento==1){
                $response  =  $client->request('POST','GenerarFactura',['json'=>$datos]);
            }else{
                $response  =  $client->request('POST','GenerarNotaCredito',['json'=>$datos]);
            }
            $response=json_decode($response->getBody()->getContents());
                $invoicesunat= new InvoiceSunat();
                $invoicesunat->idventa=$request->input("facturacion_id");
                $invoicesunat->mensajeerror=$response->MensajeError;
                $invoicesunat->tramaxmlsinfirma=$response->TramaXmlSinFirma;
                $invoicesunat->crespuesta_sinfirmado=($response->Exito)? '0':'9';
                if($tipo_documento==1){
                    $invoicesunat->mensajerespuesta="Factura generada";
                }else{
                    $invoicesunat->mensajerespuesta="Nota de credito generada";
                }
                $invoicesunat->tipo_documento=$tipo_documento;
                $invoicesunat->save();
                $json = array(                    
					"status"=>($response->Exito)? 200:400,
					"mensaje"=>($response->Exito)? (($tipo_documento==1)?"El comprobante fue generado":"La nota de credito fue generado"):explode('-',$response->MensajeError)[0],
					"detalles"=>$invoicesunat                    
				);
        }
        //return $datos;

        return $json;
    }

    public function firmar_comprobante(Request $request)
    {
  
        if(InvoiceSunat::where("idventa", $request->input("facturacionid"))->where("crespuesta_firmado",0)->where("tipo_documento",$request->input("tipo_documento"))->count()>0){
            $json = array(
                "status"=>400,
                "mensaje"=>"El comprobante ya fue firmado",
                "detalles"=> null                   
            ); 
        }else{
            $establecimiento = Establecimiento::where("establecimiento_id",$request->input("establecimientoid"))->get();
            $invoice_sunat = InvoiceSunat::where("idventa",$request->input("facturacionid"))->where("tipo_documento",$request->input("tipo_documento"))->get();
            $tipo_documento=$request->input("tipo_documento");

            $datos["CertificadoDigital"]=base64_encode(Storage::get("sunat/certificado".$request->input("establecimientoid").".pfx"));
            $datos["PasswordCertificado"]=$establecimiento[0]->clave_certificado;
            $datos["TramaXmlSinFirma"]= $invoice_sunat[0]->tramaxmlsinfirma;
            $datos["ValoresQr"]="";
            $client = new Client([
                'base_uri' => env('URL_FACTURACION_SUNAT'),
                //'timeout'  => 2.0,
            ]);
            $response  =$client->request('POST','Firmar',['json'=>$datos]);     
            $response  = json_decode($response->getBody()->getContents());
            $invoicesunat["mensajerespuesta"]="Firma generada";
            $invoicesunat["resumenfirma"]=$response->ResumenFirma;
            $invoicesunat["tramaxmlfirmado"]=$response->TramaXmlFirmado;
            $invoicesunat["crespuesta_firmado"]=($response->Exito)? '0':'9';
            $invoicesunat["mensajeerror"]=($response->MensajeError==null)? '':$response->MensajeError;

            
            //return $invoicesunat;
            InvoiceSunat::where("idventa",$request->input("facturacionid"))->where("tipo_documento",$request->input("tipo_documento"))->update($invoicesunat);
            $json = array(
                "status"=>($response->Exito)? 200:400,
                "mensaje"=>($response->Exito)? (($tipo_documento==1)?"Comprobante firmado":"Nota de credito firmado"):explode('-',$response->MensajeError)[0],
                "detalles"=>$datos                             
            ); 

        }
        //return $datos;

        return $json;
    }
    public function enviar_comprobante(Request $request){
        if(InvoiceSunat::where("idventa", $request->input("facturacionid"))->where("crespuesta_envio",0)->where("tipo_documento",$request->input("tipo_documento"))->count()>0){
            $json = array(
                "status"=>400,
                "mensaje"=>"El comprobante ya fue firmado",
                "detalles"=> null                   
            ); 
        }else{
            $establecimiento = Establecimiento::where("establecimiento_id",$request->input("establecimientoid"))->first();
            $invoice_sunat = InvoiceSunat::where("idventa",$request->input("facturacionid"))->where("tipo_documento",$request->input("tipo_documento"))->first();
            $tipo_documento=$request->input("tipo_documento");

            $datos["TramaXmlFirmado"]= $invoice_sunat->tramaxmlfirmado;
            $datos["Ruc"]=$establecimiento->numero_documento;
            $datos["UsuarioSol"]=$establecimiento->usuario_sol;
            $datos["ClaveSol"]=$establecimiento->clave_sol;
            $datos["IdDocumento"]=$request->input("IdDocumento");
            $datos["TipoDocumento"]=$request->input("codigoSunat");
            $datos["EndPointUrl"]="https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService";
            $client = new Client([
                'base_uri' => env('URL_FACTURACION_SUNAT'),
                //'timeout'  => 2.0,
            ]);
            $response  =$client->request('POST','EnviarDocumento',['json'=>$datos]);
            //return $response->getBody()->getContents();
            $response  = json_decode($response->getBody()->getContents());
            $invoicesunat["mensajerespuesta"]=$response->MensajeRespuesta;
            $invoicesunat["mensajeerror"]=($response->MensajeError==null)? '':$response->MensajeError;
            $invoicesunat["crespuesta_envio"]=($response->Exito)? '0':'9';
            $invoicesunat["nombrearchivo"]=$response->NombreArchivo;
            $invoicesunat["nroticketcdr"]=$response->NroTicketCdr;
            $invoicesunat["tramazipcdr"]=$response->TramaZipCdr;
            //return $invoicesunat;
            InvoiceSunat::where("idventa",$request->input("facturacionid"))->where("tipo_documento",$request->input("tipo_documento"))->update($invoicesunat);
            $json = array(
                "status"=>($response->Exito)? 200:400,
                "mensaje"=>($response->Exito)?(($tipo_documento==1)?"Comprobante Enviado":"Nota de credito Enviado"):explode('-',$response->MensajeError)[0],
                "detalles"=>$invoicesunat                            
            ); 
        }
        //return $datos;

        return $json;
    }
    private function obtener_comprobante($id){

        $efac_cabecera = array();
        $efac_detalle = array();
        $literal = new EnLetras();
        $invoice = new Invoice();

        $venta = $this->Venta_model->obtener_venta($this->input->post('id'))[0];

        $facturacion = DB::table('facturacion as f')
        ->select('f.*',DB::raw('p.razon_social_nombre,p.numero_documento,p.direccion,tm.codigo,tp.tipo_pago,tfp.tipo_forma_pago,c.codigo_sunat,c.comprobante_id'))
        ->join('persona as p','p.persona_id','=','f.persona_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id', '=','f.tipo_moneda_id')
        ->join('tipo_operacion as top','top.tipo_operacion_id','=', 'f.tipo_operacion_id')
        ->join('tipo_pago as tp','tp.tipo_pago_id','=', 'f.tipo_pago_id')
        ->join('tipo_forma_pago as tfp','tfp.tipo_forma_pago_id' ,'=', 'f.tipo_forma_pago_id')        
        ->join('serie_comprobante as sc','sc.serie_comprobante_id','=', 'f.serie_comprobante_id')
        ->join('comprobante as c','c.comprobante_id','=', 'sc.comprobante_id')
        ->where('f.facturacion_id','=',$id)
        ->get();

        $facturacionDetalle = DB::table('facturacion_detalle as fd')
        ->select('fd.*',DB::raw('p.denominacion,um.abreviatura'))
        ->join('producto as p','p.producto_id','=','fd.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','p.unidad_medida_id')        
        ->where('fd.facturacion_id','=',$id)
        ->get();

		$json = array();
		if(!empty($facturacion)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($facturacion),
				"detalles"=> array(
                        "factura" => $facturacion,
                        "detalle" => $facturacionDetalle                    )				
			);
		}else{
			$json = array(
				"status"=>400,
				"mensaje"=>"No hay ningún curso registrado",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);

        $efac_cabecera = array(
            "TipoDocumento" => $venta['codigo_sunat'],
            "Emisor_NroDocumento" => $this->session->userdata['logged_in']['ruc'],
            "Emisor_NombreLegal" => $this->session->userdata['logged_in']['nombre_legal'],
            "Emisor_NombreComercial" => $this->session->userdata['logged_in']['nombre_comercial'],
            "Emisor_TipoDocumento" => "6",
            "CodigoAnexo" => $this->session->userdata['logged_in']['sucursal'],
            "Receptor_Tipodocumento" => $venta['persona_codigo_sunat'],
            "Receptor_NombreLegal" => $venta['razon_social_nombres'],
            "Receptor_NroDocumento" => $venta['numero_documento'],
            "IdDocumento" => $venta['numero_comprobante'],
            "FechaEmision" => date('d/m/Y', strtotime($venta['fecha_emision'])),
            "Moneda" => "PEN",
            "TipoOperacion" => "0101",
            "MontoEnLetras" => strtoupper($literal->ValorEnLetras($venta['total_neto'], "con")),
            "DescuentoGlobal" => 0,
            "MontoPercepcion" => 0,
            "MontoDetraccion" => 0,
            "TotalIgv" => $venta['igv'],
            "TotalIsc" => 0,
            "TotalOtrosTributos" => 0,
            "Gravadas" => $venta['igv'] > 0 ? $venta['total_neto'] : 0,
            "Exoneradas" => $venta['igv'] > 0 ? 0 : $venta['total_neto'],
            "Inafectas" => 0,
            "Gratuitas" => 0,
            "TotalVenta" => $venta['total_neto'],
            "Usersol" => $this->session->userdata['logged_in']['usuario_sol'],
            "Keysol" => $this->session->userdata['logged_in']['clave_sol'],
            "Certificado" => $this->session->userdata['logged_in']['certificado'],
            "CertificadoNombre" => $this->session->userdata['logged_in']['ruc'] . ".p12" //agregado para certificados con extension .p12
        );

        $counter = 1;

        foreach ($venta['detalle'] as $value) {
            array_push($efac_detalle, array(
                "Id" => $counter,
                "CodigoItem" => $value->id_producto,
                "Descripcion" => strtoupper($value->descripcion),
                "Cantidad" => $value->cantidad,
                "UnidadMedida" => $value->id_producto == "99999" ? 'ZZ' : $value->unidad_medida,
                "PrecioUnitario" => $value->precio_venta,
                "PrecioReferencial" => $value->precio_venta,
                "TipoPrecio" => "01",
                "Descuento" => 0,
                "Impuesto" => $value->igv,
                "TipoImpuesto" => $value->igv > 0 ? '10' : '20',
                "ImpuestoSelectivo" => 0,
                "OtroImpuesto" => 0,
                "TotalVenta" => $value->total
            ));

            $counter += 1;
        }

        $efac_cabecera = array_merge($efac_cabecera, array(
            'Detalle' => $efac_detalle
        ));

        $factura_electronica = $efac_cabecera;
        $peticion = $invoice->registrar_factura_electronica($factura_electronica, 'firmar');

        //echo json_encode($peticion);exit();

        if (isset($peticion['codigo_respuesta']) && $peticion['codigo_respuesta'] == 1) {
            $xml_content = base64_decode($peticion['xml']);
            $fp_xml = fopen(FCPATH . "assets/xml/" . $peticion["name"] . ".xml", "w");
            fwrite($fp_xml, $xml_content);
            fclose($fp_xml);

            $respuesta = $this->Venta_model->guardar_firma_venta($this->input->post(), $peticion['mensaje'], $peticion['codigo_respuesta'], $peticion['firma']);

            echo json_encode($respuesta);
        } else {
            echo json_encode(array('affected' => 0, 'id' => null, 'firma' => null, 'codigo_respuesta' => -1));
        }
    }
}