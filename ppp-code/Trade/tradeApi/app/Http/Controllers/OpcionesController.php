<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Opciones;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OpcionesController extends Controller
{
    public function index(Request $request){
   			
		$opciones = Opciones::all();
		$json = array();
		if(!empty($opciones)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($opciones),
				"detalles"=>$opciones
				
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

	public function set_opciones_insert_update(Request $request){
		$id = $request->input("establecimiento_sucursal_id");
		$json = array();
		//Recoger datos
        $datos = array( 
            "igv"=>$request->input("igv"),         
            "porcentaje_igv"=>$request->input("porcentaje_igv"),
            "igv_incluido"=>$request->input("igv_incluido"),
            "imagen_ticket"=>$request->input("imagen_ticket"),
            "imagen_comprobante"=>$request->input("imagen_comprobante"),
            "imagen_ticket_incluido"=>$request->input("imagen_ticket_incluido"),
            "imagen_comprobante_incluido"=>$request->input("imagen_comprobante_incluido"),
            "ticketera"=>$request->input("ticketera"),
            "pdf"=>$request->input("pdf"),
            "impresora_termica"=>$request->input("impresora_termica"),
            "establecimiento_sucursal_id"=>$request->input("establecimiento_sucursal_id"),
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'imagen_ticket' => 'required',
                'imagen_comprobante' => 'required',				
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

				$validar = DB::table('opciones')		
				->where('establecimiento_sucursal_id','=',$id)            
				->get();

				if ($validar->count()==0){
					$opciones = new Opciones();
					$opciones->igv = $datos["igv"];
                    $opciones->porcentaje_igv = $datos["porcentaje_igv"];
                    $opciones->igv_incluido = $datos["igv_incluido"];
                    $opciones->imagen_ticket = $datos["imagen_ticket"];
                    $opciones->imagen_comprobante = $datos["imagen_comprobante"];
                    $opciones->imagen_ticket_incluido = $datos["imagen_ticket_incluido"];		
                    $opciones->imagen_comprobante_incluido = $datos["imagen_comprobante_incluido"];
                    $opciones->ticketera = $datos["ticketera"];
                    $opciones->pdf = $datos["pdf"];
                    $opciones->impresora_termica = $datos["impresora_termica"];
                    $opciones->establecimiento_sucursal_id = $datos["establecimiento_sucursal_id"];
					$opciones->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, opciones ha sido guardado",
						"detalles"=> $opciones                       
					); 
				}
				else {
                    $establecimiento = Opciones::where("establecimiento_sucursal_id", $id)->update($datos);
                        $json = array(
                            "status"=>200,
                            "mensaje"=>"Registro exitoso, ha sido actualizado",
                            "detalles"=>$datos                             
                        );  	
					/*$json = array(
						"status"=>200,
						"mensaje"=>"Las opciones que intenta registrar ya existe en la base de datos",
						"detalles"=> $validar                       
					);*/
				}           
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
	
	
	public function get_opciones_id($opciones_id){
		$json = array();
		
		$opciones = DB::table('opciones')
		->where('establecimiento_sucursal_id','=',$opciones_id)
		->get();

		if(!empty($opciones)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($opciones),
				"detalles"=>$opciones			    		
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
}
