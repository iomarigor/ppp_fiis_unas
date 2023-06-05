<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\CajaChica;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CajaChicaController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
        $tipo = $request->input('tipo');
   			
		$cajachica = DB::table('caja_chica as cc')
        ->join('tipo_pago as tp','tp.tipo_pago_id','=','cc.tipo_pago_id')
        ->join('tipo_moneda as tm','tm.tipo_moneda_id','=','cc.tipo_moneda_id')
        ->select('cc.*','tp.tipo_pago_id','tp.tipo_pago','tm.tipo_moneda_id','tm.tipo_moneda')
        ->where('tipo_registro','=',$tipo)
        ->get();
		for($i=0;$i<count($cajachica);$i++){
			$cajachica[$i]->cliente= DB::table('persona')
			->join('tipo_persona','tipo_persona.tipo_persona_id','=','persona.tipo_persona_id')
			->join('tipo_cliente','tipo_cliente.tipo_cliente_id','=','persona.tipo_cliente_id')
			->join('tipo_documento','tipo_documento.tipo_documento_id','=','persona.tipo_documento_id')
			->where('persona.persona_id','=',$cajachica[$i]->id_cliente)
			->get()[0];  
		}
		$json = array();
		if(!empty($cajachica)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($cajachica),
				"detalles"=>$cajachica
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
	
	public function set_caja_chica_insert(Request $request){
		$iddocumento = $request->input("iddocumento");
        $idserie = $request->input("serie_comprobante_id");
        $correlativo = $request->input("correlativo");
		$json = array();
		//Recoger datos
        $datos = array( 
            "tipo_registro"=>$request->input("tipo_registro"), 
            "iddocumento"=>$request->input("iddocumento"),
            "fecha_emision"=>$request->input("fecha_emision"),
            "concepto"=>$request->input("concepto"),
            "tipo_pago_id"=>$request->input("tipo_pago_id"),
            "tipo_moneda_id"=>$request->input("tipo_moneda_id"),
            "tipo_cambio"=>$request->input("tipo_cambio"),
            "entrada"=>$request->input("entrada"),
            "salida"=>$request->input("salida"),
            "id_usuario"=>$request->input("id_usuario"),
            "id_apertura_caja"=>$request->input("id_apertura_caja"),
			"numero_serie"=>$request->input("numero_serie"),
			"id_serie"=>$request->input("id_serie"),
			"id_cliente"=>$request->input("id_cliente")                     
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'iddocumento' => 'required',
                'concepto' => 'required',
                'id_apertura_caja' => 'required'				
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

				$validar = DB::table('caja_chica')
                ->where('iddocumento','=',$iddocumento)			            
				->get();

				if ($validar->count()==0){
					$cajachica = new CajaChica();
					$cajachica->tipo_registro = $datos["tipo_registro"];
                    $cajachica->iddocumento = $datos["iddocumento"];
                    $cajachica->fecha_emision = $datos["fecha_emision"];
                    $cajachica->concepto = $datos["concepto"];
                    $cajachica->tipo_pago_id = $datos["tipo_pago_id"];						
                    $cajachica->tipo_moneda_id = $datos["tipo_moneda_id"];
                    $cajachica->tipo_cambio = $datos["tipo_cambio"];
                    $cajachica->entrada = $datos["entrada"];
                    $cajachica->salida = $datos["salida"];
                    $cajachica->id_usuario = $datos["id_usuario"];
                    $cajachica->id_apertura_caja = $datos["id_apertura_caja"];
					$cajachica->numero_serie=$datos["numero_serie"];
					$cajachica->id_serie=$datos["id_serie"];
					$cajachica->id_cliente=$datos["id_cliente"];
					$cajachica->save();

                    //ACTUALIZAMOS LA SERIE DEL COMPROBANTE
                    $affected = DB::table('serie_comprobante')
                    ->where('serie_comprobante_id',$idserie)
                    ->update(['correlativo' => $correlativo]);
                    
					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, ha sido guardado",
						"detalles"=> $cajachica                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"Ya existe en la base de datos",
						"detalles"=> $validar                       
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
	public function set_caja_chica_update(Request $request){
		
		$id = $request->input("id_caja_chica");
		$json = array();
		//Recoger datos
		$datos = array(
            "concepto"=>$request->input("concepto"),
            "tipo_pago_id"=>$request->input("tipo_pago_id"),
            "tipo_moneda_id"=>$request->input("tipo_moneda_id"),
            "tipo_cambio"=>$request->input("tipo_cambio"),
            "entrada"=>$request->input("entrada"),
            "salida"=>$request->input("salida"),
			"numero_serie"=>$request->input("numero_serie"),
			"id_serie"=>$request->input("id_serie"),
			"id_cliente"=>$request->input("id_cliente"),
        );    

		if(!empty($datos)){         
			$validar = DB::table('caja_chica')		
			->where('id_caja_chica','=',$id)            
			->get();

			if (!$validar->count()==0){
				$cajachica = CajaChica::where("id_caja_chica", $id)->update($datos);
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

    public function set_caja_chica_anular(Request $request){
		
		$id = $request->input("id_caja_chica");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('caja_chica')		
			->where('id_caja_chica','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = CajaChica::where("id_caja_chica", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_caja_chica_detalle_lista($id_caja_chica){
		$json = array();
		
		$cajachica = DB::table('caja_chica')
		->where('id_caja_chica','=',$id_caja_chica)
		->get();

		if(!empty($cajachica)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($cajachica),
				"detalles"=>$cajachica			    		
			);
			return json_encode($json, true);
		}else{
			$json = array(
				"status"=>200,
				"mensaje"=>"No hay ninguna apertura registrado",
				"detalles"=>null			    		
			);
		}
    	return json_encode($json, true);
	}

   
}
