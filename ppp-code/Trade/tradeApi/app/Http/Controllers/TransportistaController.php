<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Transportista;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TransportistaController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        //
        $transportistas = Transportista::where('estado','!=',-1)->get();
		$json = array();
		if(!empty($transportistas)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($transportistas),
				"detalles"=>$transportistas
				
			);

		}else{

			$json = array(

				"status"=>400,
				"mensaje"=>"No hay ningún tipo pago registrado",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
    }
    public function set_transportista_insert(Request $request){
        $json = array();
        $validator = Validator::make($request->all(), [
            'razonsocial'     => 'required|string',
            'ruc'    => 'required',
            'direccion'    => 'required|string',
            'placa' => 'required|string',
            'marca' => 'required',
            'certificado' => 'required',
            'licencia' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
       $data=array(
            'razonsocial'=>$request->input('razonsocial'),            
            'ruc'=>$request->input('ruc'),
            'direccion'=>$request->input('direccion'),
            'placa' =>$request->input('placa'),
            'marca'=>$request->input('marca'),
            'certificado'=>$request->input('certificado'),
            'licencia'=>$request->input('licencia')  
       );       
        $idtransportista = DB::table('transportista')->insertGetId($data);
        $data['idtransportista']=$idtransportista;
        if ($idtransportista){
            $json = array(
                "status"=>200,
                "mensaje"=>"Registro exitoso",
                "detalles"=>$data                             
            );  			       
        } else{
            $json = array(
                "status"=>400,
                "mensaje"=>"Error al registrar",
                "detalles"=>null
            );
        }
        return json_encode($json, true);
	}
	public function set_transportista_update(Request $request){
		$id = $request->input("idtransportista");
		$json = array();
		//Recoger datos
		$datos = array( 
            'idtransportista'=>$request->input("idtransportista"),
            'razonsocial'=>$request->input('razonsocial'),            
            'ruc'=>$request->input('ruc'),
            'direccion'=>$request->input('direccion'),
            'placa' =>$request->input('placa'),
            'marca'=>$request->input('marca'),
            'certificado'=>$request->input('certificado'),
            'licencia'=>$request->input('licencia')  
        );
        if(!empty($datos)){         
			$validar = DB::table('transportista')		
			->where('idtransportista','=',$id)            
			->get();

			if (!$validar->count()==0){
				$menu = Transportista::where("idtransportista", $id)->update($datos);
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
	public function set_transportista_delete($idtransportista){
        $json = array();
        $validar = DB::table('transportista')		
			->where('idtransportista','=',$idtransportista)            
			->get();
        $registros=DB::table('encomienda')		
			->where('idtransportista','=',$idtransportista)            
			->get();
			if (!$validar->count()==0){
                if(count($registros)==0){
                    Transportista::where("idtransportista", $idtransportista)->update(['estado'=>-1]);
                    $json = array(
                        "status"=>200,
                        "mensaje"=>"Registro anulado",
                        "detalles"=>$validar[0]
                    );
                }else{
                    $json = array(
                    "status"=>400,
                    "mensaje"=>"No se puede elinar conductos por que tiene registros enlazados",
                    "detalles"=>$validar[0]
                );
                }
                
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Registro no encontrado",
                    "detalles"=>$validar[0]
                );
            }
        return $json;
	}
}
