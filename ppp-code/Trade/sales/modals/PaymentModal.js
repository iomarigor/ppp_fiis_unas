import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import withDragDropContext from "../helper/withDnDContext";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import * as Actions from "store/actions/app";
import NewCustomerForm from "../../grid/form/new_custtomer.form";
import { ListItemText } from "@material-ui/core";
const PaymentModal = (props) => {
  const dispatch = useDispatch();
  const [show_new_customer_form, setShow_new_customer_form] = useState(false);
  const [customer, setCustomer] = useState(null);

  const [seriesVoucher, setSeriesVoucher] = useState([]);
  //const customer_saved = useSelector((gridApp) => gridApp.app.grid.customer_saved);
  //const set_saved_customer = useSelector((gridApp) => gridApp.app.grid.set_saved_customer);
  const search_customer_loading = useSelector(
    (gridApp) => gridApp.app.grid.search_customer_loading
  );

  const search_people = useSelector(
    (gridApp) => gridApp.app.grid.search_people
  );
  useEffect(() => {
    console.log(search_people);
    if (
      search_people &&
      Object.keys(props.client_save).length !== 0 &&
      props.statusModal
    ) {
      setCustomer(search_people[0]);
      let tValues = values;

      tValues.razon_social = search_people[0].razon_social_nombre || "";
      tValues.direccion = search_people[0].direccion || "";
      if (parseInt(search_people[0].tipo_documento_id) === 6) {
        const comprobante = props.vouchers_serie_comprobante.filter(
          (voucher) => parseInt(voucher.comprobante_id) === 1
        );
        if (comprobante.length === 0) {
          toast.error("El ususario no tiene una serie de facturas asignada");
          return;
        }
        tValues.comprobante = comprobante[0].comprobante_id;
        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);
        tValues.correlativo = zfill(
          parseInt(comprobante[0].series[0].correlativo),
          7
        );
        setSeriesVoucher(comprobante[0].series);
      } else {
        const comprobante = props.vouchers_serie_comprobante.filter(
          (voucher) => parseInt(voucher.comprobante_id) === 2
        );
        if (comprobante.length === 0) {
          toast.error("El ususario no tiene una serie de boletas asignada");
          return;
        }
        tValues.comprobante = comprobante[0].comprobante_id;
        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);
        tValues.correlativo = zfill(
          parseInt(comprobante[0].series[0].correlativo),
          7
        );
        setSeriesVoucher(comprobante[0].series);
      }
      setValues(tValues);
      //let tValues= valuesHeader;
      //tValues.razon_social=search_people[0].razon_social_nombre;
      //localStorage.setItem("customerOrders",JSON.stringify(search_people[0]));
      //setValues(tValues);
      props.clienteSaveReset();
      dispatch(Actions.searchPerson(null));
    }
  }, [search_people]);
  useEffect(() => {
    //console.log(props.client_save);
    if (Object.keys(props.client_save).length != 0) {
      //console.log(typeof props.client_save);
      if (!Array.isArray(props.client_save)) {
        handleSearchCustomer(props.client_save.razon_social_nombre);
      } else {
        handleSearchCustomer(props.client_save[0].razon_social_nombre);
      }
    }
  }, [props.client_save]);
  const handleSearchCustomer = (query) => {
    dispatch(Actions.searchCustomerLoading(true));
    dispatch(Actions.searchPerson(query.toLowerCase()));
  };
  const handleSelectCustomer = (selected) => {
    if (selected.length > 0) {
      setCustomer(selected[0]);
      let tValues = values;

      tValues.razon_social =
        selected[0].razon_social_nombre + " - " + selected[0].numero_documento;
      tValues.direccion = selected[0].direccion;
      if (parseInt(selected[0].tipo_documento_id) === 6) {
        const comprobante = props.vouchers_serie_comprobante.filter(
          (voucher) => parseInt(voucher.comprobante_id) === 1
        );
        if (comprobante.length === 0) {
          toast.error("El ususario no tiene una serie de facturas asignada");
          return;
        }
        tValues.comprobante = comprobante[0].comprobante_id;

        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);
        tValues.correlativo = zfill(
          parseInt(comprobante[0].series[0].correlativo),
          7
        );
        setSeriesVoucher(comprobante[0].series);
        /*  let temp = {
          target: {
            type: "select-one",
            name: "comprobante",
            value: comprobante[0].comprobante_id,
          },
        };
        handleInputChange(temp); */
      } else {
        const comprobante = props.vouchers_serie_comprobante.filter(
          (voucher) => parseInt(voucher.comprobante_id) === 2
        );
        if (comprobante.length === 0) {
          toast.error("El ususario no tiene una serie de boletas asignada");
          return;
        }
        tValues.comprobante = comprobante[0].comprobante_id;
        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);
        tValues.correlativo = zfill(
          parseInt(comprobante[0].series[0].correlativo),
          7
        );
        setSeriesVoucher(comprobante[0].series);
      }
      setValues(tValues);
    } else {
      setCustomer(null);
    }
  };
  const handleChangeShowCustomerForm = () => {
    setShow_new_customer_form(!show_new_customer_form);
  };
  const handleCustomerSaved = (saved) => {
    setCustomer(saved);
  };

  //inicializamos los valores de los inputs
  const initialsStateValues = {
    doc_identidad: null,
    razon_social: null,
    direccion: null,
    comprobante: 0,
    serie: 0,
    numero: null,
    cambio: 0,
    tipo_pago: 0,
    forma_pago: 0,
    fecha_emision: "",
    correlativo: "",
    moneda: 1,
    efectivo: null,
    vuelto: null,
    numero_operacion: "",
    observacion: "",
  };
  const [values, setValues] = useState(initialsStateValues);
  const [items, setItems] = useState([]);

  //se consulta los registros y se inicializa values
  useEffect(() => {
    if (props.statusModal && props.tabKey == "salesRecord") {
      props.getAllVouchersSerieComprobante(props.userRole);
      //props.getAllVouchers();
      props.getAllTypesPayments();
      props.getAllCoinType();
      props.getAllClientsProviders(1);
      var today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1 < 10
          ? `0${today.getMonth() + 1}`
          : today.getMonth() + 1) +
        "-" +
        (today.getDate() < 10 ? `0${today.getDate()}` : today.getDate());
      setValues({ ...values, fecha_emision: date });
      setItems(JSON.parse(localStorage.getItem("arraySales")));
    }
  }, [props.statusModal]);
  useEffect(() => {
    if (props.clients_providers && props.statusModal) {
      let tipoInput = items[0].id.split("-");
      if (
        tipoInput[0] == "PC" ||
        tipoInput[0] == "PF" ||
        tipoInput[0] == "RC"
      ) {
        const user = props.clients_providers.filter(
          (p) => p.persona_id == parseInt(items[0].persona_id)
        )[0];
        console.log(user);
        setCustomer(user);
        let tValues = values;

        tValues.razon_social =
          user.razon_social_nombre + " - " + user.numero_documento;
        tValues.direccion = user.direccion;

        setValues(tValues);
        //console.log(props.clients_providers.filter(p=>p.persona_id==items[0].persona_id),items[0].persona_id);
      }
      console.log(items);
    }
  }, [props.clients_providers]);
  //se consulta el registro de vouchers
  useEffect(() => {
    if (props.vouchers_serie_comprobante && props.statusModal) {
      if (props.vouchers_serie_comprobante.length === 0) {
        toast.error(
          "El usuario no tiene ninguna serie asignado, no puede generar facturas"
        );
        hideModal();
        return;
      }
      setValues({
        ...values,
        comprobante: parseInt(
          props.vouchers_serie_comprobante[0].comprobante_id
        ),
        serie: parseInt(
          props.vouchers_serie_comprobante[0].series[0].serie_comprobante_id
        ),
        correlativo: zfill(
          parseInt(props.vouchers_serie_comprobante[0].series[0].correlativo),
          parseInt(props.vouchers_serie_comprobante[0].digitos)
        ),
      });
      setSeriesVoucher(props.vouchers_serie_comprobante[0].series);
    }
  }, [props.vouchers_serie_comprobante]);

  //Se consulta el registro de correlativo
  /* useEffect(() => {
    if (props.series.length > 0 && props.tabKey == "salesRecord") {
      const form = {
        idUser: props.userRole.id,
        idVoucher: values.comprobante,
        idSerie: props.series[0].serie_comprobante_id,
      };
      setValues({ ...values, serie: props.series[0].serie_comprobante_id });

      props.getCorrelativeSeriesVoucher(form);
    }
  }, [props.series]); */

  //se asigna el correlativo
  /*  useEffect(() => {
    if (
      props.correlativo != undefined &&
      Object.keys(props.correlativo).length != 0 &&
      props.tabKey == "salesRecord"
    ) {
      setValues({
        ...values,
        correlativo: zfill(parseInt(props.correlativo.correlativo), 7),
      });
    }
  }, [props.correlativo]); */
  const zfill = (number, width) => {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
      if (number < 0) {
        return "-" + numberOutput.toString();
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return "-" + zero.repeat(width - length) + numberOutput.toString();
      } else {
        return zero.repeat(width - length) + numberOutput.toString();
      }
    }
  };

  //se inicializa el tipo de moneda
  useEffect(() => {
    if (props.coins_types.length > 0 && props.tabKey == "salesRecord") {
      setValues({ ...values, moneda: props.coins_types[0].tipo_moneda_id });
    }
  }, [props.coins_types]);

  //se inicializa el valor de tipo pago
  useEffect(() => {
    if (props.types_payments.length != 0 && props.tabKey == "salesRecord") {
      props.getAllTypesPaymentsFroms(props.types_payments[0].tipo_pago_id);
      setValues({ ...values, tipo_pago: props.types_payments[0].tipo_pago_id });
    }
  }, [props.types_payments]);

  //inicializa el valor de forma pago
  useEffect(() => {
    if (
      props.types_payments_froms.length != 0 &&
      props.tabKey == "salesRecord"
    ) {
      setValues({
        ...values,
        forma_pago: props.types_payments_froms[0].tipo_forma_pago_id,
      });
    }
  }, [props.types_payments_froms]);

  //actualiza los regitros de los values
  const handleInputChange = (e) => {
    //console.log(e.target.type);

    if (e.target.type == "checkbox") {
      var { name, checked } = e.target;
      checked = checked == true ? 1 : 0;
      setValues({ ...values, [name]: checked });
    }
    if (e.target.type == "text") {
      //console.log(e.target.type);
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    }
    if (e.target.type == "select-one") {
      const { name, value } = e.target;
      if (name != "comprobante" && name != "serie")
        setValues({ ...values, [name]: parseInt(value) });
      if (name == "tipo_pago") {
        props.getAllTypesPaymentsFroms(parseInt(value));
      }
      if (name === "comprobante") {
        /* const form = {
          idUser: props.userRole.id,
          idVoucher: parseInt(value),
        };
        props.getAllSeriesVoucher(form); */
        const comprobante = props.vouchers_serie_comprobante.filter(
          (voucher) => parseInt(voucher.comprobante_id) === parseInt(value)
        )[0];
        console.log({
          ...values,
          serie: parseInt(comprobante.series[0].serie_comprobante_id),
          correlativo: zfill(parseInt(comprobante.series[0].correlativo), 7),
          [name]: parseInt(value),
        });
        setValues({
          ...values,
          serie: parseInt(comprobante.series[0].serie_comprobante_id),
          correlativo: zfill(parseInt(comprobante.series[0].correlativo), 7),
          [name]: parseInt(value),
        });
        setSeriesVoucher(comprobante.series);
      }
      if (name === "serie") {
        /* const form = {
          idUser: props.userRole.id,
          idVoucher: values.comprobante,
          idSerie: parseInt(value),
        };
        props.getCorrelativeSeriesVoucher(form); */
        const serie = seriesVoucher.filter(
          (series) => parseInt(series.serie_comprobante_id) === parseInt(value)
        );
        setValues({
          ...values,
          correlativo: zfill(parseInt(serie.correlativo), parseInt(7)),
          [name]: parseInt(value),
        });
      }
    }
    if (e.target.type == "number") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: parseFloat(value) });
    }
    if (e.target.type == "date") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    }
  };

  //valida, guarda factura
  function handleSubmit(e) {
    e.preventDefault();
    if (
      props.openings.filter(
        (opening) =>
          parseInt(opening.id_usuario) === parseInt(props.userRole.id) &&
          parseInt(opening.estado) === 0
      ).length === 0
    ) {
      toast.error("Caja no aperturada");
      return;
    }
    if (customer === null) {
      toast.error("Aun no seleccionó un cliente");
      return;
    }
    if (values.serie === null || parseInt(values.serie) === 0) {
      if (props.series.length === 0) {
        toast.error("El usuario no tiene serie asignado");
      } else {
        toast.error("Seleccionar serie");
      }

      return;
    }
    if (values.correlativo.length === 0) {
      toast.error("Cargado correlativo");
      return;
    }
    console.log(customer.tipo_documento_id, values.comprobante);
    if (
      parseInt(customer.tipo_documento_id) === 6 &&
      parseInt(values.comprobante) !== 1
    ) {
      toast.error("El cliente solo puede generar facturas");
      return;
    }
    if (
      parseInt(customer.tipo_documento_id) === 1 &&
      parseInt(values.comprobante) === 1
    ) {
      toast.error("El cliente solo puede generar boletas");
      return;
    }
    if (parseInt(values.forma_pago) === 1) {
      if (
        values.vuelto < 0 ||
        values.efectivo === null ||
        values.efectivo <= 0
      ) {
        toast.error("Ingrese correctamente el efectivo");
        return;
      } else {
        setValues({ ...values, numero_operacion: "" });
      }
    } else {
      if (values.numero_operacion === "") {
        toast.error("Ingrese el numero de la operación");
        return;
      } else {
        let tValues = values;
        tValues.vuelto = null;
        tValues.efectivo = null;
        setValues(tValues);
      }
    }
    if (values.serie === null || parseInt(values.serie) === 0) {
      if (props.series.length === 0) {
        toast.error("El usuario no tiene serie asignado");
      } else {
        toast.error("Seleccionar serie");
      }

      return;
    }
    if (parseInt(values.tipo_pago) === 0) {
      toast.error("seleccione el tipo de pago");
      return;
    }
    if (parseInt(values.forma_pago) === 0) {
      toast.error("seleccione la forma de pago");
      return;
    }
    if (parseInt(values.comprobante) === 0) {
      toast.error("seleccione el comprobante");
      return;
    }
    console.log(values.correlativo);
    var date = new Date();
    const serieC = props.series.filter(
      (serie) => serie.serie_comprobante_id == values.serie
    );
    let facturacion;

    let tipoInput = items[0].id.split("-");

    if (tipoInput[0] == "PF") {
      facturacion = {
        //facturacion_id:0,
        fecha_emision:
          values.fecha_emision +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds(),
        //fecha_anulacion:"",
        //fecha_vencimiento:"",
        persona_id: customer ? customer.persona_id : values.persona_id,
        correlativo: parseInt(values.correlativo),
        tipo_moneda_id: values.moneda,
        tipo_operacion_id: 1,
        tipo_pago_id: values.tipo_pago,
        tipo_forma_pago_id: values.forma_pago,
        comprobante_id: values.comprobante,
        serie_comprobante_id: values.serie,
        //numero_comprobante:serieC[0].serie_comprobante+"-"+values.correlativo,
        numero_comprobante: values.correlativo,
        descuento_global: 0.0,
        tasa_cambio: 0.0,
        gravadas: 0.0,
        valor_venta: props.sTotalP,
        exoneradas: props.sTotalP,
        inafectas: 0.0,
        gratuitas: 0.0,
        totaligv: props.igvP,
        totalisc: 0.0,
        totalotrostributos: 0.0,
        totalventas: props.totalP,
        efectivo: values.efectivo,
        vuelto: values.vuelto,
        numero_operacion: values.numero_operacion,
        //es_concepto:"",
        //concepto:"",
        observacion: values.observacion,
        //fecha_registro:"",
        //Reserva
        reserva_estancia_Id: 0,
        numero_habitacion: "",
        dias_estancia: 0,
        //PC Pedido / Consumo
        pedido_nota_consumo_maestro_id: 0,
        //PF Proforma
        proforma_id: tipoInput[1],
        resumen_diario_id: 0,
        resumen_diario_anulado_id: 0,
        usuario_id: props.userRole.id,
        tipo_venta: 1,
        //estado_cierre:0,
        //estado_credito: 0,
        //estado_venta:0
      };
    }
    if (tipoInput[0] == "PC") {
      facturacion = {
        //facturacion_id:0,
        fecha_emision:
          values.fecha_emision +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds(),
        //fecha_anulacion:"",
        //fecha_vencimiento:"",
        persona_id: customer ? customer.persona_id : values.persona_id,
        correlativo: parseInt(values.correlativo),
        tipo_moneda_id: values.moneda,
        tipo_operacion_id: 1,
        tipo_pago_id: values.tipo_pago,
        tipo_forma_pago_id: values.forma_pago,
        comprobante_id: values.comprobante,
        serie_comprobante_id: values.serie,
        //numero_comprobante:serieC[0].serie_comprobante+"-"+values.correlativo,
        numero_comprobante: values.correlativo,
        descuento_global: 0.0,
        tasa_cambio: 0.0,
        gravadas: 0.0,
        valor_venta: props.sTotalP,
        exoneradas: props.sTotalP,
        inafectas: 0.0,
        gratuitas: 0.0,
        totaligv: props.igvP,
        totalisc: 0.0,
        totalotrostributos: 0.0,
        totalventas: props.totalP,
        efectivo: values.efectivo,
        vuelto: values.vuelto,
        numero_operacion: values.numero_operacion,
        //es_concepto:"",
        //concepto:"",
        observacion: values.observacion,
        //fecha_registro:"",
        //Reserva
        reserva_estancia_Id: tipoInput[4],
        numero_habitacion: "",
        dias_estancia: 0,
        //PC Pedido / Consumo
        pedido_nota_consumo_maestro_id: tipoInput[1],
        //PF Proforma
        proforma_id: 0,
        resumen_diario_id: 0,
        resumen_diario_anulado_id: 0,
        usuario_id: props.userRole.id,
        tipo_venta: 1,
        //estado_cierre:0,
        //estado_credito: 0,
        //estado_venta:0
      };
    }
    if (tipoInput[0] == "RC") {
      facturacion = {
        //facturacion_id:0,
        fecha_emision:
          values.fecha_emision +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds(),
        //fecha_anulacion:"",
        //fecha_vencimiento:"",
        persona_id: customer ? customer.persona_id : values.persona_id,
        correlativo: parseInt(values.correlativo),
        tipo_moneda_id: values.moneda,
        tipo_operacion_id: 1,
        tipo_pago_id: values.tipo_pago,
        tipo_forma_pago_id: values.forma_pago,
        comprobante_id: values.comprobante,
        serie_comprobante_id: values.serie,
        //numero_comprobante:serieC[0].serie_comprobante+"-"+values.correlativo,
        numero_comprobante: values.correlativo,
        descuento_global: 0.0,
        tasa_cambio: 0.0,
        gravadas: 0.0,
        valor_venta: props.sTotalP,
        exoneradas: props.sTotalP,
        inafectas: 0.0,
        gratuitas: 0.0,
        totaligv: props.igvP,
        totalisc: 0.0,
        totalotrostributos: 0.0,
        totalventas: props.totalP,
        efectivo: values.efectivo,
        vuelto: values.vuelto,
        numero_operacion: values.numero_operacion,
        //es_concepto:"",
        //concepto:"",
        observacion: values.observacion,
        //fecha_registro:"",
        //Reserva
        reserva_estancia_Id: tipoInput[1],
        numero_habitacion: "",
        dias_estancia: 0,
        //PC Pedido / Consumo
        pedido_nota_consumo_maestro_id: 0,
        //PF Proforma
        proforma_id: 0,
        resumen_diario_id: 0,
        resumen_diario_anulado_id: 0,
        usuario_id: props.userRole.id,
        tipo_venta: 1,
        //estado_cierre:0,
        //estado_credito: 0,
        //estado_venta:0
      };
    }
    if (tipoInput[0] != "PF" && tipoInput[0] != "PC" && tipoInput[0] != "RC") {
      facturacion = {
        //facturacion_id:0,
        fecha_emision:
          values.fecha_emision +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds(),
        //fecha_anulacion:"",
        //fecha_vencimiento:"",
        persona_id: customer ? customer.persona_id : values.persona_id,
        correlativo: parseInt(values.correlativo),
        tipo_moneda_id: values.moneda,
        tipo_operacion_id: 1,
        tipo_pago_id: values.tipo_pago,
        tipo_forma_pago_id: values.forma_pago,
        comprobante_id: values.comprobante,
        serie_comprobante_id: values.serie,
        //numero_comprobante:serieC[0].serie_comprobante+"-"+values.correlativo,
        numero_comprobante: values.correlativo,
        descuento_global: 0.0,
        tasa_cambio: 0.0,
        gravadas: 0.0,
        valor_venta: props.sTotalP,
        exoneradas: props.sTotalP,
        inafectas: 0.0,
        gratuitas: 0.0,
        totaligv: props.igvP,
        totalisc: 0.0,
        totalotrostributos: 0.0,
        totalventas: props.totalP,
        efectivo: values.efectivo,
        vuelto: values.vuelto,
        numero_operacion: values.numero_operacion,
        //es_concepto:"",
        //concepto:"",
        observacion: values.observacion,
        //fecha_registro:"",
        //Reserva
        reserva_estancia_Id: 0,
        numero_habitacion: "",
        dias_estancia: 0,
        //PC Pedido / Consumo
        pedido_nota_consumo_maestro_id: 0,
        //PF Proforma
        proforma_id: 0,
        resumen_diario_id: 0,
        resumen_diario_anulado_id: 0,
        usuario_id: props.userRole.id,
        tipo_venta: 1,
        //estado_cierre:0,
        //estado_credito: 0,
        //estado_venta:0
      };
    }
    let detalle = [];
    console.log(items);
    items.map((item) => {
      if (
        item.id.split("-").length == 4 ||
        (tipoInput[0] == "PC" && item.id.split("-").length == 5)
      ) {
        let detailBilling;
        if (tipoInput[0] == "PF") {
          detailBilling = {
            //PF Proforma
            //[0]=tipo
            //[1]=id_proforma
            //[2]=id_producto
            //[3]=unidad_medida_id
            //
            //PC Pedido / Consumo
            //[0]=tipo
            //[1]=pedido_nota_consumo_maestro_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            //
            //RC reserva_estancia_Id
            //[0]=tipo
            //[1]=reserva_estancia_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            unidad_medida_id:
              item.id.split("-")[3] == "ZZ" ? 69 : item.id.split("-")[3],
            producto_id: item.id.split("-")[2],
            cantidad: item.cantidad,
            precio_unitario: item.precio_venta,
            detalle: item.detalle,
            descuento: item.descuento,
            tipoprecio: "01",
            tipoimpuesto: 20,
            impuestoselectivo: 0.0,
            otroimpuesto: 0.0,
            sub_total: item.importe,
            proforma_id: tipoInput[1],
          };
        }
        if (tipoInput[0] == "PC") {
          detailBilling = {
            //PF Proforma
            //[0]=tipo
            //[1]=id_proforma
            //[2]=id_producto
            //[3]=unidad_medida_id
            //
            //PC Pedido / Consumo
            //[0]=tipo
            //[1]=pedido_nota_consumo_maestro_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            //
            //RC reserva_estancia_Id
            //[0]=tipo
            //[1]=reserva_estancia_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            unidad_medida_id:
              item.id.split("-")[3] == "ZZ" ? 69 : item.id.split("-")[3],
            producto_id: item.id.split("-")[2],
            cantidad: item.cantidad,
            precio_unitario: item.precio_venta,
            detalle: item.detalle,
            descuento: item.descuento,
            tipoprecio: "01",
            tipoimpuesto: 20,
            impuestoselectivo: 0.0,
            otroimpuesto: 0.0,
            sub_total: item.importe,
            pedido_nota_consumo_maestro_id: tipoInput[1],
          };
        }
        if (tipoInput[0] == "RC") {
          detailBilling = {
            //PF Proforma
            //[0]=tipo
            //[1]=id_proforma
            //[2]=id_producto
            //[3]=unidad_medida_id
            //
            //PC Pedido / Consumo
            //[0]=tipo
            //[1]=pedido_nota_consumo_maestro_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            //
            //RC reserva_estancia_Id
            //[0]=tipo
            //[1]=reserva_estancia_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            unidad_medida_id:
              item.id.split("-")[3] == "ZZ" ? 69 : item.id.split("-")[3],
            producto_id: item.id.split("-")[2],
            cantidad: item.cantidad,
            precio_unitario: item.precio_venta,
            detalle: item.detalle,
            descuento: item.descuento,
            tipoprecio: "01",
            tipoimpuesto: 20,
            impuestoselectivo: 0.0,
            otroimpuesto: 0.0,
            sub_total: item.importe,
            reserva_estancia_id: tipoInput[1],
          };
          if (item.id.split("-")[3] == "ZZ") {
            detailBilling.pago_id = item.id.split("-")[2];
          } else {
            detailBilling.pedido_nota_consumo_maestro_id =
              item.pedido_nota_consumo_maestro_id;
          }
        }
        if (
          tipoInput[0] != "PF" &&
          tipoInput[0] != "PC" &&
          tipoInput[0] != "RC"
        ) {
          detailBilling = {
            //PF Proforma
            //[0]=tipo
            //[1]=id_proforma
            //[2]=id_producto
            //[3]=unidad_medida_id
            //
            //PC Pedido / Consumo
            //[0]=tipo
            //[1]=pedido_nota_consumo_maestro_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            //
            //RC reserva_estancia_Id
            //[0]=tipo
            //[1]=reserva_estancia_id
            //[2]=producto_id
            //[3]=unidad_medida_id
            unidad_medida_id:
              item.id.split("-")[3] == "ZZ" ? 69 : item.id.split("-")[3],
            producto_id: item.id.split("-")[2],
            cantidad: item.cantidad,
            precio_unitario: item.precio_venta,
            detalle: item.detalle,
            descuento: item.descuento,
            tipoprecio: "01",
            tipoimpuesto: 20,
            impuestoselectivo: 0.0,
            otroimpuesto: 0.0,
            sub_total: item.importe,
          };
        }

        detalle.push(detailBilling);
      }
      if (item.id.split("-").length == 2) {
        const detailBilling = {
          unidad_medida_id: item.id.split("-")[1],
          producto_id: item.id.split("-")[0],
          cantidad: item.cantidad,
          precio_unitario: item.precio_venta,
          detalle: item.detalle || "",
          descuento: item.descuento,
          tipoprecio: "01",
          tipoimpuesto: 20,
          impuestoselectivo: 0.0,
          otroimpuesto: 0.0,
          sub_total: item.importe,
        };
        detalle.push(detailBilling);
      }
    });
    const factura = {
      facturacion,
      detalle,
    };
    console.log(JSON.stringify(factura));
    console.log(factura);
    props.saveSales(factura);
    setCustomer(null);
    setValues(initialsStateValues);

    localStorage.removeItem("arraySales");
    props.clearRow();
    props.getAllVouchersSerieComprobante(null);
    props.hideModal();
  }

  const hideModal = () => {
    setValues(initialsStateValues);
    setCustomer(null);
    props.getAllVouchersSerieComprobante(null);
    props.hideModal();
  };
  useEffect(() => {
    if (values.moneda != 1) {
      setValues({
        ...values,
        vuelto: (
          values.efectivo * props.price_dollar.venta -
          props.totalP
        ).toFixed(2),
        cambio: (values.efectivo * props.price_dollar.venta).toFixed(2),
      });
      //setValues({...values});
    } else {
      setValues({
        ...values,
        vuelto: (values.efectivo - props.totalP).toFixed(2),
      });
    }
  }, [values.efectivo]);

  //Inicializa los registros de values
  useEffect(() => {
    if (props.client_save && Object.keys(props.client_save).length != 0) {
      let tCustomer = props.client_save;
      tCustomer.persona_id = tCustomer.id;
      setCustomer(tCustomer);
      let tValues = values;
      tValues.razon_social =
        props.client_save.razon_social_nombre +
        " - " +
        props.client_save.numero_documento;
      tValues.direccion = props.client_save.direccion;
      setValues(tValues);
    }
  }, [props.client_save]);
  useEffect(() => {
    if (values.moneda != 1 && props.price_dollar) {
      setValues({
        ...values,
        vuelto: (
          values.efectivo * props.price_dollar.venta -
          props.totalP
        ).toFixed(2),
        cambio: (values.efectivo * props.price_dollar.venta).toFixed(2),
      });
    } else {
      setValues({
        ...values,
        vuelto: (values.efectivo - props.totalP).toFixed(2),
      });
    }
  }, [values.moneda]);
  useEffect(() => {
    if (values.moneda != 1 && props.price_dollar) {
      setValues({
        ...values,
        vuelto: (values.cambio - props.totalP).toFixed(2),
      });
    }
  }, [values.cambio]);
  return (
    <div>
      <Modal size="lg" show={props.statusModal} onHide={hideModal} centered>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>Registrar cobro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col className="d-flex justify-content-center">
                  <p className="h2 mx-3 text-primary">TOTAL A PAGAR</p>
                  <p className="h2 mx-3 text-success">
                    {parseFloat(props.totalP).toFixed(2)}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs={5}>
                  <label className="form-label">DNI/RUC/OTRO:</label>
                  <InputGroup className="mb-3">
                    <AsyncTypeahead
                      id="customer-typeahead"
                      allowNew={false}
                      isLoading={search_customer_loading}
                      multiple={false}
                      options={search_people}
                      labelKey={(option) =>
                        `${option.razon_social_nombre} - ${option.numero_documento}`
                      }
                      minLength={3}
                      onSearch={handleSearchCustomer}
                      onChange={handleSelectCustomer}
                      placeholder="Buscar cliente"
                      promptText="Ingrese al menos 3 caracteres para realizar la búsqueda"
                      searchText="Realizando la búsqueda, por favor espere un momento"
                      emptyLabel={
                        search_customer_loading
                          ? "Obteniendo datos desde el servidor"
                          : "No se encontraron resultados"
                      }
                      selected={customer == null ? [] : [customer]}
                      renderMenuItemChildren={(option, props) => (
                        <Row bsPrefix={"row h-100"}>
                          <Col bsPrefix={"col-md-2 m-auto text-center"}>
                            <i className="fas fa-user fa-2x"></i>
                          </Col>
                          <Col md={10}>
                            <span key={option.persona_id}>
                              {option.razon_social_nombre}
                            </span>
                            <br />
                            <Badge variant="secondary">
                              {option.numero_documento}
                            </Badge>
                          </Col>
                        </Row>
                      )}
                    />
                    <InputGroup.Append className="input-group-append">
                      <Button
                        onClick={handleChangeShowCustomerForm}
                        className="btn-success"
                      >
                        <i className="fas fa-user"></i>
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
                <Col xs={7}>
                  <label className="form-label">Nombre/ Razon social:</label>
                  <input
                    className="form-control"
                    value={values.razon_social || ""}
                    name="razon_social"
                    onChange={handleInputChange}
                    type="text"
                  />
                </Col>
              </Row>

              <NewCustomerForm
                handleCustomerSaved={handleCustomerSaved}
                handleCloseNewCustomerForm={() =>
                  handleChangeShowCustomerForm()
                }
                show={show_new_customer_form}
              />
              <Row>
                <Col xs={12}>
                  <label className="form-label">Direccion:</label>
                  <input
                    className="form-control"
                    value={values.direccion || ""}
                    type="text"
                    name="direccion"
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={5}>
                  <label className="form-label">Comprobante:</label>

                  <select
                    className="form-select"
                    value={values.comprobante}
                    name="comprobante"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      Seleccionar
                    </option>
                    {props.vouchers_serie_comprobante ? (
                      props.vouchers_serie_comprobante
                        .filter((voucher) => parseInt(voucher.estado) === 1)
                        .map((voucher) => {
                          return (
                            <option
                              value={voucher.comprobante_id}
                              key={voucher.comprobante_id}
                            >
                              {" "}
                              {voucher.descripcion}{" "}
                            </option>
                          );
                        })
                    ) : (
                      <></>
                    )}
                  </select>
                </Col>
                <Col xs={3}>
                  <label className="form-label">Serie:</label>

                  <select
                    className="form-select"
                    value={values.serie}
                    name="serie"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      Seleccionar
                    </option>
                    {
                      /* props.series.filter( serie=> serie.estado===1).map(serie=>{ */
                      seriesVoucher ? (
                        seriesVoucher.map((serie) => {
                          return (
                            <option
                              value={serie.serie_comprobante_id}
                              key={serie.serie_comprobante_id}
                            >
                              {" "}
                              {serie.serie_comprobante}{" "}
                            </option>
                          );
                        })
                      ) : (
                        <></>
                      )
                    }
                  </select>
                </Col>
                <Col xs={4}>
                  <label className="form-label">Numero:</label>
                  <input
                    className="form-control"
                    value={values.correlativo || ""}
                    type="text"
                    name="numero"
                    readOnly
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={4}>
                  <label className="form-label">Tipo de pago:</label>

                  <select
                    className="form-select"
                    value={values.tipo_pago}
                    name="tipo_pago"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      -Seleccione-
                    </option>
                    {props.types_payments ? (
                      props.types_payments
                        .filter((tPayment) => tPayment.estado == 1)
                        .map((tPayment) => {
                          return (
                            <option
                              value={tPayment.tipo_pago_id}
                              key={tPayment.tipo_pago_id}
                            >
                              {" "}
                              {tPayment.tipo_pago}{" "}
                            </option>
                          );
                        })
                    ) : (
                      <></>
                    )}
                  </select>
                </Col>
                <Col xl={4}>
                  <label className="form-label">Forma de pago:</label>

                  <select
                    className="form-select"
                    value={values.forma_pago}
                    name="forma_pago"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      -Seleccione-
                    </option>
                    {props.types_payments_froms ? (
                      props.types_payments_froms
                        .filter((tPaymentFrom) => tPaymentFrom.estado == 1)
                        .map((tPaymentFrom) => {
                          return (
                            <option
                              value={tPaymentFrom.tipo_forma_pago_id}
                              key={tPaymentFrom.tipo_forma_pago_id}
                            >
                              {" "}
                              {tPaymentFrom.tipo_forma_pago}{" "}
                            </option>
                          );
                        })
                    ) : (
                      <></>
                    )}
                  </select>
                </Col>
                <Col xl={4}>
                  <label className="form-label">Fecha de emisión:</label>
                  <input
                    className="form-control"
                    value={values.fecha_emision}
                    type="date"
                    name="fecha_emision"
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={3}>
                  <label className="form-label">Moneda:</label>
                  <select
                    className="form-select"
                    value={values.moneda}
                    name="moneda"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      Seleccionar
                    </option>
                    {props.coins_types ? (
                      props.coins_types
                        .filter((coin_type) => coin_type.estado == 1)
                        .map((coin_type) => {
                          return (
                            <option
                              value={coin_type.tipo_moneda_id}
                              key={coin_type.tipo_moneda_id}
                            >
                              {" "}
                              {coin_type.tipo_moneda}{" "}
                            </option>
                          );
                        })
                    ) : (
                      <></>
                    )}
                  </select>
                </Col>
                {values.forma_pago == 1 ? (
                  <>
                    <Col xl={3}>
                      <label className="form-label">
                        Efectivo{" "}
                        {
                          props.coins_types.filter(
                            (c) => c.tipo_moneda_id == values.moneda
                          )[0].simbolo_monetario
                        }
                        :
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        value={values.efectivo || ""}
                        name="efectivo"
                        onChange={handleInputChange}
                      />
                    </Col>
                    {parseInt(values.moneda) != 1 ? (
                      <Col xl={2}>
                        <label className="form-label">Cambio S/:</label>
                        <input
                          className="form-control"
                          type="number"
                          value={values.cambio || ""}
                          name="cambio"
                          onChange={handleInputChange}
                        />
                      </Col>
                    ) : (
                      <></>
                    )}

                    <Col xl={3}>
                      <label className="form-label">Vuelto:</label>
                      <input
                        className="form-control"
                        type="number"
                        value={values.vuelto || ""}
                        name="vuelto"
                        readOnly
                      />
                    </Col>
                  </>
                ) : (
                  <Col xl={6}>
                    <label className="form-label">Número de referencia:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={values.numero_operacion || ""}
                      name="numero_operacion"
                      onChange={handleInputChange}
                    />
                  </Col>
                )}

                <Col
                  xl={values.moneda == 1 ? 3 : 1}
                  className="d-flex align-items-end justify-content-end"
                >
                  <Button
                    variant="success"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Cobrar
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col xl={12}>
                  <label className="form-label">Observación:</label>
                  <input
                    className="form-control"
                    value={values.observacion}
                    name="observacion"
                    onChange={handleInputChange}
                    type="text"
                  />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          {/* <Modal.Footer>
                        <Col xl={12} className="d-flex justify-content-around">
                                    <Button variant="success" type="submit">Grabar</Button>
                                    <Button variant="danger" onClick={props.hideModal}>Cancelar</Button>
                        </Col>
                    </Modal.Footer> */}
        </form>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    client_save: state.app.clientsProviders.client_save,
    vouchers: state.app.voucher.vouchers,
    vouchers_serie_comprobante: state.app.voucher.vouchers_serie_comprobante,
    userRole: state.auth.user[0],
    series: state.app.sales.series,
    types_payments: state.app.sales.types_payments,
    correlativo: state.app.sales.correlativo,
    types_payments_froms: state.app.sales.types_payments_froms,
    coins_types: state.app.sales.coins_types,
    openings: state.app.manageCash.openings,
    clients_providers: state.app.clientsProviders.clients_providers,
    price_dollar: state.app.sales.price_dollar,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllVouchers: () => dispatch(Actions.getAllVouchers()),
    getAllVouchersSerieComprobante: (form) =>
      dispatch(Actions.getAllVouchersSerieComprobante(form)),
    saveSales: (form) => dispatch(Actions.saveSales(form)),
    getAllSeriesVoucher: (form) => dispatch(Actions.getAllSeriesVoucher(form)),
    getCorrelativeSeriesVoucher: (form) =>
      dispatch(Actions.getCorrelativeSeriesVoucher(form)),
    getAllCoinType: () => dispatch(Actions.getAllCoinType()),
    getAllTypesPayments: () => dispatch(Actions.getAllTypesPayments()),
    getAllTypesPaymentsFroms: (idTypePayment) =>
      dispatch(Actions.getAllTypesPaymentsFroms(idTypePayment)),
    clienteSaveReset: () => dispatch(Actions.clienteSaveReset()),
    getAllClientsProviders: (form) =>
      dispatch(Actions.getAllClientsProviders(form)),
    getPriceDollar: () => dispatch(Actions.getPriceDollar()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(PaymentModal));
