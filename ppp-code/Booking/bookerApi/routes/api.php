<?php

use Illuminate\Http\Request;
use App\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', 'UserController@register');

//start sesion
Route::post('login', 'UserController@authenticate');

//reload get data front
Route::get('autenticado/{id}', 'UserController@getAuthenticatedUser');



Route::get('/notapago/{pagos_id}','PagoController@pdf_nota_pago');
Route::get('/pdf_nota_pago_ticket/{pagos_id}','PagoController@pdf_nota_pago_ticket');
Route::get('/notapagoticket/{pagos_id}','PagoController@pdf_nota_pago_ticket');
Route::get('/fichaingreso/{reserva_id}/{persona_id}','ReservaEstanciaHuespedController@pdf_ficha_ingreso');
Route::get('/factura/{tipeid}/{id}','FacturacionController@pdf_imprime_comprobante');
Route::get('/ppedido/{id}','PedidoNotaConsumoMaestroController@get_pedido_print');
Route::get('/pproforma/{id}','ProformaController@get_proforma_print');
Route::get('/reportearrivodiario', 'ReservaEstanciaController@get_reporte_diario_arrivos');
Route::get('/reportesalidadiario', 'ReservaEstanciaController@get_reporte_diario_salidas');
Route::get('/resumenestancia/{id}', 'ReservaEstanciaController@get_resumen_estacia_pdf');

Route::get('/pcomandas/{id}','ZonaProduccionController@pdf_imprime_comanda');
Route::get('/pcomandas/{id}/{producto_id}/{unidad_medida_id}','ZonaProduccionController@pdf_imprime_comanda');

Route::get('/rresumen','ReservaEstanciaController@get_resumen_reserva_estancia');
Route::resource('/tipodocumento', 'TipoDocumentoController');

Route::get('validate-token/', function () {
    return ['user' => User::where("username", "brettsacuna")->get(),'valid' => true];
});

Route::middleware(['jwt.verify'])->group(function () {
    //Envio de correo de registro
    Route::post('/sendreserva','ReservaEstanciaController@get_send_reserva');
    Route::post('/sendreserva_smtp2go_api','ReservaEstanciaController@get_send_reserva_smtp2go_api');
    //
    Route::get('/persona/search', 'PersonaController@getpersonaid');
    Route::get('/rhabitacion/search','ReservaEstanciaHabitacionController@gethabitacionreservaestancia');
    Route::get('/rhuesped/search','ReservaEstanciaHuespedController@gethuespedreservaestancia');
    Route::get('/fsearch','ReservaEstanciaController@getreserva_fecha');
    Route::post('/pfreserva','ReservaEstanciaController@putreserva_fechas');
    Route::post('/checkin','ReservaEstanciaController@check_in');
    Route::post('/checkout','ReservaEstanciaController@check_out');
    Route::post('/pelhreserva','ReservaEstanciaHabitacionController@putearlycheckin_latecheckout');
    Route::post('/aadulnino','ReservaEstanciaController@actualiza_cant_adulto_niño');
    Route::post('/rapersona','PersonaController@registraActualizaPerona');
    Route::post('/rhuespedr','ReservaEstanciaHuespedController@registra_huesped_reserva');
    Route::post('/ahuespedr','ReservaEstanciaHuespedController@actualiza_huesped_reserva');
    Route::post('/dhuespedr','ReservaEstanciaHuespedController@delete_huesped_reserva');
    Route::post('/dreserva','ReservaEstanciaController@del_reserva_estancia');
    Route::get('/greservapth','ReservaEstanciaController@get_reserva_tarifas_paq_hab');
    Route::post('/ureservapth','ReservaEstanciaController@put_reserva_tarifas_paq_hab');
    Route::get('/gprofesion','ReservaEstanciaHuespedController@mostrar_profesion');
    Route::get('/gprode','ReservaEstanciaHuespedController@mostrar_procedencia_destino');
    Route::get('/aestancia/{reserva_id}','ReservaEstanciaController@get_anular_estancia');

    Route::post('/rvuelor','ReservaEstanciaVueloController@registra_vuelo_reserva');
    Route::post('/avuelor','ReservaEstanciaVueloController@actualiza_vuelo_reserva');
    Route::post('/dvuelor','ReservaEstanciaVueloController@delete_vuelo_reserva');
    Route::get('/gvuelos/{reserva_estancia_id}','ReservaEstanciaVueloController@mostrar_vuelos_reserva');
    Route::get('/ghuespedes/{reserva_estancia_id}','ReservaEstanciaHuespedController@mostrar_huesped_reserva');
    Route::get('/gextrasel/{reserva_estancia_id}','ReservaEstanciaHabitacionController@mostrar_extras_early_late');

    Route::post('/rpagos','PagoController@registrar_pagos');
    Route::post('/apagos','PagoController@actualizar_pagos');
    Route::post('/dpagos','PagoController@delete_pago');
    Route::get('/gpagos/{pago_id}','PagoController@mostrar_pagos_reserva_estancia');

    Route::post('/rpncm','PedidoNotaConsumoMaestroController@set_pedido_nota_consumo_maestro');
    Route::post('/rpncmd','PedidoNotaConsumoMaestroDetalleController@set_pedido_nota_consumo_maestro_detalle');
    Route::get('/gpncmd/{pedido_id}','PedidoNotaConsumoMaestroDetalleController@get_list_pedido_nota_consumo_maestro_detalle');
    Route::get('/gpncm/{pedido_id}','PedidoNotaConsumoMaestroController@get_pedido_nota_consumo_maestro');
    Route::get('/gpncm/{id}/{tipo}','PedidoNotaConsumoMaestroController@get_list_pedido_nota_consumo_maestro');
    Route::post('/dpncmd','PedidoNotaConsumoMaestroDetalleController@del_pedido_nota_consumo_maestro_detalle');
    Route::post('/dpncm','PedidoNotaConsumoMaestroController@del_pedido_nota_consumo_maestro');

    Route::get('/gprod','ProductoController@get_lista_producto');

    Route::get('/ecuadro01','ReservaEstanciaController@get_estadistico_01');
    Route::get('/ecuadro02','ReservaEstanciaController@get_estadistico_02');
    Route::get('/ecuadro03','ReservaEstanciaController@get_estadistico_03');
    Route::get('/ecuadro04','ReservaEstanciaController@get_estadistico_04');
    Route::get('/ecuadro05','ReservaEstanciaController@get_estadistico_05');
    
    //RUTAS QUE INCLUYEN TODOS LOS MÉTODOS HTTP
    Route::resource('/bancos', 'BancosController');   
    Route::resource('/aerolinea', 'AerolineaController');
    Route::resource('/reserva', 'ReservaEstanciaController');
    //Route::resource('/greserva/{id}', 'ReservaEstanciaController@show');

    //MANTENIMIENTO DE CLASE HABITACION
    Route::resource('/clasehabitacion', 'ClaseHabitacionController');
    Route::post('/rclasehabitacion','ClaseHabitacionController@set_claseHabitacion_insert');
    Route::post('/aclasehabitacion','ClaseHabitacionController@set_claseHabitacion_update');
    Route::post('/eclasehabitacion','ClaseHabitacionController@set_claseHabitacion_delete');
    Route::post('/cclasehabitacion','ClaseHabitacionController@set_claseHabitacion_cancel');
    Route::get('/gclasehabitacion/{ClaseHabitacionController}','ClaseHabitacionController@get_claseHabitacion_id');
    
    Route::resource('/persona','PersonaController');
    Route::resource('/pago','PagoController');
    Route::resource('/rhabitacion','ReservaEstanciaHabitacionController');
    Route::resource('/rhuesped','ReservaEstanciaHuespedController');
    Route::resource('/paquetes','PaquetesTuristicosController');
    Route::resource('/empleado','EmpleadosController');
    Route::resource('/vuelos','ReservaEstanciaVueloController');
    Route::resource('/canales', 'CanalesVentasReservaController');

    //MANTENIMIENTO DE PRODUCTO O SERVICIO Y SUS ATRIBUTOS
    Route::resource('/producto', 'ProductoController');
    Route::post('/rproducto','ProductoController@set_producto_insert');
    Route::post('/aproducto','ProductoController@set_producto_update');
    Route::post('/eproducto','ProductoController@set_producto_delete');
    Route::post('/cproducto','ProductoController@set_producto_cancel');
    Route::get('/gproducto/{producto_id}','ProductoController@get_producto_id');

    //MANTENIMIENTO DE MENUS
    Route::resource('/menu', 'MenuController');
    Route::post('/rmenu','MenuController@set_menu_insert');
    Route::post('/amenu','MenuController@set_menu_update');
    Route::get('/menupadres','MenuController@get_menu_padres');
    Route::get('/menus','MenuController@get_menus');
    Route::post('/emenu','MenuController@set_menu_delete');

    //MANTENIMIENTO DE USUARIOMENUS
    Route::resource('/usuariomenu', 'UsuarioMenusController');
    Route::post('/rusuariomenu','UsuarioMenusController@set_usuariomenu_insert');
    Route::post('/ausuariomenu','UsuarioMenusController@set_usuariomenu_update');
    Route::post('/eusuariomenu','UsuarioMenusController@set_usuariomenu_delete');

    //MANTENIMIENTO DE CLASE
    Route::resource('/clase', 'ClaseController');
    Route::post('/rclase','ClaseController@set_clase_insert');
    Route::post('/aclase','ClaseController@set_clase_update');
    Route::post('/eclase','ClaseController@set_clase_delete');
    Route::post('/cclase','ClaseController@set_clase_cancel');
    Route::get('/gclase/{clase_id}','ClaseController@get_clase_id');

   //MANTENIMIENTO DE SUBCLASE
    Route::resource('/subclase', 'SubClaseController');
    Route::post('/rsubclase','SubClaseController@set_subclase_insert');
    Route::post('/asubclase','SubClaseController@set_subclase_update');
    Route::post('/esubclase','SubClaseController@set_subclase_delete');
    Route::post('/csubclase','SubClaseController@set_subclase_cancel');
    Route::get('/gsubclase/{sub_clase_id}','SubClaseController@get_subclase_id');

    //MANTENIMIENTO DE MARCA
    Route::resource('/marca', 'MarcaController');
    Route::post('/rmarca','MarcaController@set_marca_insert');
    Route::post('/amarca','MarcaController@set_marca_update');
    Route::post('/emarca','MarcaController@set_marca_delete');
    Route::post('/cmarca','MarcaController@set_marca_cancel');
    Route::get('/gmarca/{marca_id}','MarcaController@get_marca_id');

    //MANTENIMIENTO DE MATERIAL
    Route::resource('/material', 'MaterialController');
    Route::post('/rmaterial','MaterialController@set_material_insert');
    Route::post('/amaterial','MaterialController@set_material_update');
    Route::post('/ematerial','MaterialController@set_material_delete');
    Route::post('/cmaterial','MaterialController@set_material_cancel');
    Route::get('/gmaterial/{material_id}','MaterialController@get_material_id');

    //MANTENIMIENTO DE PRESENTACION
    Route::resource('/presentacion', 'PresentacionController');
    Route::post('/rpresentacion','PresentacionController@set_presentacion_insert');
    Route::post('/apresentacion','PresentacionController@set_presentacion_update');
    Route::post('/epresentacion','PresentacionController@set_presentacion_delete');
    Route::post('/cpresentacion','PresentacionController@set_presentacion_cancel');
    Route::get('/gpresentacion/{presentacion_id}','PresentacionController@get_presentacion_id');

    //MANTENIMIENTO DE TIPO DE EXISTENCIA
    Route::resource('/tipoexistencia', 'TipoExistenciaController');
    Route::post('/rtipoexistencia','TipoExistenciaController@set_tipoexistencia_insert');
    Route::post('/atipoexistencia','TipoExistenciaController@set_tipoexistencia_update');
    Route::post('/etipoexistencia','TipoExistenciaController@set_tipoexistencia_delete');
    Route::post('/ctipoexistencia','TipoExistenciaController@set_tipoexistencia_cancel');
    Route::get('/gtipoexistencia/{tipo_existencia_id}','TipoExistenciaController@get_tipoexistencia_id');

    //MANTENIMIENTO DE UNIDAD DE MEDIDA 
    Route::resource('/unidadmedida', 'UnidadMedidaController');
    Route::post('/runidadmedida','UnidadMedidaController@set_unidadmedida_insert');
    Route::post('/aunidadmedida','UnidadMedidaController@set_unidadmedida_update');
    Route::post('/eunidadmedida','UnidadMedidaController@set_unidadmedida_delete');
    Route::post('/cunidadmedida','UnidadMedidaController@set_unidadmedida_cancel');
    Route::get('/gunidadmedida/{unidad_medida_id}','UnidadMedidaController@get_unidadmedida_id');

    //MANTENIMIENTO DE TIPO DE EXISTENCIA
    Route::resource('/habitacion', 'HabitacionController');
    Route::post('/rhabitacion','HabitacionController@set_habitacion_insert');
    Route::post('/ahabitacion','HabitacionController@set_habitacion_update');
    Route::post('/ehabitacion','HabitacionController@set_habitacion_delete');
    Route::post('/chabitacion','HabitacionController@set_habitacion_cancel');
    Route::get('/ghabitacion/{habitacion_id}','HabitacionController@get_habitacion_id');

    //MANTENIMIENTO DE TIPO DE EXISTENCIA
    Route::resource('/paquetes','PaquetesTuristicosController');
    Route::post('/rpaquetes','PaquetesTuristicosController@set_paquete_turs_insert');
    Route::post('/apaquetes','PaquetesTuristicosController@set_paquete_turs_update');
    Route::post('/epaquetes','PaquetesTuristicosController@set_paquete_turs_delete');
    Route::post('/cpaquetes','PaquetesTuristicosController@set_paquete_turs_cancel');
    Route::get('/gpaquetes/{paquete_turisticos_id}','PaquetesTuristicosController@get_paquete_turs_id');

    Route::resource('/ubicacion','UbicacionController');
    Route::resource('/tipohabitacion','TipoHabitacionController');
    Route::resource('/cama','CamaController');
    Route::resource('/servicio','ServicioController');

    //MANTENIMIENTO DE HABITACION CAMA
    Route::resource('/hcama','HabitacionCamaController');
    Route::post('/rhcama','HabitacionCamaController@set_habitacion_cama_insert');    
    Route::post('/ehcama','HabitacionCamaController@set_habitacion_cama_delete');
    Route::get('/ghabitacioncama/{habitacion_id}','HabitacionCamaController@get_habitacion_cama_id');

    //MANTENIMIENTO DE HABITACION CLASE
    Route::resource('/hclase','HabitacionClaseController');
    Route::post('/rhclase','HabitacionClaseController@set_habitacion_clase_insert');    
    Route::post('/ehclase','HabitacionClaseController@set_habitacion_clase_delete');
    Route::get('/ghabitacionclase/{habitacion_id}','HabitacionClaseController@get_habitacion_clase_id');
    
    //MANTENIMIENTO DE HABITACION SERVICIO
    Route::resource('/hservicio','HabitacionServicioController');
    Route::post('/rhservicio','HabitacionServicioController@set_habitacion_servicio_insert');    
    Route::post('/ehservicio','HabitacionServicioController@set_habitacion_servicio_delete');
    Route::get('/ghabitacionservicio/{habitacion_id}','HabitacionServicioController@get_habitacion_servicio_id');

    //MANTENIMIENTO DE PERSONA
    Route::get('/gupersona/{ubica_persona}', 'PersonaController@get_persona_proveedor_ubica_persona');
    Route::post('/rpersonaprovedor','PersonaController@set_persona_proveedor_insert');
    Route::post('/apersonaprovedor','PersonaController@set_persona_proveedor_update');
    Route::post('/epersonaprovedor','PersonaController@set_persona_proveedor_delete');
    Route::post('/cpersonaprovedor','PersonaController@set_persona_proveedor_cancel');

    //MANTENIMIENTO DE COMPROBANTE
    Route::resource('/comprobante','ComprobanteController');
    Route::post('/rcomprobante','ComprobanteController@set_comprobante_insert');
    Route::post('/acomprobante','ComprobanteController@set_comprobante_update');
    Route::post('/ecomprobante','ComprobanteController@set_comprobante_delete');
    Route::post('/ccomprobante','ComprobanteController@set_comprobante_cancel');
    Route::get('/gcomprobante/{comprobante_id}','ComprobanteController@get_comprobante_id');
    Route::post('/voucher_serie_comprobante','ComprobanteController@voucher_serie_comprobante');

    //MANTENIMIENTO DE ESTABLECIMIENTO
    Route::resource('/establecimiento','EstablecimientoController');
    Route::post('/raestablecimiento','EstablecimientoController@set_establecimiento_insert_update');

    //MANTENIMIENTO DE SUCURSAL
    Route::resource('/esucursal','EstablecimientoSucursalController');
    Route::post('/resucursal','EstablecimientoSucursalController@set_establecimiento_sucursal_insert');
    Route::post('/aesucursal','EstablecimientoSucursalController@set_establecimiento_sucursal_update');
    Route::post('/eesucursal','EstablecimientoSucursalController@set_establecimiento_sucursal_delete');
    Route::post('/cesucursal','EstablecimientoSucursalController@set_establecimiento_sucursal_cancel');
    Route::get('/gesucursal/{id}','EstablecimientoSucursalController@get_establecimiento_sucursal_id');

    //MANTENIMIENTO DE OPCIONES
    Route::resource('/opciones','OpcionesController');
    Route::post('/ropciones','OpcionesController@set_opciones_insert_update');    
    Route::get('/gopciones/{id}','OpcionesController@get_opciones_id');

    //MANTENIMIENTO DE OPCIONES
    Route::resource('/serie','SerieController');    
    Route::get('/serie/{id}','SerieController@show');
    Route::post('/rserie','SerieController@set_serie_comprobante_insert');
    Route::post('/aserie','SerieController@set_serie_comprobante_update');
    Route::post('/eserie','SerieController@set_serie_comprobante_delete');
    Route::post('/cserie','SerieController@set_serie_comprobante_cancel');
    Route::get('/gserie/{id}','SerieController@get_serie_comprobante_id');

    //PARA MANTENIMIENTO DE USUARIO
    Route::resource('/usuario', 'UsuarioController');
    Route::post('/rusuario','UsuarioController@set_usuario_insert');
    Route::post('/ausuario','UsuarioController@set_usuario_update');
    Route::post('/eusuario','UsuarioController@set_usuario_delete');
    Route::post('/cusuario','UsuarioController@set_usuario_cancel');
    Route::get('/gusuario/{id}','UsuarioController@get_usuario_id');

    
    Route::resource('/tipopago', 'TipoPagoController');
    Route::resource('/tipomoneda', 'TipoMonedaController');
    Route::get('/preciodollar', 'TipoMonedaController@get_precio_dollar');
    Route::get('/tipoformapago/{tipo_pago_id}', 'TipoFormaPagoController@get_tipo_forma_pago_x_tipo_pago');
    Route::get('/seriexcomprobantexusuario/{idu}/{idc}/{ids}', 'SerieController@get_serie_x_comprobante_id_usuario_id');
    Route::get('/seriexcomprobante/{idu}/{idc}', 'SerieController@get_serie_x_comprobante_id');

    //MANTENIMIENTO DE USUARIO SERIE
    Route::resource('/usuarioserie', 'UsuarioSerieController');
    Route::post('/rusuarioserie','UsuarioSerieController@set_usuario_serie_insert');
    Route::post('/ausuarioserie','UsuarioSerieController@set_usuario_serie_update');
    Route::post('/eusuarioserie','UsuarioSerieController@set_usuario_serie_delete');
    Route::post('/cusuarioserie','UsuarioSerieController@set_usuario_serie_cancel');

    //REGISTRO DE FACTURACION
    Route::resource('/facturacion', 'FacturacionController');
    Route::get('/facturacion/{id}', 'FacturacionController@show');
    Route::post('/rfacturacion','FacturacionController@set_facturacion_insert');
    Route::get('/dfacturacion/{id}','FacturacionController@get_facturacion_delete');
    Route::post('/afacturacion','FacturacionController@set_facturacion_update');
    Route::post('/cfacturacion','FacturacionController@set_facturacion_anular');
    Route::get('/facturadetalle/{id}', 'FacturacionController@get_factura_cabecera_detalle_lista');
    Route::post('/creservaestancialist','ReservaEstanciaController@get_reserva_estancia_cabecera_list');
    Route::get('/cconsumopagolist/{id}','ReservaEstanciaController@get_pago_consumo_list');

    //PARA GESTIONAR PEDIDO
    Route::resource('/pedidos', 'PedidoNotaConsumoMaestroController');
    Route::get('/pedidos/{tipo_consumo}', 'PedidoNotaConsumoMaestroController@show');
    Route::post('/chabitacionpedido', 'PedidoNotaConsumoMaestroController@get_habitacion_reserva_modal');
    Route::post('/rpedidoform','PedidoNotaConsumoMaestroController@set_pedido_nota_consumo_maestro_form_pedido');
    Route::post('/apedidoform','PedidoNotaConsumoMaestroController@set_pedido_nota_consumo_maestro_form_pedido_update');
    Route::post('/epedido','PedidoNotaConsumoMaestroController@set_pedido_nota_consumo_maestro_y_detalle_delete');
    Route::get('/cpedido/{id}','PedidoNotaConsumoMaestroController@get_pedido_cabecera_detalle_lista');

    //GESTIONAR PROFORMA
    Route::resource('/proforma', 'ProformaController');
    Route::post('/rproformaform', 'ProformaController@set_proforma_detalle_insert');
    Route::post('/aproformaform', 'ProformaController@set_proforma_detalle_update');
    Route::post('/eproforma','ProformaController@set_proforma_delete');
    Route::get('/cproforma/{id}','ProformaController@get_proforma_cabecera_detalle_lista');

    //GESTIONAR CAJA
    Route::resource('/apertura', 'AperturaCajaController');
    Route::get('/apertura/{id}', 'AperturaCajaController@show');
    Route::post('/rapertura', 'AperturaCajaController@set_Apertura_caja_insert');
    Route::post('/aapertura', 'AperturaCajaController@set_Apertura_caja_update');
    Route::post('/eapertura','AperturaCajaController@set_Apertura_caja_delete');
    Route::get('/capertura/{id}','AperturaCajaController@get_Apertura_caja_detalle_lista'); 
    Route::get('/gaperturas/{idusuario}','AperturaCajaController@get_apertura_caja_activa');    
    Route::post('/aaperturacierre', 'AperturaCajaController@set_Apertura_caja_cierre');

    //GESTIONAR CAJA CHICA
    Route::resource('/cajachica', 'CajaChicaController');
    Route::post('/rcajachica', 'CajaChicaController@set_caja_chica_insert');
    Route::post('/acajachica', 'CajaChicaController@set_caja_chica_update');
    Route::post('/ccajachica','CajaChicaController@set_caja_chica_anular');
    Route::get('/gcajachica/{id}','CajaChicaController@get_caja_chica_detalle_lista');    
    
    //Consulta RUC DNI
    Route::get('/consultadni/{dni}','SunatCPEController@Consulta_DNI');
    Route::get('/consultaruc/{ruc}','SunatCPEController@Consulta_RUC');
   
    //GESTIONAR SUNAT
    Route::post('/generacomprobante','SunatCPEController@generar_comprobante');
    Route::post('/firmacomprobante', 'SunatCPEController@firmar_comprobante');
    Route::post('/enviarcomprobante', 'SunatCPEController@enviar_comprobante');

    //Route::resource('/invoicesunat', 'InvoiceSunatController');
    //Route::post('/uploadcertificado','InvoiceSunatController@upload_certificado');
    //Route::post('/rinvoicesunat', 'InvoiceSunatController@set_invoice_sunat_insert');


    //GESTIONAR UNIDAD DE MEDIDA POR PRODUCTO
    Route::resource('/umproducto', 'UnidadMedidaProductoController');
    Route::post('/rumproducto', 'UnidadMedidaProductoController@set_unidadmedida_producto_insert');
    Route::post('/aumproducto', 'UnidadMedidaProductoController@set_unidadmedida_producto_update');
    Route::post('/eumproducto','UnidadMedidaProductoController@set_unidadmedida_producto_delete');
    Route::get('/gumproducto/{idproducto}/{idunidad}','UnidadMedidaProductoController@get_caja_chica_detalle_lista');  

    //GESTION ZONA DE PRODUCCIÓN
    Route::resource('/zonaproduccion', 'ZonaProduccionController');
    Route::get('/zonaproduccionproducto/{id}','ZonaProduccionController@get_production_area_by_product'); 
    Route::post('/rzonaproduccion','ZonaProduccionController@set_production_area_by_product');
    Route::post('/ezonaproduccion','ZonaProduccionController@set_production_area_delete');
    
    //GESTIONAR NOTA DE CREDITO
    Route::resource('/notacredito', 'NotaCreditoController');
    Route::post('/rnotacredito', 'NotaCreditoController@set_nota_credito_insert');
    Route::post('/anotacredito', 'NotaCreditoController@set_unidadmedida_producto_update');
    //Route::post('/eumproducto','UnidadMedidaProductoController@set_unidadmedida_producto_delete');
    Route::get('/gnotacredito/{id}','NotaCreditoController@get_caja_chica_detalle_lista'); 

    //CARGAR DISCREPANCIAS
    Route::resource('/tdiscrepancias', 'TipoDiscrepanciaController'); 

    //DASHBOARD
    Route::resource('/dashboard','DashboardController');
    

});