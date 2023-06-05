<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Indicates whether the XSRF-TOKEN cookie should be set on the response.
     *
     * @var bool
     */
    protected $addHttpCookie = true;

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'http://api.accorddev.com/usuario',
        'http://api.accorddev.com/reserva',
        'http://api.accorddev.com/reserva/*',
        'http://api.accorddev.com/persona',
        'http://api.accorddev.com/persona/*',
        'http://api.accorddev.com/pago',
        'http://api.accorddev.com/pago/*'
    ];
}
