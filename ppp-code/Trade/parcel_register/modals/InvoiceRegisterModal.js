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
import { DataGrid, esES } from "@material-ui/data-grid";

import Select from "react-select";
import * as Actions from "store/actions/app";
import NewCustomerForm from "../../grid/form/new_custtomer.form";
import { generateRandomString, getNowDate } from "../helper/Helpers";

const InvoiceRegisterModal = (props) => {
  const initialsStateValues = {
    razon_social: null,
    direccion: null,
    comprobante: null,
    serie: null,
    correlativo: null,
    tipo_pago: null,
    forma_pago: null,
    fecha_emision: getNowDate(),
    moneda: 1,
    numero_operacion: null,
    vuelto: null,
    cambio: null,
    numero_operacion: null,
    observacion: null,
    efectivo: null,
  };
  const initialsStateParcel = {
    id_encomienda: null,
    serie_comprobante_id: null,
    correlativo: null,
    idtransportista: null,
    idremitente: null,
    idconsignado: null,
    direccion: null,
    condicion: null,
    entrega: null,
    fecharegistro: null,
    idusuario: props.userId,
    observacion: null,
    id_sucursal_inicio: props.user.sucursal_id,
    id_sucursal_fin: null,
    clave: null,
    codigo: generateRandomString(4),
    subtotal: 0,
  };
  const dispatch = useDispatch();
  const [values, setValues] = useState(initialsStateValues);
  const [parcel, setParcel] = useState(initialsStateParcel);
  const [dataArray, setDataArray] = useState([]);
  const [show_new_customer_form, setShow_new_customer_form] = useState(false);
  const [customer, setCustomer] = useState(null);
  const search_customer_loading = useSelector(
    (gridApp) => gridApp.app.grid.search_customer_loading
  );

  const search_people = useSelector(
    (gridApp) => gridApp.app.grid.search_people
  );
  useEffect(() => {
    console.log("StartInvoice");
    props.getAllVouchers();
    if (props.driverSelect) {
      setParcel(props.driverSelect);
    } else {
      setParcel(initialsStateParcel);
    }
  }, []);
  useEffect(() => {
    if (props.list_parcel_register_detail && props.driverSelect) {
      setDataArray(
        props.list_parcel_register_detail.detalle.map((row, index) => {
          row.id = index;
          return row;
        })
      );
    }
  }, [props.list_parcel_register_detail]);

  const columns = [
    { field: "id", hide: true, identify: true },
    {
      field: "descripcion",
      headerName: "Descripcion",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "idunidadmedida",
      headerName: "Unidad medida",
      headerAlign: "center",
      flex: 1,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        if (props.unitmeasures) {
          const brands = props.unitmeasures.filter(
            (brand) =>
              brand.unidad_medida_id == parseInt(params.row.unidad_medida_id)
          );
          if (brands[0] !== undefined) {
            const brand = brands[0];
            return brand.unidad_medida;
          } else {
            return params.row.unidad_medida_id;
          }
        }
        return "";
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      headerAlign: "center",
      type: "number",
      width: 95,
    },
    {
      field: "precio",
      headerName: "Precio",
      headerAlign: "center",
      type: "number",
      width: 110,
    },
  ];
  //Buscar / Registrar cliente
  const handleSearchCustomer = (query) => {
    dispatch(Actions.searchCustomerLoading(true));
    dispatch(Actions.searchPerson(query.toLowerCase()));
  };
  const handleSelectCustomer = (selected) => {
    if (selected.length > 0) {
      setCustomer(selected[0]);
      console.log(selected[0]);
      const voucherByUsers = selected[0].tipo_documento_id
        ? selected[0].tipo_documento_id == 1
          ? 2
          : 1
        : 2;
      //asignar cliente
      setValues({
        ...values,
        razon_social: selected[0].razon_social_nombre,
        direccion: selected[0].direccion,
        comprobante: voucherByUsers,
      });
    } else {
      setCustomer(null);
    }
  };
  const handleChangeShowCustomerForm = () => {
    setShow_new_customer_form(!show_new_customer_form);
  };

  const handleCustomerSaved = (saved) => {
    console.log(saved);
    setCustomer(saved);
  };
  //

  useEffect(() => {
    console.log(props.unitmeasureproduct);
    /* if (props.unitmeasureproduct == null) {
      toast.warning("Obteniendo info");
      return;
    }
    if (props.unitmeasureproduct.length == 0) {
      toast.error("El servicion de encomienda no tiene asignado una medida");
      setValues(initialsStateValues);
      setDataArray([]);
      props.hideModal();
    } */
  }, [props.unitmeasureproduct]);
  //Comprobante Serie Numero
  useEffect(() => {
    if (props.vouchers) {
      if (props.vouchers.length > 0) {
        setValues({
          ...values,
          comprobante: props.vouchers[1].comprobante_id,
          /* razon_social:
            props.driverSelect.condicion == "PAGADO"
              ? props.driverSelect.remitente_nombre
              : props.driverSelect.consignado_nombre, */
        });
        const form = {
          idUser: props.user.id,
          idVoucher: props.vouchers[1].comprobante_id,
        };
        props.getAllSeriesVoucher(form);
      }
    }
  }, [props.vouchers]);
  useEffect(() => {
    if (props.series.length > 0 && values.comprobante) {
      setValues({
        ...values,
        serie: props.series.filter(
          (serie) => serie.comprobante_id == values.comprobante
        )[0].serie_comprobante_id,
        correlativo: props.leftZero(
          parseInt(
            props.series.filter(
              (serie) => serie.comprobante_id == values.comprobante
            )[0].correlativo
          ) + 1,
          7
        ),
      });
      props.getAllTypesPayments();

      props.getPriceDollar();
      props.getAllCoinType();
    }
  }, [props.series, values.comprobante]);
  //
  //Tipo pago Forma pago Fecha emisión
  useEffect(() => {
    if (props.types_payments.length !== 0 && values.serie) {
      props.getAllTypesPaymentsFroms(props.types_payments[0].tipo_pago_id);
      setValues({ ...values, tipo_pago: props.types_payments[0].tipo_pago_id });
    }
  }, [props.types_payments, props.series]);

  useEffect(() => {
    if (props.types_payments_froms.length !== 0) {
      setValues({
        ...values,
        forma_pago: props.types_payments_froms[0].tipo_forma_pago_id,
      });
    }
  }, [props.types_payments_froms, values.serie]);
  //
  //Moneda Efectivo Cambio
  //se inicializa el tipo de moneda
  useEffect(() => {
    if (!values.serie) return;
    if (values.moneda != 1) {
      setValues({
        ...values,
        vuelto: (
          values.efectivo * props.price_dollar.venta - parcel.subtotal || 0
        ).toFixed(2),
        cambio: (values.efectivo * props.price_dollar.venta).toFixed(2),
      });
      //setValues({...values});
    } else {
      setValues({
        ...values,
        vuelto: (values.efectivo - parcel.subtotal).toFixed(2),
      });
    }
  }, [values.efectivo, values.serie]);
  useEffect(() => {
    if (props.coins_types.length > 0 && values.serie) {
      setValues({ ...values, moneda: props.coins_types[0].tipo_moneda_id });
    }
  }, [props.coins_types, values.serie]);
  useEffect(() => {
    if (!values.serie) return;
    if (values.moneda != 1 && props.price_dollar) {
      console.log(
        "vuelto",
        (values.efectivo * props.price_dollar.venta - parcel.subtotal).toFixed(
          2
        )
      );
      setValues({
        ...values,
        vuelto: (
          values.efectivo * props.price_dollar.venta -
          parcel.subtotal
        ).toFixed(2),
        cambio: (values.efectivo * props.price_dollar.venta).toFixed(2),
      });
    } else {
      setValues({
        ...values,
        vuelto: (values.efectivo - parcel.subtotal).toFixed(2),
      });
    }
  }, [values.moneda, values.serie]);
  useEffect(() => {
    if (!values.serie) return;
    if (values.moneda != 1) {
      console.log(
        "vuelto",
        (values.efectivo * props.price_dollar.venta - parcel.subtotal).toFixed(
          2
        )
      );
      setValues({
        ...values,
        vuelto: (
          values.efectivo * props.price_dollar.venta -
          parcel.subtotal
        ).toFixed(2),
        cambio: (values.efectivo * props.price_dollar.venta).toFixed(2),
      });
      //setValues({...values});
    } else {
      setValues({
        ...values,
        vuelto: (values.efectivo - parcel.subtotal).toFixed(2),
      });
    }
  }, [values.efectivo, values.serie]);
  useEffect(() => {
    if (values.moneda != 1 && props.price_dollar && values.serie) {
      setValues({
        ...values,
        vuelto: (values.cambio - parcel.subtotal).toFixed(2),
      });
    }
  }, [values.cambio, values.serie]);
  //
  const handleInputChange = (e) => {
    //console.log(e.target.type);

    if (e.target.type === "checkbox") {
      var { name, checked } = e.target;
      checked = checked === true ? 1 : 0;
      setValues({ ...values, [name]: checked });
    }
    if (e.target.type === "text") {
      //console.log(e.target.type);
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    }
    if (e.target.type === "select-one") {
      const { name, value } = e.target;

      if (name === "tipo_pago") {
        props.getAllTypesPaymentsFroms(parseInt(value));
      }
      if (name === "comprobante") {
        const form = {
          idUser: props.user.id,
          idVoucher: parseInt(value),
        };
        //console.log(form);
        props.getAllSeriesVoucher(form);
      }
      if (name === "serie") {
        setValues({
          ...values,
          serie: parseInt(value),
          correlativo: props.leftZero(
            props.series.filter(
              (serie) => serie.serie_comprobante_id == value
            )[0].correlativo + 1,
            7
          ),
        });
        return;
        //props.getCorrelativeSeriesVoucher(form);
      }
      setValues({ ...values, [name]: parseInt(value) });
    }
    if (e.target.type === "number") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: parseFloat(value) });
    }
    if (e.target.type === "date") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    }
  };

  const focusForm = (idForm) => {
    const x = document.getElementById(idForm);
    x.focus();
  };

  const sumSubTotalData = () => {
    let subTotal = 0;
    dataArray.map((p) => {
      subTotal += parseFloat(p.subtotal);
    });
    return subTotal;
  };
  function validateForm() {
    /* if (!values.serie_comprobante_id || values.serie_comprobante_id == "") {
      toast.error("Seleccione la serie");
      focusForm("serie_comprobante_id");
      return true;
    } */
    if (
      props.openings.filter(
        (opening) => opening.id_usuario == props.user.id && opening.estado == 0
      ).length === 0
    ) {
      toast.error("Caja no aperturada");
      return true;
    }
    if (customer === null) {
      /* const rz =
        props.driverSelect.condicion == "PAGADO"
          ? props.driverSelect.remitente_nombre
          : props.driverSelect.consignado_nombre;
      if (rz != values.razon_social) { */
      toast.error("Aun no seleccionó un cliente");
      return true;
      /*  } */
    }
    if (values.serie === null || values.serie == 0) {
      if (props.series.length === 0) {
        toast.error("El usuario no tiene serie asignado");
        return true;
      } else {
        toast.error("Seleccionar serie");
        focusForm("serie");
        return true;
      }

      return;
    }
    if (customer.tipo_documento_id == 6 && values.comprobante != 1) {
      toast.error("El cliente solo puede generar facturas");
      focusForm("comprobante");
      return true;
    }
    if (customer.tipo_documento_id == 1 && values.comprobante == 1) {
      toast.error("El cliente solo puede generar boletas");
      focusForm("comprobante");
      return true;
    }
    console.log(values);
    if (values.forma_pago === 1) {
      if (
        values.vuelto < 0 ||
        values.efectivo === null ||
        values.efectivo <= 0 ||
        values.vuelto == null
      ) {
        toast.error("Ingrese correctamente el efectivo");
        focusForm("efectivo");
        return true;
      } else {
        setValues({ ...values, numero_operacion: "" });
      }
    } else {
      if (values.numero_operacion === "") {
        toast.error("Ingrese el numero de la operación");
        focusForm("numero_operacion");
        return true;
      } else {
        let tValues = values;
        tValues.vuelto = null;
        tValues.efectivo = null;
        setValues(tValues);
      }
    }
    return false;
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) return;

    var date = new Date();
    const facturacion = {
      id_encomienda: parcel.id_encomienda,
      fecha_emision:
        values.fecha_emision +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds(),
      persona_id: customer
        ? customer.persona_id
        : values.condicion == "PAGADO"
        ? parcel.idremitente
        : parcel.idconsignado, //cliente
      correlativo: parseInt(values.correlativo),
      tipo_moneda_id: values.moneda,
      tipo_operacion_id: 1,
      tipo_pago_id: values.tipo_pago,
      tipo_forma_pago_id: values.forma_pago,
      comprobante_id: values.comprobante,
      serie_comprobante_id: values.serie,
      numero_comprobante: values.correlativo,
      descuento_global: 0.0,
      tasa_cambio: 0.0,
      gravadas: 0.0,
      valor_venta: parcel.subtotal,
      exoneradas: parcel.subtotal,
      inafectas: 0.0,
      gratuitas: 0.0,
      totaligv: 0.0,
      totalisc: 0.0,
      totalotrostributos: 0.0,
      totalventas: parcel.subtotal,
      efectivo: values.efectivo,
      vuelto: values.vuelto,
      numero_operacion: values.numero_operacion,
      observacion: values.observacion,
      reserva_estancia_Id: 0,
      numero_habitacion: "",
      dias_estancia: 0,
      pedido_nota_consumo_maestro_id: 0,
      proforma_id: 0,
      resumen_diario_id: 0,
      resumen_diario_anulado_id: 0,
      usuario_id: props.user.id,
      tipo_venta: 1,
    };
    let detalle = [];
    dataArray.map((item) => {
      const detailBilling = {
        unidad_medida_id: props.unitmeasureproduct[0].unidad_medida_id,
        producto_id: 2,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        descuento: 0.0,
        tipoprecio: "01",
        tipoimpuesto: 20,
        impuestoselectivo: 0.0,
        otroimpuesto: 0.0,
        sub_total: item.subtotal,
        id_encomienda_detalle: item.id_encomienda_detalle,
      };
      detalle.push(detailBilling);
    });
    const factura = {
      facturacion,
      detalle,
    };
    console.log(JSON.stringify(factura));
    console.log(values);
    props.saveSalesParcel(factura);

    setValues(initialsStateValues);
    setDataArray([]);
    props.hideModal();
  }
  return (
    <div>
      <Modal
        size="lg"
        show={props.statusModal}
        onHide={props.hideModal}
        centered
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              Facturar encomienda
              {parcel.id_encomienda
                ? " / Guía " + props.leftZero(parcel.id_encomienda, 7)
                : ""}
              {parcel.codigo ? " / Codigo " + parcel.codigo : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col className="d-flex justify-content-center">
                  <p className="h2 mx-3 text-primary">TOTAL A PAGAR</p>
                  <p className="h2 mx-3 text-success">
                    {parseFloat(parcel.subtotal).toFixed(2)}
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
                      selected={customer === null ? [] : [customer]}
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
                    id="razon_social"
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
                    id="direccion"
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={5}>
                  <label className="form-label">Comprobante:</label>

                  <select
                    className="form-select"
                    value={values.comprobante || 0}
                    name="comprobante"
                    id="comprobante"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      Seleccionar
                    </option>
                    {props.vouchers ? (
                      props.vouchers
                        .filter((voucher) => voucher.estado == 1)
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
                    value={values.serie || 0}
                    name="serie"
                    id="serie"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      Seleccionar
                    </option>
                    {
                      /* props.series.filter( serie=> serie.estado===1).map(serie=>{ */
                      props.series ? (
                        props.series
                          .filter(
                            (serie) =>
                              serie.comprobante_id == values.comprobante
                          )
                          .map((serie) => {
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
                    name="correlativo"
                    id="correlativo"
                    readOnly
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={4}>
                  <label className="form-label">Tipo de pago:</label>

                  <select
                    className="form-select"
                    value={values.tipo_pago || 0}
                    name="tipo_pago"
                    id="tipo_pago"
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
                    value={values.forma_pago || 0}
                    name="forma_pago"
                    id="forma_pago"
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
                    id="fecha_emision"
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
                    id="moneda"
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
                        {props.coins_types
                          ? props.coins_types.filter(
                              (c) => c.tipo_moneda_id == 1
                            )[0].simbolo_monetario
                          : "S/"}
                        :
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        value={values.efectivo || ""}
                        name="efectivo"
                        id="efectivo"
                        onChange={handleInputChange}
                      />
                    </Col>
                    {values.moneda != 1 ? (
                      <Col xl={2}>
                        <label className="form-label">Cambio S/:</label>
                        <input
                          className="form-control"
                          type="number"
                          value={values.cambio || ""}
                          name="cambio"
                          id="cambio"
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
                        id="vuelto"
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
                      id="numero_operacion"
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
                    id="observacion"
                    onChange={handleInputChange}
                    type="text"
                  />
                </Col>
              </Row>
              <Col className="border border-dark mt-3">
                <div style={{ height: 335, width: "100%" }} className="mt-2">
                  <DataGrid
                    onRowClick={({ row }) => {
                      console.log(row);
                    }}
                    localeText={esES.props.MuiDataGrid.localeText}
                    hideFooter={true}
                    hideFooterSelectedRowCount={true}
                    rows={dataArray}
                    columns={columns}
                    rowHeight={45}
                    disableColumnMenu={true}
                  />
                </div>
              </Col>
              <Row>
                <Col sm={3}>
                  <label className="form-label">Destino:</label>
                  <input
                    className="form-control"
                    value={
                      parcel.sucursalinicio
                        ? parcel.sucursalinicio + " - " + parcel.sucursalfin
                        : ""
                    }
                    type="text"
                    disabled={true}
                  />
                </Col>
                <Col sm={6}>
                  <label className="form-label">Conductor:</label>
                  <input
                    className="form-control"
                    value={parcel.nombretransportista || ""}
                    type="text"
                    disabled={true}
                  />
                </Col>
                <Col sm={3}>
                  <label className="form-label">Placa:</label>
                  <input
                    className="form-control"
                    value={parcel.idvehiculo || ""}
                    type="text"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row>
                <label className="form-label">Remitente:</label>
              </Row>
              <Row>
                <Col sm={3}>
                  <input
                    className="form-control"
                    value={parcel.remitente_documento || "---"}
                    type="text"
                    disabled={true}
                  />
                </Col>
                <Col sm={9}>
                  <input
                    className="form-control"
                    value={parcel.remitente_nombre || ""}
                    type="text"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row>
                <label className="form-label">Consignado a:</label>
              </Row>
              <Row>
                <Col sm={3}>
                  <input
                    className="form-control"
                    value={parcel.consignado_documento || "---"}
                    type="text"
                    disabled={true}
                  />
                </Col>
                <Col sm={9}>
                  <input
                    className="form-control"
                    value={parcel.consignado_nombre || ""}
                    type="text"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <label className="form-label">Direccion:</label>
                  <input
                    className="form-control"
                    value={parcel.direccion || ""}
                    type="text"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={10}>
                  <Row>
                    <Col sm={6}>
                      <label className="form-label">Condición:</label>
                      <input
                        className="form-control"
                        value={parcel.condicion || ""}
                        type="text"
                        disabled={true}
                      />
                    </Col>
                    <Col sm={6}>
                      <label className="form-label">Entrega a:</label>
                      <input
                        className="form-control"
                        value={parcel.entrega || ""}
                        type="text"
                        disabled={true}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <label className="form-label">Observación:</label>
                      <input
                        className="form-control"
                        value={parcel.observacion || ""}
                        name="observacion"
                        id="observacion"
                        onChange={handleInputChange}
                        type="text"
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col sm={2} className="d-flex row justify-content-between">
                  <Col sm={12}>
                    <Col sm={12}>
                      <label className="form-label">Total:</label>
                      <input
                        className="form-control"
                        value={sumSubTotalData().toFixed(2)}
                        disabled={true}
                        type="text"
                      />
                    </Col>
                  </Col>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </form>
      </Modal>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.auth.user[0],
    userId: state.auth.user[0].id,
    list_parcel_register_detail:
      state.app.parcelRegister.list_parcel_register_detail,
    series: state.app.series.series,
    vouchers: state.app.voucher.vouchers,
    types_payments: state.app.sales.types_payments,
    types_payments_froms: state.app.sales.types_payments_froms,
    coins_types: state.app.sales.coins_types,
    price_dollar: state.app.sales.price_dollar,
    openings: state.app.manageCash.openings,
    unitmeasureproduct: state.app.products.unitmeasureproduct,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getSearchSelectGrid: (id) => dispatch(Actions.getSearchSelectGrid(id)),
    getAllVouchers: () => dispatch(Actions.getAllVouchers()),
    saveSales: (form) => dispatch(Actions.saveSales(form)),
    getAllSeriesVoucher: (form) => dispatch(Actions.getAllSeriesVoucher(form)),
    getAllTypesPayments: () => dispatch(Actions.getAllTypesPayments()),
    getAllTypesPaymentsFroms: (idTypePayment) =>
      dispatch(Actions.getAllTypesPaymentsFroms(idTypePayment)),
    getAllCoinType: () => dispatch(Actions.getAllCoinType()),
    getPriceDollar: () => dispatch(Actions.getPriceDollar()),
    saveSalesParcel: (form) => dispatch(Actions.saveSalesParcel(form)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(InvoiceRegisterModal));
