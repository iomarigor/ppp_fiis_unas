<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha de reserva</title>
    <style>
    body {
        font: 10px Arial, Tahoma, Verdana, Helvetica, sans-serif;
        color: #000;
    }


    img {
        width: 100%;
    }
    </style>
</head>

<body>
    <img src="{{ asset('img/logofacpdf.jpg')}}" alt="logo" />
    <h4>Reserva estancia</h4>
    <p>Buenos dias {{$data['nameUser']}}</p>
    <p>{{$data['detalle']}}</p>
    <h5>Link de registor de huespedes: </h5>
    <a href="{{$data['urlSend']}}" target="_blank">
        <img src="{{ asset('img/chek_in.png')}}" style="width:4rem !important" alt="chek-in" />
    </a>
    <p>{{$data['urlSend']}}</p>
</body>

</html>