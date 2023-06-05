<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/*
Route::get('/', function () {
    return view('welcome');
});*/
/*
Route::group(['middleware' => ['cors']], function () {
    //Rutas a las que se permitirá acceso
    Route::get('/persona/{parametro}', 'PersonaController@getpersonaid');
    //RUTAS QUE INCLUYEN TODOS LOS MÉTODOS HTTP
    Route::resource('/', 'UsuarioController');
    Route::resource('/usuario', 'UsuarioController');
    Route::resource('/habitacion', 'HabitacionController');
    Route::resource('/clasehabitacion', 'ClaseHabitacionController');
    Route::resource('/aerolinea', 'AerolineaController');
    Route::resource('/reserva', 'ReservaEstanciaController');
    Route::resource('/persona','PersonaController');
    Route::resource('/pago','PagoController');
});

Route::group(['middleware' => ['jwt.verify']], function() {
    Route::get('/persona/{parametro}', 'PersonaController@getpersonaid');
    //RUTAS QUE INCLUYEN TODOS LOS MÉTODOS HTTP
    Route::resource('/', 'UsuarioController');
    Route::resource('/usuario', 'UsuarioController');
    Route::resource('/habitacion', 'HabitacionController');
    Route::resource('/clasehabitacion', 'ClaseHabitacionController');
    Route::resource('/aerolinea', 'AerolineaController');
    Route::resource('/reserva', 'ReservaEstanciaController');
    Route::resource('/persona','PersonaController');
    Route::resource('/pago','PagoController');
});


Route::middleware(['jwt.verify', 'cors'])->group(function () {
    Route::get('/persona/{parametro}', 'PersonaController@getpersonaid');
    //RUTAS QUE INCLUYEN TODOS LOS MÉTODOS HTTP
    Route::resource('/', 'UsuarioController');
    Route::resource('/usuario', 'UsuarioController');
    Route::resource('/habitacion', 'HabitacionController');
    Route::resource('/clasehabitacion', 'ClaseHabitacionController');
    Route::resource('/aerolinea', 'AerolineaController');
    Route::resource('/reserva', 'ReservaEstanciaController');
    Route::resource('/persona','PersonaController');
    Route::resource('/pago','PagoController');
});
*/
