<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\AdelantoTurno;
use Codedge\Fpdf\Fpdf\Fpdf;
use App\NumerosEnLetras;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdelantoTurnoController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $adelantos = DB::table('adelanto_turno as at')
        ->join('transportista as t','t.idtransportista','=','at.idtransportista')
        ->select('at.*','t.razonsocial','t.placa')
        ->where('at.estado','!=',-1)
        ->get();
		$json = array();
		if(!empty($adelantos)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($adelantos),
				"detalles"=>$adelantos
				
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
    public function set_adelanto_turno_insert(Request $request){
        $json = array();
        $validator = Validator::make($request->all(), [
            'idtransportista'     => 'required',
            'motivo'    => 'required',
            'idusers'    => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
       $data=array(
            'idtransportista'=>$request->input('idtransportista'),            
            'motivo'=>$request->input('motivo'),
            'fecha'=>date("Y-m-d H:i:s"),
            'idusers'=>$request->input('idusers')
       );  
       $adelantoTemp=DB::table('adelanto_turno')
       ->whereDate('fecha',date("Y-m-d"))
       ->orderBy('idadelantoturno', 'desc')
       ->first();
       if($adelantoTemp){
        $data["correlativo"]= $adelantoTemp->correlativo+1;
       }else{
        $data["correlativo"]=1;
       }     
        $idadelanto = DB::table('adelanto_turno')->insertGetId($data);
        $data['idadelantoturno']=$idadelanto;
        if ($idadelanto){
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
    public function set_adelanto_turno_update(Request $request){
		$id = $request->input("idadelantoturno");
		$json = array();
		//Recoger datos
		$datos = array( 
            'idtransportista'=>$request->input("idtransportista"),
            'motivo'=>$request->input('motivo'),
        );
        if(!empty($datos)){         
			$validar = DB::table('adelanto_turno')		
			->where('idadelantoturno','=',$id)            
			->get();

			if (!$validar->count()==0){
				$menu = AdelantoTurno::where("idadelantoturno", $id)->update($datos);
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
    public function set_adelanto_turno_delete($idadelantoturno){
        $json = array();
        $validar = DB::table('adelanto_turno')		
			->where('idadelantoturno','=',$idadelantoturno)            
			->get();

			if (!$validar->count()==0){
                AdelantoTurno::where("idadelantoturno", $idadelantoturno)->update(['estado'=>-1]);
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
            return json_encode($json, true);
	}
    public function get_adelanto_turno_print($id){
        $adelanto = DB::table('adelanto_turno as at')
        ->join('transportista as t','t.idtransportista','=','at.idtransportista')
        ->join('users as u','u.id','=','at.idusers')
        ->select('at.*','t.razonsocial','t.placa','u.name')
        ->where('at.idadelantoturno','=',$id)
        ->first();
        $fpdf= new Fpdf('P','mm',array(80,350));
        $fpdf->AddPage();
        $fpdf->SetFont('Courier', 'B', 10);
        $textypost=5;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,utf8_decode("ADELANTO DE TURNO N°: ".str_pad($adelanto->correlativo, 7, "0", STR_PAD_LEFT)),0,1,"C");
        $textypost+=4;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y', strtotime(explode(' ',$adelanto->fecha)[0])) . str_pad("HORA: " . date("H:i:s", strtotime(explode(' ',$adelanto->fecha)[1])), 17, ' ', STR_PAD_LEFT));
        $textypost+=3;

        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("TIPO MOVIMIENTO: ADELANTO TURNO"));
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("CHOFER: ") . str_split(utf8_decode(strtoupper($adelanto->razonsocial)), 27)[0]);
        $textypost += 4;
        $fpdf->SetXY(2, $textypost);
        $fpdf->MultiCell(0, 3, utf8_decode("VEHICULOS: ") . str_split(utf8_decode($adelanto->placa), 27)[0]);
        $textypost+=3;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost += 3;

        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("MOTIVO: ".$adelanto->motivo),0,1,"L");        
        $textypost+=3;
        $fpdf->Line(1,$textypost,79,$textypost);
        $textypost += 2;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA IMPRESIÓN: ") . date('d/m/Y') . str_pad("HORA: " . date("H:i:s"), 17, ' ', STR_PAD_LEFT));
        $textypost += 3;

        $fpdf->setXY(2,$textypost);
        $fpdf->Cell(0,0,utf8_decode("CAJERO: ".$adelanto->name),0,1,"L");
        $fpdf->Output();
        exit;
    }
}
