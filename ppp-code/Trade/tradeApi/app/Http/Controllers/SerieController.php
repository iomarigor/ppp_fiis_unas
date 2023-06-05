<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Serie;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class SerieController extends Controller
{
    public function index(Request $request)
	{
		
		$id_usuario=6;
        //AQUI SE GENERA LA CONSULTA
		if($id_usuario==-1){
			$serie = DB::table('serie_comprobante')
			->join('comprobante','comprobante.comprobante_id','=','serie_comprobante.comprobante_id')
			->select(DB::raw('serie_comprobante.serie_comprobante_id,serie_comprobante.serie_comprobante, serie_comprobante.correlativo,serie_comprobante.comprobante_id,serie_comprobante.establecimiento_id,serie_comprobante.estado'),'comprobante.descripcion')
			->where('serie_comprobante.estado','!=',-1)
			->get();
		}else{
			$serie = DB::table('serie_comprobante')
			->join('comprobante','comprobante.comprobante_id','=','serie_comprobante.comprobante_id')
			->join('serie_comprobante_usuario as scu','scu.id_serie_comprobante','=','serie_comprobante.serie_comprobante_id')
			->select(DB::raw('serie_comprobante.serie_comprobante_id,serie_comprobante.serie_comprobante, serie_comprobante.correlativo,serie_comprobante.comprobante_id,serie_comprobante.establecimiento_id,serie_comprobante.estado'),'comprobante.descripcion')
			->where('serie_comprobante.estado','!=',-1)
			->where('scu.id_usuario','=',$id_usuario)
			->get();
		}
        
                  
		/* for($i=0;$i<count($serie);$i++){
			$usuarios= DB::table('serie_comprobante_usuario')
			->select(DB::raw('id_usuario'))
			->where("id_serie_comprobante","=",$serie[$i]->serie_comprobante_id)
			->get();
			$serie[$i]->usuarios=$usuarios;
		} */
        if(!empty($serie)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($serie),
                "detalles"=>$serie			    		
            );
            return json_encode($json, true);
        }else{
            $json = array(
                "status"=>200,
                "mensaje"=>"No hay ningún serie registrado",
                "detalles"=>null			    		
            );
        } 	
         
        
        return json_encode($json, true);
    }
	public function show($id_usuario)
	{
        //AQUI SE GENERA LA CONSULTA
		if($id_usuario==-1){
			$serie = DB::table('serie_comprobante')
			->join('comprobante','comprobante.comprobante_id','=','serie_comprobante.comprobante_id')
			->select(DB::raw('serie_comprobante.serie_comprobante_id,serie_comprobante.serie_comprobante, serie_comprobante.correlativo,serie_comprobante.comprobante_id,serie_comprobante.establecimiento_id,serie_comprobante.estado'),'comprobante.descripcion')
			->where('serie_comprobante.estado','!=',-1)
			->get();
		}else{
			$serie = DB::table('serie_comprobante')
			->join('comprobante','comprobante.comprobante_id','=','serie_comprobante.comprobante_id')
			->join('serie_comprobante_usuario as scu','scu.id_serie_comprobante','=','serie_comprobante.serie_comprobante_id')
			->select(DB::raw('serie_comprobante.serie_comprobante_id,serie_comprobante.serie_comprobante, serie_comprobante.correlativo,serie_comprobante.comprobante_id,serie_comprobante.establecimiento_id,serie_comprobante.estado'),'comprobante.descripcion')
			->where('serie_comprobante.estado','!=',-1)
			->where('scu.id_usuario','=',$id_usuario)
			->get();
		}
        
                  
		/* for($i=0;$i<count($serie);$i++){
			$usuarios= DB::table('serie_comprobante_usuario')
			->select(DB::raw('id_usuario'))
			->where("id_serie_comprobante","=",$serie[$i]->serie_comprobante_id)
			->get();
			$serie[$i]->usuarios=$usuarios;
		} */
        if(!empty($serie)){
            $json = array(
                "status"=>200,
                "mensaje"=>"total_registros =".count($serie),
                "detalles"=>$serie			    		
            );
            return json_encode($json, true);
        }else{
            $json = array(
                "status"=>200,
                "mensaje"=>"No hay ningún serie registrado",
                "detalles"=>null			    		
            );
        } 	
         
        
        return json_encode($json, true);
    }
    public function set_serie_comprobante_insert(Request $request)
	{
		$serie = $request->input("serie_comprobante");
		$json = array();
		//Recoger datos
        $datos = array( 
            "serie_comprobante"=>$request->input("serie_comprobante"),         
            "correlativo"=>$request->input("correlativo"),
            "comprobante_id"=>$request->input("comprobante_id"),
            "establecimiento_id"=>$request->input("establecimiento_id")
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'serie_comprobante' => 'required|string|max:4',
                'correlativo' => 'required|max:7'                             					
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

				$validar = DB::table('serie_comprobante')		
				->where([
					['serie_comprobante','=',$serie],
					['comprobante_id','=',$datos["comprobante_id"]]
				])            
				->get();

				if ($validar->count()==0){
					$seruecomprobante = new Serie();
					$seruecomprobante->serie_comprobante = $datos["serie_comprobante"];
                    $seruecomprobante->correlativo = $datos["correlativo"];
                    $seruecomprobante->comprobante_id = $datos["comprobante_id"];			
                    $seruecomprobante->establecimiento_id = $datos["establecimiento_id"];
					$seruecomprobante->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, comprobante ha sido guardado",
						"detalles"=> $seruecomprobante                       
					); 
				}
				else {
					$json = array(
						"status"=>400,
						"mensaje"=>"La serie comprobante que intenta registrar ya existe en la base de datos",
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
	public function set_serie_comprobante_update(Request $request)
	{
		
		$id = $request->input("serie_comprobante_id");
		$json = array();
		//Recoger datos
        $datos = array( 
            "serie_comprobante"=>$request->input("serie_comprobante"),         
            "correlativo"=>$request->input("correlativo"),
            "comprobante_id"=>$request->input("comprobante_id"),
            "establecimiento_id"=>$request->input("establecimiento_id")            
        );      

		if(!empty($datos)){         
			$validar = DB::table('serie_comprobante')		
			->where('serie_comprobante_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$seriecomprobante = Serie::where("serie_comprobante_id", $id)->update($datos);
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

	public function set_serie_comprobante_delete(Request $request)
	{
        $id = $request->input("serie_comprobante_id");
    	$json = array();
		//QUEDA PENDIENTE DE VALIDAD SI YA TIENE UNA VENTA O UNA COMPRA ENLAZADA AL REGISTRO
        $validar = Serie::where("serie_comprobante_id", $id)->get();
        if(!$validar->count()==0){                     
            $seriecomprobante = Serie::where("serie_comprobante_id", $id)->update(['estado'=>-1]);
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

	public function set_serie_comprobante_cancel(Request $request)
	{
		
		$id = $request->input("serie_comprobante_id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('serie_comprobante')		
			->where('serie_comprobante_id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = Serie::where("serie_comprobante_id", $id)->update(['estado'=>$datos['estado']]);
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

	public function get_serie_comprobante_id($id)
	{
		$json = array();
		
		$seriecomprobante = DB::table('serie_comprobante')
		->where('serie_comprobante_id','=',$id)
		->get();

		if(!empty($comprobante)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($seriecomprobante),
				"detalles"=>$seriecomprobante			    		
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

	public function get_serie_x_comprobante_id_usuario_id($idu,$idc,$ids)
	{
		$json = array();
		
		$seriecomprobante = DB::table('serie_comprobante_usuario as scu')
		->join('serie_comprobante as sc','sc.serie_comprobante_id','=','scu.id_serie_comprobante')
		->select(DB::raw('sc.serie_comprobante,(sc.correlativo+1) as correlativo'))
		->where([
			['scu.id_usuario','=',$idu],
			['sc.comprobante_id','=',$idc],
			['sc.serie_comprobante_id','=',$ids]
		])
		->get();

		if(!empty($seriecomprobante)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($seriecomprobante),
				"detalles"=>$seriecomprobante			    		
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
	public function get_serie_x_comprobante_id($idu,$idc)
	{
		$json = array();
		
		$seriecomprobante = DB::table('serie_comprobante_usuario as scu')
		->join('serie_comprobante as sc','sc.serie_comprobante_id','=','scu.id_serie_comprobante')
		->select(DB::raw('sc.serie_comprobante_id,sc.serie_comprobante'))
		->where([
			['scu.id_usuario','=',$idu],
			['sc.comprobante_id','=',$idc]			
		])
		->get();

		if(!empty($seriecomprobante)){
			$json = array(
				"status"=>200,
				"mensaje"=>"total_registros =".count($seriecomprobante),
				"detalles"=>$seriecomprobante			    		
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
