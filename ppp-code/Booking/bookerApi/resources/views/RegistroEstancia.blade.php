<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Resumen Reserva</title>
    <style>
    body {
        font: 10px Arial, Tahoma, Verdana, Helvetica, sans-serif;
        color: #000;
    }

    table {
        width: 100%;
    }

    table#header td {
        border: 0;
        border-collapse: collapse;
    }

    table#header table {
        border: 1px solid black
    }

    #t01,
    #dcliente,
    #dfactura,
    tr,
    td {
        border: 1px solid black;
        border-collapse: collapse;
        margin: 0px 0px 1px
    }

    th,
    td {
        padding: 2px;
        text-align: left;
    }


    table#t01 th {
        background-color: silver;
        color: white;
    }

    img {
        width: 380px;
        height: 70px;
        position: absolute;
    }
    </style>
</head>

<body>
    <table id="header">
        <tr>
            <td colspan="2"><img src="{{ public_path('img/logofacpdf.jpg')}}" /></td>
            <td colspan="2" style="width:30%">
                <table>
                    <tr>
                        <td style="font-size:14px;text-align:center">RUC: 20600306970</td>
                    </tr>
                    <tr>
                        <td style="font-size:14px;text-align:center;background-color: #eee;"><strong>Codigo de
                                reserva/Habitación</strong></td>
                    </tr>
                    <tr>
                        <td style="font-size:14px;text-align:center">
                            {{$data['resumen'][0]->codigo_reserva}}/{{$data['resumen'][0]->numero_habitacion}}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table id="dcliente">
        <tr>
            <td style="width:90px"><strong>Cliente:<strong></td>
            <td style="width:170px">{{$data['resumen'][0]->razon_social_nombre}}</td>
            <td style="width:80px;text-align:right"><strong>N° Documento:</strong></td>
            <td style="width:180px">{{$data['resumen'][0]->numero_documento}}</td>
        </tr>
        <tr>
            <td><strong>Fecha Llegada:</strong></td>
            <td style="text-align:left">{{$data['resumen'][0]->fecha_llegada}}</td>
            <td style="text-align:right"><strong>Fecha Salida:</strong></td>
            <td>{{$data['resumen'][0]->fecha_salida}}</td>
        </tr>
        <tr>
            <td><strong>N° Adultos:</strong></td>
            <td>{{$data['resumen'][0]->numero_adultos}}</td>
            <td style="text-align:right"><strong>N° Niños:</strong></td>
            <td>{{$data['resumen'][0]->numero_ninos}}</td>
        </tr>
        <tr>
            <td><strong>Clase Habitación:</strong></td>
            <td>{{$data['resumen'][0]->clase_habitacion}}</td>
            <td style="text-align:right"><strong>Tarifa Clase:</strong></td>
            <td>{{$data['resumen'][0]->tarifa}}</td>
        </tr>
        <tr>
            <td><strong>Paquete:</strong></td>
            <td>{{$data['resumen'][0]->descripcion}}</td>
            <td style="text-align:right"><strong>Costo de Paquete:</strong></td>
            <td>{{$data['resumen'][0]->ptarifa}}</td>
        </tr>
        <tr>
            <td><strong>Early check-in:</strong></td>
            <td>{{$data['resumen'][0]->early_checkin}}</td>
            <td style="text-align:right"><strong>Late checkout:</strong></td>
            <td>{{$data['resumen'][0]->late_checkout}}</td>
        </tr>
        <tr>
            <td><strong>Canal:</strong></td>
            <td>{{$data['resumen'][0]->canales_venta_reserva}}</td>
            <td style="text-align:right"><strong>Total:</strong></td>
            <td>{{$data['resumen'][0]->total}}</td>
        </tr>
        <tr>
            <td><strong>Pagado:</strong></td>
            <td>{{$data['resumen'][0]->pagos}}</td>
            <td style="text-align:right"><strong>Saldo:</strong></td>
            <td>{{$data['resumen'][0]->saldo}}</td>
        </tr>
    </table>
    <p style="width:520"><strong>Huespedes:</strong></p>
    <table id="dfactura" style="margin-top:8px;">
        <tr>
            <!-- Fecha|descripción|cantidad|U.M|S.T -->
            <td style="width:80px"><strong>Documento</strong></td>
            <td style="width:152px"><strong>Cliente</strong></td>
            <td style="width:104px"><strong>Nacionalidad</strong></td>
            <td style="width:104px"><strong>Motivo Viaje:</strong></td>
            <td style="width:104px"><strong>Correo_electrónico</strong></td>
            <td style="width:80px"><strong>telefono</strong></td>
        </tr>
        <?php foreach($data['huespedes'] as $rowC):?>
        <tr>
            <td>{{$rowC->numero_documento}}</td>
            <td>{{$rowC->razon_social_nombre}}</td>
            <td>{{$rowC->nacionalidad}}</td>
            <td>{{$rowC->motivo_viaje}}</td>
            <td>{{$rowC->correo_electronico}}</td>
            <td>{{$rowC->telefono}}</td>
        </tr>
        <?php endforeach;?>
    </table>
</body>

</html>