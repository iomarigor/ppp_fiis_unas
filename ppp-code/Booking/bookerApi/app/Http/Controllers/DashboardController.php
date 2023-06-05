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
		try {
            $data['n_sales_tours_moth']=DB::table('reserva_estancia')
                    ->where([
                        ['paquetes_turisticos_id','!=',1]                        
                    ])
                    ->whereMonth('fecha_reserva','>=',(date("m")-1))
                    ->whereMonth('fecha_reserva','<=',(date("m")))
                    ->count();
            $data['n_rooms']=(DB::table('habitacion')
            ->count()-DB::table('reserva_estancia')
            ->where([
                ['fecha_llegada','=',date('Y-m-d').' 12:00:00'],
                ['tipo_reserva_estancia',"=",1]
            ])
            ->count())
            .'/'.DB::table('habitacion')
            ->count();
            $data['n_sales_moth']=DB::table('facturacion')
            ->whereMonth('fecha_emision','>=',(date("m")-1))
            ->whereMonth('fecha_emision','<=',(date("m")))
            ->count();
            $data['n_reservation_moth']=DB::table('reserva_estancia')
            ->where([
                ['fecha_checkin','=',null],
                ['tipo_reserva_estancia',"!=",1]
            ])
            ->count();
            $consumo = DB::table('pedido_nota_consumo_maestro as pncm')
            ->join('pedido_nota_consumo_maestro_detalle as pncmd','pncm.pedido_nota_consumo_maestro_id','=','pncmd.pedido_nota_consumo_maestro_id')
            ->select('pncm.reserva_estancia_id',DB::raw('SUM(pncmd.sub_total) AS subtotal'))
            ->groupBy('pncm.reserva_estancia_id');
            $data['prox_checkin']=DB::table('reserva_estancia as re')       
            ->join('persona as per', 'per.persona_id', '=', 're.persona_id')
            ->join('paquetes_turisticos as pt','pt.paquete_turisticos_id','=','re.paquetes_turisticos_id')
            ->join('reserva_estancia_habitacion as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
            ->join('habitacion as hb', 'hb.habitacion_id','=','reh.habitacion_id')
            ->join('empleado as em','re.empleado_id','=','em.empleado_id')
            ->leftJoin('pago as pa','pa.reserva_estancia_id','=','re.reserva_estancia_id')
            ->leftJoinSub($consumo,'consumo', function($join) {
                        $join->on('consumo.reserva_estancia_id','=','re.reserva_estancia_id');
                    })
            ->select('hb.numero_habitacion','re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
            're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.numero_ninos','re.estado','re.tipo_reserva_estancia',
            're.tipo_especificacion','re.codigo_reserva','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
            'pt.descripcion','reh.early_checkin','reh.late_checkout','em.nombres','per.telefono',
            DB::raw('re.paquetes_tarifa as ptarifa'),DB::raw('ifnull(SUM(pa.monto_deposito),0) AS pagos'),DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
            re.paquetes_tarifa+
            (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
		    (((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)) AS total'),
            DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
            re.paquetes_tarifa+
            (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
			(((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0))-ifnull(SUM(pa.monto_deposito),0) AS saldo'))
            ->whereIn('re.estado',[1,2])
            ->groupBy('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
            're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.estado','re.numero_ninos','re.tipo_reserva_estancia',
            're.tipo_especificacion','re.codigo_reserva','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
            'pt.descripcion','re.paquetes_tarifa','reh.early_checkin','reh.late_checkout','pt.numero_noches','consumo.subtotal','em.nombres','per.telefono')
            ->where([
                ['re.fecha_checkin','=',null],
                ['tipo_reserva_estancia',"!=",1]
            ])
            ->whereMonth('re.fecha_llegada','>=',(date("m")-1))            
            ->orderBy('fecha_llegada','asc')
            ->get();


            $data['prox_checkout']=DB::table('reserva_estancia as re')       
            ->join('persona as per', 'per.persona_id', '=', 're.persona_id')
            ->join('paquetes_turisticos as pt','pt.paquete_turisticos_id','=','re.paquetes_turisticos_id')
            ->join('reserva_estancia_habitacion as reh','reh.reserva_estancia_id','=','re.reserva_estancia_id')
            ->join('habitacion as hb', 'hb.habitacion_id','=','reh.habitacion_id')
            ->join('empleado as em','re.empleado_id','=','em.empleado_id')
            ->leftJoin('pago as pa','pa.reserva_estancia_id','=','re.reserva_estancia_id')
            ->leftJoinSub($consumo,'consumo', function($join) {
                        $join->on('consumo.reserva_estancia_id','=','re.reserva_estancia_id');
                    })
            ->select('hb.numero_habitacion','re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
            're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.numero_ninos','re.estado','re.tipo_reserva_estancia',
            're.tipo_especificacion','re.codigo_reserva','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
            'pt.descripcion','reh.early_checkin','reh.late_checkout','em.nombres','per.telefono',
            DB::raw('re.paquetes_tarifa as ptarifa'),DB::raw('ifnull(SUM(pa.monto_deposito),0) AS pagos'),DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
            re.paquetes_tarifa+
            (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
		    (((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)) AS total'),
            DB::raw('if(pt.numero_noches=0,((reh.tarifa*(DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0)),
            re.paquetes_tarifa+
            (if((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)>pt.numero_noches,
			(((DATEDIFF(date(re.fecha_salida),date(re.fecha_llegada))+1)-pt.numero_noches)*reh.tarifa),0))+
            ifnull(reh.early_checkin,0)+
            ifnull(reh.late_checkout,0)+ifnull(consumo.subtotal,0))-ifnull(SUM(pa.monto_deposito),0) AS saldo'))
            ->whereIn('re.estado',[1,2])
            ->groupBy('re.reserva_estancia_id','re.fecha_reserva','re.fecha_confirmacion','re.fecha_checkin',
            're.fecha_checkout','re.fecha_llegada','re.fecha_salida','re.numero_adultos','re.estado','re.numero_ninos','re.tipo_reserva_estancia',
            're.tipo_especificacion','re.codigo_reserva','re.paquetes_turisticos_id','re.canales_venta_reserva_id'
            ,'per.razon_social_nombre','reh.habitacion_id','reh.tarifa',
            'pt.descripcion','re.paquetes_tarifa','reh.early_checkin','reh.late_checkout','pt.numero_noches','consumo.subtotal','em.nombres','per.telefono')
            ->where([
                ['re.fecha_checkout','!=',null],
            ])
            ->orderBy('fecha_checkout','desc')
            ->get();
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
