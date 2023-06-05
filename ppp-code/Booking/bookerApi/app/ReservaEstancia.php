<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReservaEstancia extends Model
{
    protected $table = 'reserva_estancia';
    protected $fillable = [
                'fecha_reserva',
                'fecha_llegada',
                'fecha_salida'            
    ];
}
