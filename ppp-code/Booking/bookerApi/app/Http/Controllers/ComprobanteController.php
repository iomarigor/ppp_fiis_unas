<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comprobante;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ComprobanteController extends Controller
{
    public function voucher_serie_comprobante(Request $request){
		$json = array();
		$comprobantes = DB::table('comprobante')->where('comprobante_id','=',1)->orWhere('comprobante_id','=',2)->orWhere('comprobante_id','=',5)->get();
		$comprobantesseries=[];
		foreach ($comprobantes as $comprobante){
			
			$series = DB::table('serie_comprobante_usuario as scu')
			->join('serie_comprobante as sc','sc.serie_comprobante_id','=','scu.id_serie_comprobante')
			->select(DB::raw('sc.serie_comprobante_id,sc.serie_comprobante,(sc.correlativo+1) as correlativo'))
			->where([
				['scu.id_usuario','=',$request->input("id")],
				['sc.comprobante_id','=',$comprobante->comprobante_id]			
			])
			->get();
				if(count($series)>0){
					$item=$comprobante;
					$item->series=$series;
					array_push($comprobantesseries,$item);
				}
			
		}
		$json = array(

				"status"=>200,
				"mensaje"=>"total_registros",
				"detalles"=>$comprobantesseries
				
			);
			return json_encode($json);
	}
     /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$comprobante = Comprobante::all();
		$json = array();
		if(!empty($comprobante)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($comprobante),
				"detalles"=>$comprobante
				
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

	public function set_comprobante_insert(Request $request){
		$denominacion = $request->input("descripcion");
		$json = array();
		//Recoger datos
        $datos = array( 
            "descripcion"=>$request->input("descripcion"),         
            "abreviatura"=>$request->input("abreviatura"),
            "codigo_sunat"=>$request->input("codigo_sunat"),
            "digitos"=>$request->input("digitos")
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'descripcion' => 'required|string|max:255',
                'abreviatura' => 'required|string|max:5',
                'codigo_sunat' => 'required|string|max:2',
                'digitos' => 'required',						
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

				$validar = DB::table('comprobante')		
				->where('descripcion','=',$denominacion)            
				->get();

				if ($validar->count()==0){
					$comprobante = new Comprobante();
					$comprobante->descripcion = $datos["descripcion"];
                    $comprobante->abreviatura = $datos["abreviatura"];
                    $comprobante->codigo_sunat = $datos["codigo_sunat"];			
                    $comprobante->digitos = $datos["digitos"];
					$comprobante->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, comprobante ha sido guardado",
						"detalles"=> $comprobante                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La clase que intenta registrar ya existe en la base de datos",
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
	public function set_comprobante_update(Request $request){
		
		$id = $request->input("comprobante_id");
		$json = array();
		//Recoger datos
        $datos = array( 
            "descripcion"=>$request->input("descripcion"),         
            "abreviatura"=>$request->input("abreviatura"),
            "codigo_sunat"=>$request->input("codigo_sunat"),
            "digitos"=>$request->input("digitos")
        );     

		if(!empty($datos)){         
			$validar = DB::table('comprobante')		
			->where('comprobante_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$comprobante = Comprobante::where("comprobante_id", $id)->update($datos);
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

	public function set_comprobante_delete(Request $request){
        $id = $request->input("comprobante_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Comprobante::where("comprobante_id", $id)->get();
        if(!$validar->count()==0){                     
            $comprobante = Comprobante::where("comprobante_id", $id)->delete();
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

	public function set_comprobante_cancel(Request $request){
		
		$id = $request->input("comprobante_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('Comprobante')		
			->where('comprobante_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Comprobante::where("comprobante_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_comprobante_id($comprobante_id){
		$json = array();
		
		$comprobante = DB::table('comprobante')
		->where('comprobante_id','=',$comprobante_id)
		->get();

		if(!empty($comprobante)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($comprobante),
				"detalles"=>$comprobante			    		
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
