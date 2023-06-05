<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\SalidaVehiculos;
use Codedge\Fpdf\Fpdf\Fpdf;
use App\NumerosEnLetras;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SalidaVehiculosController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $vehiculos = DB::table('salida_vehiculos as sv')
        ->join('transportista as t','t.idtransportista','=','sv.idtransportista')
        ->select('sv.*','t.razonsocial','t.placa')
        ->where('sv.estado','!=',-1)
        ->get();
		$json = array();
		if(!empty($vehiculos)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($vehiculos),
				"detalles"=>$vehiculos
				
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
    public function set_salida_vehiculos_insert(Request $request){
        $json = array();
        $validator = Validator::make($request->all(), [
            'idtransportista'     => 'required',
            'monto'    => 'required',
            'idusers'    => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
       $data=array(
            'idtransportista'=>$request->input('idtransportista'),            
            'monto'=>$request->input('monto'),
            'fecha'=>date("Y-m-d H:i:s"),
            'idusers'=>$request->input('idusers')
       );       
       $salidaTemp=DB::table('salida_vehiculos')
       ->whereDate('fecha',date("Y-m-d"))
       ->orderBy('idsalidavehiculos', 'desc')
       ->first();
       if($salidaTemp){
        $data["correlativo"]= $salidaTemp->correlativo+1;
       }else{
        $data["correlativo"]=1;
       }
       
        $idsalida = DB::table('salida_vehiculos')->insertGetId($data);
        $data['idsalidavehiculos']=$idsalida;
        if ($idsalida){
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
    public function set_salida_vehiculos_update(Request $request){
		$id = $request->input("idsalidavehiculos");
		$json = array();
		//Recoger datos
		$datos = array( 
            'idtransportista'=>$request->input("idtransportista"),
            'monto'=>$request->input('monto'),
        );
        if(!empty($datos)){         
			$validar = DB::table('salida_vehiculos')		
			->where('idsalidavehiculos','=',$id)            
			->get();

			if (!$validar->count()==0){
				$menu = SalidaVehiculos::where("idsalidavehiculos", $id)->update($datos);
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
    public function set_salida_vehiculos_delete($idsalidavehiculos){
        $json = array();
        $validar = DB::table('salida_vehiculos')		
			->where('idsalidavehiculos','=',$idsalidavehiculos)            
			->get();

			if (!$validar->count()==0){
                SalidaVehiculos::where("idsalidavehiculos", $idsalidavehiculos)->update(['estado'=>-1]);
                $json = array(
                    "status"=>200,
                    "mensaje"=>"Registro anulado",
                    "detalles"=>$validar[0]
                );
            }else{
                $json = array(
                    "status"=>400,
                    "mensaje"=>"Registro no encontrado",
                    "detalles"=>$validar[0]
                );
            }
            return $json;
	}
    public function get_salida_vehiculos_print($id){
        $vehiculos = DB::table('salida_vehiculos as sv')
        ->join('transportista as t','t.idtransportista','=','sv.idtransportista')
        ->join('users as u','u.id','=','sv.idusers')
        ->select('sv.*','t.razonsocial','t.placa','u.name')
        ->where([
            ['sv.idsalidavehiculos','=',$id]
            ])
        ->first();
        $fpdf= new Fpdf('P','mm',array(80,350));
        $fpdf->AddPage();
        $fpdf->SetFont('Courier', 'B', 10);
        $textypost=5;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("CONTROL DE SALIDA N°: ".str_pad($vehiculos->correlativo, 7, "0", STR_PAD_LEFT)),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y', strtotime(explode(' ',$vehiculos->fecha)[0])) . str_pad("HORA: " . date("H:i:s", strtotime(explode(' ',$vehiculos->fecha)[1])), 17, ' ', STR_PAD_LEFT));
        $textypost+=3;

        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("TIPO MOVIMIENTO: SALIDA DE VEHICULOS"));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("CHOFER: ") . str_split(utf8_decode(strtoupper($vehiculos->razonsocial)), 27)[0]);
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("VEHICULOS: ") . str_split(utf8_decode($vehiculos->placa), 27)[0]);
        $textypost+=3;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost += 3;

        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("IMPORTE: ".number_format($vehiculos->monto, 2, "."," ")),0,1,"C");
        
        $textypost+=3;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost += 2;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA IMPRESIÓN: ") . date('d/m/Y') . str_pad("HORA: " . date("H:i:s"), 17, ' ', STR_PAD_LEFT));
        $textypost += 3;

        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("CEJERO: ".$vehiculos->name),0,1,"L");
        $fpdf->Output();
        exit;
    }
}
