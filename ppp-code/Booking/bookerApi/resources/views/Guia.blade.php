<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Ficha de Ingreso</title>
    <style>
      body{
        font:10px Arial, Tahoma, Verdana, Helvetica, sans-serif;        
        color:#000;
        }       
    
      table ,tr,td{       
        width:100%;
        border: 1px solid black;
        border-collapse: collapse;
        }

      th, td {
        padding: 2px;
        text-align: left;        
        }
      
      
        #t01,#dcliente,#dcuerpo,#leyenda ,tr,td {      
        margin: 0px 0px 1px
        }

       img {          
          width:260px;
          height:120px;
          position:absolute;
       }
       p{
         text-align:center;
         font-style: italic;
       }
</style>
</head>
<body>
<?php foreach($huesped as $value): ?>
<table id="header" style="border:0px">
    <tr>
        <td style="border:0px"><img src="{{ public_path('img/logofacpdf_ficha.jpg')}}" /></td>
        <td style="width:90%;border:0px;">
            <table id="leyenda">
                <tr>
                  <td></td>
                  <td><strong>LLEGADA / ARRIVAL</strong></td>
                  <td><strong>SALIDA / APERTURA</strong></td>
                </tr>
                <tr>
                  <td>Fecha / Date</td>
                  <td>{{ date("d/m/Y",strtotime($value->fecha_llegada))}}</td>
                  <td>{{ date("d/m/Y",strtotime($value->fecha_salida))}}</td>
                <tr>
                  <td>Medio de Transporte / Transportantions</td>
                  <td>{{ $value->medio_transporte}}</td>
                  <td>{{ $value->medio_transporte}}</td>
                </tr>
                <tr>
                  <td>Procedencia, Destino / Coming From, Destination</td>
                  <td>{{ $value->procedencia}}</td>
                  <td>{{ $value->destino}}</td>
                </tr>
                <tr>
                  <td>Hora / Time</td>
                  <td>{{ date("H:i:s",strtotime($value->fecha_llegada))}}</td>
                  <td>{{ date("H:i:s",strtotime($value->fecha_salida))}}</td>
                </tr>
            </table>
        </td>    
    </tr>
</table>

<table id="dcliente">
  <tr>
    <td rowspan="2" style="width:10%;vertical-align:top"><span>Habitacion(es) Room(es)</span></td>
    <td rowspan="2" style="width:5%;vertical-align:middle">{{ $value->numero_habitacion}}</td>
    <td rowspan="2" style="width:45%;border-top:1px solid #fff;border-bottom:1px solid #fff"></td>
    <td rowspan="2" style="width:20%">HOSPEDAJE- LODGING</td>
    <td style="width:10%">Telefono</td>
    <td style="width:10%">{{ $value->telefono}}</td>
  </tr>
  <tr>    
     
    <td style="width:10%">Tarifa / Tariff</td>
    <td style="width:10%">{{ $value->tarifa}}</td>
  </tr>
</table>

<table id="dcuerpo">
  <tr>
    <td style="width:15%;">Nombre / Name</td>
    <td colspan="3" style="width:48%">{{ $value->huesped}}</td>
    <td style="width:5%">Edad / Age</td>
    <td style="width:5%"></td>
    <td style="width:17%">Fecha de Nacimiento / Nate of Birth</td>
    <td style="width:10%"></td>
  </tr>
  <tr>    
    <td style="width:15%">Domicilio / Home Address</td>
    <td colspan="5" style="width:58%"></td>
    <td style="width:17%">Nacionalidad / Nationality</td>
    <td style="width:10%">{{ $value->nacionalidad}}</td>
  </tr>
  <tr>
    <td style="width:15%">Empresa</td>
    <td colspan="5" style="width:58%">{{ $value->empresa}}</td>    
    <td style="width:17%">RUC</td>
    <td style="width:10%">{{ $value->ruc}}</td>
  </tr>
  <tr>    
    <td>Profesion / Ocupation</td>
    <td colspan="2">{{ $value->profesion}}</td>  
    <td>Estado Civil / Marital Status</td>
    <td colspan="2">{{ $value->estado_civil}}</td>
     <td>Documento de Identidad / Identity Document</td>
    <td >{{ $value->dni}}</td>
  </tr>
  <tr>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff"></td>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff"></td>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff"></td>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff;border-bottom:1px solid #fff"></td>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff;border-bottom:1px solid #fff"></td>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff;border-bottom:1px solid #fff"></td>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff;border-bottom:1px solid #fff"></td>
    <td style="width:12.5%;border-left:1px solid #fff;border-right:1px solid #fff;border-bottom:1px solid #fff"></td>
  </tr>
  <tr>    
    <td>Motivo de Viaje / Travel Reasons</td>   
    <td colspan="2">{{ $value->motivo_viaje}}</td>
    <td colspan="3" style="border-right:1px solid #fff;border-bottom:1px solid #fff"></td>
    <td colspan="2" style="border-right:1px solid #fff"></td>
  </tr>
  <tr>    
    <td colspan="6" style="border-left:1px solid #fff;border-right:1px solid #fff;border-bottom:1px solid #fff"></td>
    <td colspan="2" style="border-right:1px solid #fff;border-bottom:1px solid #fff;text-align:center">Firma - Signature</td>
  </tr>
</table>
<?php endforeach; ?>
<p>
       PARA SU CONVENIENCIA Y PROTECCION FAVOR DE DEPOSITAR SUS VALORES EN LAS CAJAS DE SEGURIDAD UBICADAS EN RECEPCION
       EL HOSTAL NO SE RESPONSABILIZA POR PERDIDAS EN LAS HABITACIONES U OTRAS DEPENDENCIAS
</p>
<p>
       FOR THEIR CONVENIENCE AND PROTECCION FAVOR OFNDEPOSITING THEIR VALUES IN THE LOCATED BOXES OF SEGURITY IN RECEPCION
       THE HOSTAL DOESN'T TAKE THE RESPONSABILITY HAD LOST IN THE ROOMS OR THEN DEPENDENCES
</p>
</body>
</html>