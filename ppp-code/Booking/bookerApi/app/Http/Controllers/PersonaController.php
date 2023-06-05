<?php

namespace App\Http\Controllers;
use App\Persona;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PersonaController extends Controller
{
    public function index(Request $request){
    	$json = array(); 	
   		
		//AQUI SE GENERA LA CONSULTA
		//$persona = Persona::all(); 
		$persona= DB::table("persona")
		->where('persona.estado','!=',-1) 
		->get();  		
		if(!empty($persona)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($persona),
				"detalles"=>$persona			    		
			);
			return json_encode($json, true);
		}else{
			$json = array(
				"status"=>400,
				"mensaje"=>"No hay ningún curso registrado",
				"detalles"=>null			    		
			);
		}
    	return json_encode($json, true);
	}
	
	public function registraActualizaPerona(Request $request){
    
    	$json = array();
		$personaid = $request->input("persona_id");
        //Recoger datos
        $datos = array( 
			"ubica_persona"=>$request->input("ubica_persona"),
			"tipo_persona_id"=>$request->input("tipo_persona_id"),
			"tipo_cliente_id"=>$request->input("tipo_cliente_id"),
			"tipo_documento_id"=>$request->input("tipo_documento_id"),
			"numero_documento"=>$request->input("numero_documento"),
			"razon_social_nombre"=>$request->input("razon_social_nombre"),
			"nombre_comercial"=>$request->input("nombre_comercial"),                
			"profesion"=>$request->input("profesion"),
			"estado_civil"=>$request->input("estado_civil"),
			"fecha_nacimiento"=>$request->input("fecha_nacimiento"),
			"nacionalidad"=>$request->input("nacionalidad"),
			"sexo"=>$request->input("sexo"),
			"correo_electronico"=>$request->input("correo_electronico"),
			"telefono"=>$request->input("telefono"),
			"celular"=>$request->input("celular"),
			"rpm_rpc"=>$request->input("rpm_rpc"),
			"pagina_web"=>$request->input("pagina_web"),
			"nombre_contacto"=>$request->input("nombre_contacto"),
			"telefono_contacto"=>$request->input("telefono_contacto"),
			"estado"=>$request->input("estado")
    	);             
        
		if(!empty($datos)){
			//DETERMINAMOS SI SE VA ACTUALIZAR O SE VA AGREGAR LA PERSONA
			

				if($personaid==null){
					//validamos si existe un cliente
					$persona = DB::table('persona')		
					->where('numero_documento','=',$datos['numero_documento'])
					->orWhere('razon_social_nombre','=',$datos['razon_social_nombre'])
					->orWhere('nombre_comercial','=',$datos['nombre_comercial'])
					->get();

					if ($persona->count()==0 || $datos["numero_documento"]==0000000){

						//Validar datos
						$validator = Validator::make($datos, [
							'numero_documento' => 'required',
							'razon_social_nombre' => 'required',
							'nombre_comercial' => 'required',
						]);
						//Si falla la validación
						if ($validator->fails()) {
							$errors = $validator->errors();
							$json = array(                    
								"status"=>404,
								"mensaje"=>$errors,
								"detalles"=> null                   
							);

							return json_encode($json, true);
						}else{
							
							$persona = new Persona();
							$persona->ubica_persona =$datos["ubica_persona"];
							$persona->tipo_persona_id = $datos["tipo_persona_id"];
							$persona->tipo_cliente_id = $datos["tipo_cliente_id"];
							$persona->tipo_documento_id = $datos["tipo_documento_id"];
							$persona->numero_documento = $datos["numero_documento"];
							$persona->razon_social_nombre = $datos["razon_social_nombre"];
							$persona->nombre_comercial = $datos["nombre_comercial"];
							$persona->profesion = $datos["profesion"];
							$persona->estado_civil = $datos["estado_civil"];
							$persona->fecha_nacimiento = $datos["fecha_nacimiento"];
							$persona->nacionalidad = $datos["nacionalidad"];
							$persona->sexo = $datos["sexo"];
							$persona->correo_electronico = $datos["correo_electronico"];
							$persona->telefono = $datos["telefono"];
							$persona->celular = $datos["celular"];
							$persona->rpm_rpc = $datos["rpm_rpc"];
							$persona->pagina_web = $datos["pagina_web"];
							$persona->nombre_contacto = $datos["nombre_contacto"];
							$persona->telefono_contacto = $datos["telefono_contacto"];
							$persona->estado = $datos["estado"];				
							$persona->save();
							$get_persona = DB::table('persona')->where('persona_id',$persona->id)->get();
							$list_persona;
							foreach($get_persona as $value){
								$list_persona=$value;
							}
							$json = array(
								"status"=>200,
								"mensaje"=>"Registro exitoso, la persona ha sido guardado",
								"detalles"=> $list_persona                 
							);            
						}
					}else{
						$json = array(
							"status"=>400,
							"mensaje"=>"Ya existe un registro con los datos que intenta ingresas",
							"detalles"=> null               
						); 
					}
				}else{//SE VA ACTUALIZAR LA PERSONA
					$validar = DB::table('persona')		
					->where('persona_id','=',$personaid)            
					->get();
		
					if (!$validar->count()==0){
						$persona = Persona::where("persona_id", $personaid)->update($datos);
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

    public function getpersonaid(Request $request){
		$json = array(); 	
   		
		//AQUI SE GENERA LA CONSULTA
		$persona = DB::table('persona')
		/* ->join('tipo_persona','tipo_persona.tipo_persona_id','=','persona.tipo_persona_id')
		->join('tipo_cliente','tipo_cliente.tipo_cliente_id','=','persona.tipo_cliente_id')
		->join('tipo_documento','tipo_documento.tipo_documento_id','=','persona.tipo_documento_id') */
		->orWhere('persona.razon_social_nombre','like','%'.strtoupper($request->get("parametro")).'%')
		->orWhere('persona.nombre_comercial','like','%'.strtoupper($request->get("parametro")).'%')
		->orWhere('persona.numero_documento','like','%'.$request->get("parametro").'%')
		->get();   		

		if(!empty($persona)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($persona),
				"detalles"=>$persona			    		
			);
			return json_encode($json, true);
		}else{
			$json = array(
				"status"=>200,
				"mensaje"=>"No hay ningún cliente registrado",
				"detalles"=>null			    		
			);
		}
    	return json_encode($json, true);
 
    }

	//CRUD COMPLETO DE REGISTRO CLIENTE/PROVEEDOR
	public function set_persona_proveedor_insert(Request $request){
		$razonsocial = $request->input("razon_social_nombre");
		$nombrecomercial = $request->input("nombre_comercial");
		$numerodocumento = $request->input("numero_documento");

		$json = array();
		//Recoger datos
		$datos = array( 
			"ubica_persona"=>$request->input("ubica_persona"),
			"tipo_persona_id"=>$request->input("tipo_persona_id"),
			"tipo_cliente_id"=>$request->input("tipo_cliente_id"),
			"tipo_documento_id"=>$request->input("tipo_documento_id"),
			"numero_documento"=>$request->input("numero_documento"),
			"razon_social_nombre"=>$request->input("razon_social_nombre"),
			"nombre_comercial"=>$request->input("nombre_comercial"),           
			"correo_electronico"=>$request->input("correo_electronico"),
			"telefono"=>$request->input("telefono"),
			"direccion"=>$request->input("direccion")
    	);            
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'numero_documento' => 'required|string|max:11',
				'nombre_comercial' => 'required|string|max:255',
				'razon_social_nombre' => 'required|string|max:255'			
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

				$validar = DB::table('persona')
					->Where([['numero_documento','=',$datos['numero_documento']],['tipo_cliente_id','=',$datos["tipo_cliente_id"]]])
					->get();

				if ($validar->count()==0 || $validar[0]->tipo_documento_id==0){
						$persona = new Persona();
						$persona->ubica_persona =$datos["ubica_persona"];
						$persona->tipo_persona_id = $datos["tipo_persona_id"];
						$persona->tipo_cliente_id = $datos["tipo_cliente_id"];
						$persona->tipo_documento_id = $datos["tipo_documento_id"];
						$persona->numero_documento = $datos["numero_documento"];
						$persona->razon_social_nombre = $datos["razon_social_nombre"];
						$persona->nombre_comercial = $datos["nombre_comercial"];
						$persona->correo_electronico = $datos["correo_electronico"];
						$persona->telefono = $datos["telefono"];
						$persona->direccion = $datos["direccion"];				
						$persona->save();
					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso...!",
						"detalles"=> $persona                       
					); 
				}
				else {
					if($validar[0]->estado==-1){
						
						$datos["estado"]=1;
						$persona = Persona::where("persona_id", $validar[0]->persona_id)->update($datos);
						$json = array(
							"status"=>200,
							"mensaje"=>"Registro existente fue restablecido...!",
							"detalles"=> $persona                       
						); 
					}else{
						$json = array(
							"status"=>400,
							"mensaje"=>"La información que intenta registrar ya existe en la base de datos",
							"detalles"=> $validar                       
						);
					}
					
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

	public function get_persona_proveedor_ubica_persona($ubica_persona){
		$json = array();
		$ubica_persona=explode("-",$ubica_persona);
		
   		
		//AQUI SE GENERA LA CONSULTA
		/* $persona = DB::table('persona')
		->select('persona.*')
		->where([['persona.ubica_persona','=',$ubica_persona],['persona.estado','!=',-1]])		
		->get();    */	
		
		$persona = DB::table('persona')
		->select('persona.*');
		$persona->where('persona.ubica_persona','=',$ubica_persona[0]);
		for($i=1;$i<count($ubica_persona);$i++){
			$persona->orWhere('persona.ubica_persona','=',$ubica_persona[$i]);
			
		}	
		$persona->where('persona.estado','!=',-1);
		$persona=$persona->get();
		if(!empty($persona)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($persona),
				"detalles"=>$persona			    		
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

	public function set_persona_proveedor_update(Request $request){
		
		$id = $request->input("persona_id");
		$json = array();
		//Recoger datos
		$datos = array( 
			"ubica_persona"=>$request->input("ubica_persona"),
			"tipo_persona_id"=>$request->input("tipo_persona_id"),
			"tipo_cliente_id"=>$request->input("tipo_cliente_id"),
			"tipo_documento_id"=>$request->input("tipo_documento_id"),
			"numero_documento"=>$request->input("numero_documento"),
			"razon_social_nombre"=>$request->input("razon_social_nombre"),
			"nombre_comercial"=>$request->input("nombre_comercial"),           
			"correo_electronico"=>$request->input("correo_electronico"),
			"telefono"=>$request->input("telefono"),
			"direccion"=>$request->input("direccion")
    	);   

		if(!empty($datos)){         
			$validar = DB::table('persona')		
			->where('persona_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$persona = Persona::where("persona_id", $id)->update($datos);
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

	public function set_persona_proveedor_delete(Request $request){
        $id = $request->input("persona_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Persona::where("persona_id", $id)->get();
        if(!$validar->count()==0){                     
            $persona = Persona::where("persona_id", $id)->update(['estado'=>-1]);
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

	public function set_persona_proveedor_cancel(Request $request){
		
		$id = $request->input("persona_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('persona')		
			->where('persona_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Persona::where("persona_id", $id)->update(['estado'=>$datos['estado']]);
				$json = array(
					"status"=>200,
					"mensaje"=>($datos['estado']== 1)? 'El registro ha sido Activado':'El registro ha sido Anulado' ,
					"detalles"=>$affected                             
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

	public function get_persona_proveedor_id($persona_id){
		$json = array();
		$persona_id=explode("-",$persona_id);
		$remitente = DB::table('persona')
		->where('persona_id','=',$persona_id[0])
		->first();
		$consignado = DB::table('persona')
		->where('persona_id','=',$persona_id[1])
		->first();
		$persona=array(
			"remitente"=>$remitente,
			"consignado"=>$consignado
		);

		if(!empty($persona)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($persona),
				"detalles"=>$persona			    		
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