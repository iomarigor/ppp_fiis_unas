<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /*=============================================
    Mostrar todos los registros
    =============================================*/

    public function index(Request $request){
   			
		$json = array();
		$json = array();
		try {
            
            $facturacion=DB::table('facturacion')
                    //->whereDay('fecha_emision','>=',(date("d")-1))
                    ->whereDay('fecha_emision','=',(date("d")))
                    ->get();
            $pasajes=0;
            $garage=0;
            foreach ($facturacion as $fac) {
                $facD = DB::table('facturacion_detalle')       
                ->where('facturacion_id','=',$fac->facturacion_id)
                ->get();
                foreach($facD as $det){
                    if($det->producto_id==1) $pasajes++;
                    if($det->producto_id==3) $garage++;
                }
                
            }
            $data['n_sales_tickets_day']=$pasajes;
            $data['n_parcels_day']=DB::table('encomienda')
                ->whereDay('fecharegistro','=',(date("d")))
                ->where([['estado','!=',-1]])
                ->count();
            $data['n_garage_day']=$garage;           
            $salidas=DB::table('salida_vehiculos as sv')
                ->join('transportista as t','t.idtransportista','=','sv.idtransportista')
                ->join('users as u','u.id','=','sv.idusers')
                ->select('sv.*','t.razonsocial','t.placa','u.sucursal_id')
                //->whereDay('fecha','>=',(date("d")-1))
                ->whereDay('fecha','=',(date("d")))
                ->where([['sv.estado','!=',-1]])
                ->get();
            $adelantos=DB::table('adelanto_turno as at')
                ->join('transportista as t','t.idtransportista','=','at.idtransportista')
                ->join('users as u','u.id','=','at.idusers')
                ->select('at.*','t.razonsocial','t.placa','u.sucursal_id')
                //->whereDay('fecha','>=',(date("d")-1))
                ->whereDay('fecha','=',(date("d")))
                ->where([['at.estado','!=',-1]])
                ->get();
            $prox_arrivals_day=DB::table('encomienda as e')
                ->join('transportista as t','t.idtransportista','=','e.idtransportista')
                ->join('users as u','u.id','=','e.idusuario')
                ->select('e.fecharegistro','e.codigo','t.razonsocial','t.placa','u.sucursal_id')
                ->whereDay('e.fecharegistro','=',(date("d")))
                ->where([['e.estado','!=',-1],['e.estado','=',1]])
                ->groupBy('e.idtransportista')
                ->get();
            
            $data['prox_arrivals_day']=$prox_arrivals_day;
            $data['advances_exits_day']=$salidas->merge($adelantos);
            $json = array(
				"status"=>200,
				"mensaje"=>"Datos de dashboard",
				"detalles"=>$data
				
			);

		} catch (\Throwable $th) {
           
			$json = array(

				"status"=>400,
				"mensaje"=>"No se pudo cargar datos de dashboard",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
	} 
    public function show($iduser){
   			
		$json = array();
		try {
            $idSucursal=DB::table("users")
            ->where('id','=',$iduser)
            ->first();
            $idSucursal=($idSucursal!=null)?$idSucursal->sucursal_id:0;
            $facturacion=DB::table('facturacion')
                    //->whereDay('fecha_emision','>=',(date("d")-1))
                    ->whereDay('fecha_emision','=',(date("d")))
                    ->where([['usuario_id','=',$iduser]])
                    ->get();
            $pasajes=0;
            $garage=0;
            foreach ($facturacion as $fac) {
                $facD = DB::table('facturacion_detalle')       
                ->where('facturacion_id','=',$fac->facturacion_id)
                ->get();
                foreach($facD as $det){
                    if($det->producto_id==1) $pasajes++;
                    if($det->producto_id==3) $garage++;
                }
                
            }
            $data['n_sales_tickets_day']=$pasajes;
            $data['n_parcels_day']=DB::table('encomienda')
                ->whereDay('fecharegistro','=',(date("d")))
                ->where([['estado','!=',-1],['idusuario','=',$iduser]])
                ->count();
            $data['n_garage_day']=$garage;           
            $salidas=DB::table('salida_vehiculos as sv')
                ->join('transportista as t','t.idtransportista','=','sv.idtransportista')
                ->join('users as u','u.id','=','sv.idusers')
                ->select('sv.*','t.razonsocial','t.placa','u.sucursal_id')
                //->whereDay('fecha','>=',(date("d")-1))
                ->whereDay('fecha','=',(date("d")))
                ->where([['sv.estado','!=',-1],['sv.idusers','=',$iduser]])
                ->get();            
            $adelantos=DB::table('adelanto_turno as at')
                ->join('transportista as t','t.idtransportista','=','at.idtransportista')
                ->join('users as u','u.id','=','at.idusers')
                ->select('at.*','t.razonsocial','t.placa','u.sucursal_id')
                //->whereDay('fecha','>=',(date("d")-1))
                ->whereDay('fecha','=',(date("d")))
                ->where([['at.estado','!=',-1],['at.idusers','=',$iduser]])
                ->get();


            $prox_arrivals_day=DB::table('encomienda as e')
                ->join('transportista as t','t.idtransportista','=','e.idtransportista')
                ->join('users as u','u.id','=','e.idusuario')
                ->select('e.fecharegistro','e.codigo','t.razonsocial','t.placa','u.sucursal_id')
                ->whereDay('e.fecharegistro','=',(date("d")))
                ->where([['e.estado','!=',-1],['e.estado','=',1],['u.sucursal_id','!=',$idSucursal]])
                ->groupBy('e.idtransportista')
                ->get();
            
            $data['prox_arrivals_day']=$prox_arrivals_day;
            $data['advances_exits_day']=$salidas->merge($adelantos);
            $json = array(
				"status"=>200,
				"mensaje"=>"Datos de dashboard",
				"detalles"=>$data
				
			);

		} catch (\Throwable $th) {
           
			$json = array(

				"status"=>400,
				"mensaje"=>"No se pudo cargar datos de dashboard",
				"detalles"=>null				
			);

		}
		return json_encode($json, true);
	} 
	
}