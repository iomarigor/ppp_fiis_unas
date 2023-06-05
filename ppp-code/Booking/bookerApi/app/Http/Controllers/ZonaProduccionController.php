<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UsuarioSerie;
use App\ZonaProduccionDetalle;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PDF;
use Codedge\Fpdf\Fpdf\Fpdf;
class ZonaProduccionController extends Controller
{
    public function index(Request $request){
   			
		$usuario = DB::table('zona_produccion')
        ->get();
		$json = array();
		if(!empty($usuario)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($usuario),
				"detalles"=>$usuario
				
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
      
    public function get_production_area_by_product($idproduct){
        $usuario = DB::table('zona_produccion_detalle as zpd')
        ->join('zona_produccion as zp','zp.idzona_produccion','=','zpd.idzona_produccion')
        ->select(DB::raw('zpd.*,zp.zona_produccion'))
        ->where([['zpd.idproducto','=',$idproduct]])
        ->get();
        $json = array();
		if(!empty($usuario)){

			$json = array(

				"status"=>200,
				"mensaje"=>"total_registros".count($usuario),
				"detalles"=>$usuario
				
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
    public function set_production_area_by_product(Request $request){
		
		$json = array();
		//Recoger datos
        $datos = array( 
            "idproducto"=>$request->input("idproducto"),
			"idzona_produccion"=>$request->input("idzona_produccion")        
        );             
        
        if(!empty($datos)){
            
			$validator = Validator::make($datos, [
				'idproducto' => 'required',
				'idzona_produccion' => 'required'
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

				$validar = DB::table('zona_produccion_detalle')		
				->where([
                    ['idproducto','=',$datos['idproducto']],
                    ['idzona_produccion','=',$datos['idzona_produccion']]
                ])            
				->get();

				if ($validar->count()==0){
					$usuario = new ZonaProduccionDetalle();
					$usuario->idproducto = $datos["idproducto"];	
					$usuario->idzona_produccion = $datos["idzona_produccion"]; 
					$usuario->save();

					$json = array(
						"status"=>200,
						"mensaje"=>"Registro exitoso, zona de producto guardado",
						"detalles"=> $usuario                       
					); 
				}
				else {
					$json = array(
						"status"=>400,
						"mensaje"=>"El producto ya tiene la zona que intenta registrar ya existe en la base de datos",
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
    public function set_production_area_delete(Request $request){
        $idproducto = $request->input("idproducto");
        $idzona_produccion = $request->input("idzona_produccion");
    	$json = array();
		
        $validar = ZonaProduccionDetalle::where([["idproducto",'=', $idproducto],['idzona_produccion','=',$idzona_produccion]])->get();
        if(!$validar->count()==0){                     
            $usuario = ZonaProduccionDetalle::where([["idproducto",'=', $idproducto],['idzona_produccion','=',$idzona_produccion]])->delete();
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
	public function pdf_imprime_comanda($id, $producto_id=false, $unidad_medida_id=false){
		$arrayWhere=[];
		array_push($arrayWhere,['pncm.pedido_nota_consumo_maestro_id','=',$id]);
		if($producto_id!=false){
			array_push($arrayWhere,['pncm.producto_id','=',$producto_id]);
			array_push($arrayWhere,['pncm.unidad_medida_id','=',$unidad_medida_id]);
		}
		 $facturacionDetalle = DB::table('pedido_nota_consumo_maestro_detalle as pncm')
        ->select('pncm.*',DB::raw('p.denominacion,um.abreviatura'))
        ->join('producto as p','p.producto_id','=','pncm.producto_id')
        ->join('unidad_medida as um','um.unidad_medida_id','=','pncm.unidad_medida_id')        
        ->where($arrayWhere)
        ->get();
		
		$fpdf= new Fpdf('P','mm',array(80,350));
        $fpdf->AddPage();
        $fpdf->SetFont('Courier', 'B', 8);
        /* $textypost=2;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"id=".$id." producto_id:".$producto_id." unidad_medida_id:". $unidad_medida_id,0,1,"C"); */
		$textypost=2;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"*****COMANDA(S):*****",0,1,"C");
		$textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"PEDIDO: #".str_pad($id,6,"0",STR_PAD_LEFT),0,1,"C");
		$textypost += 4;
        $fpdf->Line(1, $textypost, 79, $textypost);
		 $textypost+=3;
        $fpdf->setXY(2,$textypost);
        $fpdf->SetFont('Courier', 'B', 8);
        $fpdf->Cell(0, 0, utf8_decode("FECHA EMISIóN: ") . date('d/m/Y', strtotime(/* explode(' ',$facturacion->fecha_emision)[0] */"01/06/2023")) . str_pad("HORA: " . date("H:i:s", strtotime(/* explode(' ',$facturacion->fecha_emision)[1] */"01/06/2023")), 17, ' ', STR_PAD_LEFT));
        $textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"MESA: TEST",0,1,"C");
		$textypost+=4;
        $fpdf->setXY(5,$textypost);
        $fpdf->Cell(0,0,"MESERO(A): TEST",0,1,"C");
		$textypost += 4;
        $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 2;
        $fpdf->SetXY(2, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("CANT. DESCRIPCIóN        P. UNIT SUB TOTAL"));
		$textypost += 2;
        $fpdf->Line(1, $textypost, 79, $textypost);
		$textypost += 2;
		$count=0;
		$total=0;
		foreach($facturacionDetalle as $rM){
            $count++;
            $total+=floatval($rM->sub_total);
            $fpdf->SetXY(2, $textypost);
            $fpdf->MultiCell(0, 3, '*' . utf8_decode($rM->denominacion));  
            
            $y3 = $fpdf->GetY();
            $textypost = $y3 + 2;
            $fpdf->SetXY(2, $textypost);
            $fpdf->Cell(0, 0, str_pad(number_format(floatval($rM->cantidad), 2, '.', ','), (8 - strlen(floatval($rM->cantidad))) + strlen(floatval($rM->cantidad)), ' ', STR_PAD_LEFT) . " ".str_pad(utf8_decode($rM->abreviatura), 10, ' ', STR_PAD_LEFT)." " . str_pad(number_format($rM->precio_unitario, 2, '.', ','), 12, ' ', STR_PAD_LEFT) . " " . str_pad(number_format(($rM->sub_total), 2, '.', ','), (9 - strlen(number_format(($rM->sub_total), 2, '.', ','))) + strlen(number_format(($rM->sub_total), 2, '.', ',')), ' ', STR_PAD_LEFT));
            $textypost += 3;
        }
		$textypost+=2;
		 $fpdf->Line(1, $textypost, 79, $textypost);
        $textypost += 3;
        $fpdf->SetXY(8, $textypost);
        $fpdf->Cell(0, 0, utf8_decode("ATENDER POR FAVOR!!!"), 0, 1, "C");
		//$script="print(true);console.log('test')";
		/* $script = "var pp = getPrintParams();";
		$script .= "pp.interactive = pp.constants.interactionLevel.automatic;";
		$script .= "pp.printerName = 'HP Ink Tank Wireless 410 series';";
    	$script .= "print(pp);";
		$fpdf->script=($script); */
		$fpdf->SetTitle("COMANDA: #".str_pad($id,6,"0",STR_PAD_LEFT));
		$fpdf->Output();
        exit; 
	}
    /* 

	public function set_usuario_serie_delete(Request $request){
        $id = $request->input("id");
    	$json = array();
		
        $validar = UsuarioSerie::where("id", $id)->get();
        if(!$validar->count()==0){                     
            $usuario = UsuarioSerie::where("id", $id)->delete();
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

	public function set_usuario_serie_cancel(Request $request){
		
		$id = $request->input("id");
		$json = array();
		//Recoger datos
		$datos = array(            
			"estado"=>$request->input("estado")
        );

		if(!empty($datos)){         
			$validar = DB::table('serie_comprobante_usuario')		
			->where('id','=',$id)            
			->get();

			if (!$validar->count()==0){
				$affected  = UsuarioSerie::where("id", $id)->update(['estado'=>$datos['estado']]);
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

	
	} */
}