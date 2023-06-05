<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\EstablecimientoSucursal;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class EstablecimientoSucursalController extends Controller
{
    public function index(Request $request){
   			
		$establecimientosucursal = EstablecimientoSucursal::all();
		$json = array();
		if(!empty($establecimientosucursal)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($establecimientosucursal),
				"detalles"=>$establecimientosucursal
				
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

	public function set_establecimiento_sucursal_insert(Request $request){
		$codigoanexo = $request->input("codigo_anexo");
		$json = array();
		//Recoger datos
        $datos = array( 
            "establecimiento_id"=>$request->input("establecimiento_id"), 
            "codigo_anexo"=>$request->input("codigo_anexo"),
            "tipo_establecimiento"=>$request->input("tipo_establecimiento"),
            "sucursal"=>$request->input("sucursal"),      
            "telefono"=>$request->input("telefono"),
            "celular"=>$request->input("celular")
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'codigo_anexo' => 'required|string|max:4',
                'tipo_establecimiento' => 'required|string|max:100',
                'sucursal' => 'required|string|max:255',				
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

				$validar = DB::table('establecimiento_sucursal')		
				->where('codigo_anexo','=',$codigoanexo)            
				->get();

				if ($validar->count()==0){
					$establecimientosucursal = new EstablecimientoSucursal();
					$establecimientosucursal->codigo_anexo = $datos["codigo_anexo"];			
                    $establecimientosucursal->tipo_establecimiento = $datos["tipo_establecimiento"];
                    $establecimientosucursal->sucursal = $datos["sucursal"];
                    $establecimientosucursal->telefono = $datos["telefono"];
                    $establecimientosucursal->celular = $datos["celular"];
					$establecimientosucursal->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, sucursal ha sido guardado",
						"detalles"=> $establecimientosucursal                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La sucursal que intenta registrar ya existe en la base de datos",
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
	public function set_establecimiento_sucursal_update(Request $request){
		
		$id = $request->input("establecimiento_sucursal_id");
		$json = array();
		//Recoger datos
		$datos = array( 
            "establecimiento_id"=>$request->input("establecimiento_id"), 
            "codigo_anexo"=>$request->input("codigo_anexo"),
            "tipo_establecimiento"=>$request->input("tipo_establecimiento"),
            "sucursal"=>$request->input("sucursal"),      
            "telefono"=>$request->input("telefono"),
            "celular"=>$request->input("celular")
        );    

		if(!empty($datos)){         
			$validar = DB::table('establecimiento_sucursal')		
			->where('establecimiento_sucursal_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$marca = EstablecimientoSucursal::where("establecimiento_sucursal_id", $id)->update($datos);
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

	public function set_establecimiento_sucursal_delete(Request $request){
        $id = $request->input("establecimiento_sucursal_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = EstablecimientoSucursal::where("establecimiento_sucursal_id", $id)->get();
        if(!$validar->count()==0){                     
            $establecimientosucursal = EstablecimientoSucursal::where("establecimiento_sucursal_id", $id)->delete();
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
    public function set_establecimiento_sucursal_cancel(Request $request){
		
		$id = $request->input("establecimiento_sucursal_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('establecimiento_sucursal')		
			->where('establecimiento_sucursal_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = EstablecimientoSucursal::where("establecimiento_sucursal_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_establecimiento_sucursal_id($id){
		$json = array();
		
		$establecimientosucursal = DB::table('establecimiento_sucursal')
		->where('establecimiento_sucursal_id','=',$id)
		->get();

		if(!empty($establecimientosucursal)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($establecimientosucursal),
				"detalles"=>$establecimientosucursal			    		
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
