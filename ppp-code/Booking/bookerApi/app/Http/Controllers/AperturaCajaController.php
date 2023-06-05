<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\AperturaCaja;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AperturaCajaController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		//$apertura = AperturaCaja::all();
		$apertura =  DB::table('apertura_caja as ac')         
		->join('users as usr','ac.id_usuario','=','usr.id')         
		->select('ac.*',DB::raw('usr.name'))
		->get();
		$json = array();
		if(!empty($apertura)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($apertura),
				"detalles"=>$apertura
				
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
	public function show($iduser){
   			
		//$apertura = AperturaCaja::all();
		$apertura =  DB::table('apertura_caja as ac')         
		->join('users as usr','ac.id_usuario','=','usr.id')         
		->select('ac.*',DB::raw('usr.name'))
		->where('ac.id_usuario','=',$iduser)
		->get();
		$json = array();
		if(!empty($apertura)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($apertura),
				"detalles"=>$apertura
				
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
	
	public function set_Apertura_caja_insert(Request $request){
		$fa = $request->input("fecha_apertura");
        $usu = $request->input("id_usuario");
		$json = array();
		//Recoger datos
        $datos = array( 
            "fecha_apertura"=>$request->input("fecha_apertura"), 
            "importe_apertura"=>$request->input("importe_apertura"),
            "id_usuario"=>$request->input("id_usuario")                                
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'importe_apertura' => 'required',				
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

				$validar = DB::table('apertura_caja')
                ->where([
                    ['fecha_apertura', '=', $fa],
                    ['id_usuario', '=', $usu],
                ])			            
				->get();

				if ($validar->count()==0){
					$aperturacaja = new AperturaCaja();
					$aperturacaja->fecha_apertura = $datos["fecha_apertura"];
                    $aperturacaja->importe_apertura = $datos["importe_apertura"];
                    $aperturacaja->id_usuario = $datos["id_usuario"];						
					$aperturacaja->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, Apertura ha sido guardado",
						"detalles"=> $aperturacaja                       
					); 
				}
				else {
					$json = array(
						"status"=>200,
						"mensaje"=>"La Apertura que intenta registrar ya existe en la base de datos",
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
	public function set_Apertura_caja_update(Request $request){
		
		$id = $request->input("id_apertura_caja");
		$json = array();
		//Recoger datos
		$datos = array( 
            "fecha_apertura"=>$request->input("fecha_apertura"), 
            "importe_apertura"=>$request->input("importe_apertura"),            
        );

		if(!empty($datos)){         
			$validar = DB::table('apertura_caja')		
			->where('id_apertura_caja','=',$id)            
			->get();

			if (!$validar->count()==0){
				$aperturacaja = AperturaCaja::where("id_apertura_caja", $id)->update($datos);
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

	public function set_Apertura_caja_delete(Request $request){
        $id = $request->input("id_apertura_caja");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = AperturaCaja::where("id_apertura_caja", $id)->get();
        if(!$validar->count()==0){                     
            $apertura = AperturaCaja::where("id_apertura_caja", $id)->delete();
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

	public function get_Apertura_caja_detalle_lista($apertura_id){
		$json = array();
		
		$apertura = DB::table('apertura_caja')
		->where('id_apertura_caja','=',$apertura_id)
		->get();

		if(!empty($apertura)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($apertura),
				"detalles"=>$apertura			    		
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

    public function set_Apertura_caja_cierre(Request $request){
		
		$id = $request->input("id_apertura_caja");
		$json = array();
		//Recoger datos
		$datos = array( 
            "fecha_cierre"=>$request->input("fecha_cierre"), 
            "importe_cierre"=>$request->input("importe_cierre"),
            "estado"=>$request->input("estado")          
        );

		if(!empty($datos)){         
			$validar = DB::table('apertura_caja')		
			->where('id_apertura_caja','=',$id)            
			->get();

			if (!$validar->count()==0){
				$aperturacaja = AperturaCaja::where("id_apertura_caja", $id)->update($datos);
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

	public function get_apertura_caja_activa($idusuario){
		$json = array();
		
		$apertura = DB::table('apertura_caja as ac')
		->select('ac.id_apertura_caja',DB::raw("CONCAT('(CAJA',ac.id_apertura_caja,') =>',ac.fecha_apertura) AS apertura"))		
		->where([
			['ac.id_usuario','=',$idusuario],
			['ac.estado','=','1'],
			])
		->get();

		if(!empty($apertura)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($apertura),
				"detalles"=>$apertura			    		
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