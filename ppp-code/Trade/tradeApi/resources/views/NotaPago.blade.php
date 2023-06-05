<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Nota de Pago</title>
    <style>
     body{
        font:10px Arial, Tahoma, Verdana, Helvetica, sans-serif;        
        color:#000;
        }       
    
        table {       
        width:100%;
        }
        
        table#header td{
            border: 0;
            border-collapse: collapse;
        }
        table#header table{
            border:1px solid black
            
        }
        #t01,#dcliente,#dfactura ,tr,td {
        border: 1px solid black;
        border-collapse: collapse;
        margin: 0px 0px 1px
        }
        th, td {
        padding: 2px;
        text-align: left;
        }
      
        
        table#t01 th {
        background-color: silver;
        color: white;
        }

       img {          
          width:380px;
          height:70px;
          position:absolute;
       }
</style>
</head>
<body>
<?php foreach($pagos as $value): ?> <table id="header">
    <tr>
        <td colspan="2"><img src="{{ public_path('img/logofacpdf.jpg')}}" /></td>
        <td colspan="2" style="width:30%">
            <table>
                <tr><td style="font-size:14px;text-align:center">RUC: 20600306970</td></tr>
                <tr><td style="font-size:14px;text-align:center;background-color: #eee;"><strong>NOTA DE PAGO</strong></td></tr>
                <tr><td style="font-size:14px;text-align:center">{{$value->iddocumento}}</td></tr>
            </table>
        </td>    
    </tr>
</table>
<table id="dcliente">
  <tr>
    <td style="width:100px"><strong>Nombre o Razon Social:<strong></td>
    <td style="width:350px">{{ $value->razon_social_nombre }}</td>
    <td style="width:60px"><strong>N° Documento:</strong></td>
    <td style="width:50px">{{$value->numero_documento}}</td>
  </tr>
  <tr>
    <td colspan="4"><strong>Direccion:</strong></td>  
  </tr>
</table>
<table id="dfactura">
  <tr>
    <td style="width:60px"><strong>Fecha Emision:</strong></td>
    <td style="width:300px;text-align:left">{{date('d/m/Y')}}</td>
    <td style="width:80px;text-align:right"><strong>Medio de Pago:</strong></td>
    <td style="width:80px">{{$value->medio_pago}}</td>
  </tr>
  <tr>
    <td><strong>Habitacion</strong></td>
    <td>{{ $value->numero_habitacion}}</td>
    <td style="text-align:right"><strong>Entidad Bancaria:</strong></td>
    <td>{{ $value->banco}}</td>
  </tr>
</table>
<table id="t01">
  <tr>
    <th>Fecha Pago</th>
    <th>Concepto</th>
    <th>Moneda</th> 
    <th>Importe</th>
  </tr>
  <tr>
    <td style="width:50px;height:250px;vertical-align:top">{{$value->fecha_hora_deposito}}</td>
    <td style="width:380px;height:250px;vertical-align:top;text-transform: uppercase;">{{$value->concepto}}</td>
    <td style="width:50px;height:250px;text-align:center;vertical-align:top">{{$value->tipo_moneda}}</td>
    <td style="width:50px;height:250px;text-align:right;vertical-align:top">{{$value->monto_deposito}}</td>
  </tr>
</table
<?php endforeach; ?>
</body>
</html>