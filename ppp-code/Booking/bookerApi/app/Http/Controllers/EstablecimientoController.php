<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Establecimiento;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class EstablecimientoController extends Controller
{

    public function index(Request $request){
   			
		$establecimiento = Establecimiento::all();
        
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
    public function set_establecimiento_insert_update(Request $request){
        $id = $request->input("establecimiento_id");
		$razonsocial = $request->input("razon_social_nombres");
        $ruc = $request->input("numero_documento");
		$json = array();
		//Recoger datos
        $datos = array(           
            "razon_social_nombres"=>$request->input("razon_social_nombres"), 
            "numero_documento" =>$request->input("numero_documento"), 
            "direccion" =>$request->input("direccion"), 
            "telefono" =>$request->input("telefono"), 
            "correo_electronico" =>$request->input("correo_electronico"), 
            "sitio_web" =>$request->input("sitio_web"), 
            "nombre_legal" =>$request->input("nombre_legal"), 
            "nombre_comercial" =>$request->input("nombre_comercial"), 
            "ubigeo" =>$request->input("ubigeo"), 
            "direccion_fiscal" =>$request->input("direccion_fiscal"), 
            "urbanizacion" =>$request->input("urbanizacion"), 
            "departamento" =>$request->input("departamento"), 
            "provincia" =>$request->input("provincia"), 
            "distrito" =>$request->input("distrito"), 
            "usuario_sol" =>$request->input("usuario_sol"), 
            "clave_sol" =>$request->input("clave_sol"), 
            "certificado"=>$request->input("certificado"),        
            "clave_certificado"=>$request->input("clave_certificado")        
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'razon_social_nombres' => 'required|string|max:255',
                'numero_documento' => 'required|string|max:11',                
                'ubigeo' => 'required|string|max:6',
                'direccion_fiscal' => 'required|string|max:255',
                'usuario_sol' => 'required|string|max:255',
                'clave_sol' => 'required|string|max:255',
                'certificado' => 'required|string',
                'clave_certificado' => 'required|string|max:255',
                'urbanizacion' => 'required|string|max:255',
                "departamento"  => 'required|string|max:255',
                "provincia" => 'required|string|max:255',
                "distrito"  => 'required|string|max:255',           
 
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

				$validar = DB::table('establecimiento')		
				->where('razon_social_nombres','=',$razonsocial)  
                ->orWhere('numero_documento','=',$ruc)            
				->get();

				if ($validar->count()==0){
					$establecimiento = new Establecimiento();
					$establecimiento-> razon_social_nombres= $datos["razon_social_nombres"];
                    $establecimiento-> numero_documento = $datos["razon_social_nombres"];
                    $establecimiento-> direccion= $datos["razon_social_nombres"];
                    $establecimiento-> telefono= $datos["razon_social_nombres"];
                    $establecimiento-> sitio_web= $datos["razon_social_nombres"];
                    $establecimiento-> nombre_legal= $datos["razon_social_nombres"];
                    $establecimiento-> nombre_comercial= $datos["razon_social_nombres"];
                    $establecimiento-> ubigeo= $datos["ubigeo"];
                    $establecimiento-> direccion_fiscal= $datos["direccion_fiscal"];
                    $establecimiento-> urbanizacion= $datos["urbanizacion"];
                    $establecimiento-> departamento= $datos["departamento"];
                    $establecimiento-> provincia= $datos["provincia"];
                    $establecimiento-> distrito= $datos["distrito"];
                    $establecimiento-> usuario_sol= $datos["usuario_sol"];
                    $establecimiento-> clave_sol= $datos["clave_sol"];
                    $establecimiento-> clave_certificado= $datos["clave_certificado"];		
                    if($datos["certificado"]!=null || $datos["certificado"]!=""){
                        $certificado=explode(",",$datos["certificado"]);
                        $establecimiento->certificado==$certificado[0];
                        $certificadoo=base64_decode($certificado[1]);
                            Storage::disk('local')->put("sunat/".$certificado[0],$certificadoo);
                    }
                    
					$establecimiento->save();
                    
                    $json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, establecimiento ha sido guardado",
						"detalles"=> $establecimiento                       
					); 
				}
				else {

                    $validar = DB::table('establecimiento')		
                    ->where('establecimiento_id','=',$id)            
                    ->get();
                    $certificado=explode(",",$datos["certificado"]);
                    $datos["certificado"]=$certificado[0];
                    if (!$validar->count()==0){
                        $establecimiento = Establecimiento::where("establecimiento_id", $id)->update($datos);
                        //if(!($request->input("certificado")=="certificado".$id)){
                            $certificadoo=base64_decode($certificado[1]);
                            Storage::disk('local')->put("sunat/".$certificado[0],$certificadoo);
                        //}
                        
                    
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

					//$json = array(
					//	"status"=>200,
					//	"mensaje"=>"El establecimiento que intenta registrar ya existe en la base de datos",
					//	"detalles"=> $validar                       
					//);
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

	
	

	
}