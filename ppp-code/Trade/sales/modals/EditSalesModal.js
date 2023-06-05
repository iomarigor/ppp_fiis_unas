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
import { DataGrid, esES } from "@material-ui/data-grid";
import withDragDropContext from "../helper/withDnDContext";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import Select from "react-select";
import * as Actions from "store/actions/app";
import NewCustomerForm from "../../grid/form/new_custtomer.form";

const EditSalesModal = (props) => {
  useEffect(() => {
    if (
      producto.producto_id != null &&
      props.unitMeasureModal == false &&
      props.statusModal == true &&
      props.tabKey == "salesList" &&
      props.unitMeasureSelect == null
    ) {
      /* console.log("Reset product") */
      setProducto(initialsStateProduct);
    }
  }, [props.unitMeasureModal, props.statusModal]);
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState(null);
  const [show_new_customer_form, setShow_new_customer_form] = useState(false);

  const initialsStateValues = {
    doc_identidad: null,
    razon_social: null,
    direccion: null,
    comprobante: 0,
    serie: 0,
    numero: null,
    tipo_pago: 0,
    forma_pago: 0,
    fecha_emision: "",
    correlativo: "",
    moneda: 1,
    cambio: 0,
    efectivo: null,
    vuelto: null,
    numero_operacion: "",
    observacion: "",
    //
  };
  const initialsStateProduct = {
    producto_id: null,
    denominacion: null,
    denominacion_corta: "",
    tipo_producto: 0,
    stock_minimo: 0,
    existencia: 0,
    codigo_barra: null,
    codigo_fabricante: null,
    codigo_producto: null,
    descripcion: null,
    precio_compra: 0,
    utilidad: 0,
    precio_venta: 0,
    contabilizar: 0,
    inventariar: 0,
    clase_id: 0,
    sub_clase_id: 0,
    marca_id: 0,
    material_id: 0,
    presentacion_id: 0,
    unidad_medida_id: 0,
    tipo_existencia_id: 0,
    estado: 0,
  };
  const [values, setValues] = useState(initialsStateValues);
  const [seriesVoucher, setSeriesVoucher] = useState([]);
  const [producto, setProducto] = useState(initialsStateProduct);
  const search_customer_loading = useSelector(
    (gridApp) => gridApp.app.grid.search_customer_loading
  );
  const search_people = useSelector(
    (gridApp) => gridApp.app.grid.search_people
  );
  useEffect(() => {
    console.log(search_people);
    if (search_people && Object.keys(props.client_save).length !== 0) {
      setCustomer(search_people[0]);
      let tValues = values;
      tValues.razon_social =
        search_people[0].razon_social_nombre +
          " - " +
          search_people[0].numero_documento || "";
      tValues.direccion = search_people[0].direccion || "";
      if (parseInt(search_people[0].tipo_documento_id) === 6) {
        const comprobante = props.vouchers_serie_comprobante.filter(
          (voucher) => parseInt(voucher.comprobante_id) === 1
        );
        if (comprobante.length === 0) {
          toast.error("El ususario no tiene una serie de facturas asignada");
          return;
        }
        let tFactura = props.sales_info.factura[0];
        tValues.comprobante = comprobante[0].comprobante_id;

        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);

        if (
          parseInt(tFactura.comprobante_id) ===
            parseInt(comprobante[0].comprobante_id) &&
          parseInt(tFactura.serie_comprobante_id) ===
            parseInt(comprobante[0].series[0].serie_comprobante_id)
        ) {
          tValues.correlativo = zfill(parseInt(tFactura.numero_comprobante), 7);
        } else {
          tValues.correlativo = zfill(
            parseInt(comprobante[0].series[0].correlativo),
            7
          );
        }
        setSeriesVoucher(comprobante[0].series);
      } else {
        const comprobante = props.vouchers_serie_comprobante.filter(
          (voucher) => parseInt(voucher.comprobante_id) === 2
        );
        if (comprobante.length === 0) {
          toast.error("El ususario no tiene una serie de boletas asignada");
          return;
        }
        let tFactura = props.sales_info.factura[0];
        tValues.comprobante = comprobante[0].comprobante_id;

        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);

        if (
          parseInt(tFactura.comprobante_id) ===
            parseInt(comprobante[0].comprobante_id) &&
          parseInt(tFactura.serie_comprobante_id) ===
            parseInt(comprobante[0].series[0].serie_comprobante_id)
        ) {
          tValues.correlativo = zfill(parseInt(tFactura.numero_comprobante), 7);
        } else {
          tValues.correlativo = zfill(
            parseInt(comprobante[0].series[0].correlativo),
            7
          );
        }
        setSeriesVoucher(comprobante[0].series);
      }
      setValues(tValues);
      props.clienteSaveReset();
      dispatch(Actions.searchPerson(null));
    }
  }, [search_people]);
  useEffect(() => {
    //console.log(props.client_save);
    if (Object.keys(props.client_save).length !== 0) {
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
    dispatch(Actions.searchPerson(query));
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
        let tFactura = props.sales_info.factura[0];
        tValues.comprobante = comprobante[0].comprobante_id;

        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);

        if (
          parseInt(tFactura.comprobante_id) ===
            parseInt(comprobante[0].comprobante_id) &&
          parseInt(tFactura.serie_comprobante_id) ===
            parseInt(comprobante[0].series[0].serie_comprobante_id)
        ) {
          tValues.correlativo = zfill(parseInt(tFactura.numero_comprobante), 7);
        } else {
          tValues.correlativo = zfill(
            parseInt(comprobante[0].series[0].correlativo),
            7
          );
        }

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

        let tFactura = props.sales_info.factura[0];
        tValues.comprobante = comprobante[0].comprobante_id;

        tValues.serie = parseInt(comprobante[0].series[0].serie_comprobante_id);

        if (
          parseInt(tFactura.comprobante_id) ===
            parseInt(comprobante[0].comprobante_id) &&
          parseInt(tFactura.serie_comprobante_id) ===
            parseInt(comprobante[0].series[0].serie_comprobante_id)
        ) {
          tValues.correlativo = zfill(parseInt(tFactura.numero_comprobante), 7);
        } else {
          tValues.correlativo = zfill(
            parseInt(comprobante[0].series[0].correlativo),
            7
          );
        }
        setSeriesVoucher(comprobante[0].series);
      }
      setValues(tValues);
    } else {
      setCustomer(null);
      //console.log("");

      //setCustomer_phone("");
    }
  };
  const handleChangeShowCustomerForm = () => {
    setShow_new_customer_form(!show_new_customer_form);
  };
  const handleCustomerSaved = (saved) => {
    setCustomer(saved);
  };

  const [rows, setRows] = useState([]);

  //se inicializan las columnas de datagrid
  const columns = [
    {
      field: "",
      headerName: "Acciones",
      headerAlign: "center",
      width: 110,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        //Elimina producto
        const onClickDelete = () => {
          const thisRow = params.row;
          deleteproductRow(thisRow);
        };
        return (
          <>
            <Button onClick={onClickDelete} variant="danger">
              <i className="fas fa-trash-alt"></i>
            </Button>
          </>
        );
      },
    },
    { field: "id", hide: true, identify: true },
    {
      field: "index",
      headerName: "#",
      headerAlign: "center",
      width: 60,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        return rows.indexOf(params.row) + 1;
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
      field: "unidad_medida_id",
      headerName: "UM",
      headerAlign: "center",
      width: 80,
      disableClickEventBuddling: true,
      renderCell: (params) => {
        //capturo la marca del producto
        const brands = props.unitmeasures.filter(
          (brand) =>
            parseInt(brand.unidad_medida_id) ===
            parseInt(params.row.unidad_medida_id)
        );
        if (brands[0] !== undefined) {
          const brand = brands[0];
          return brand.abreviatura;
        } else {
          return params.row.abreviatura;
        }
      },
    },
    {
      field: "denominacion",
      headerName: "Descripción",
      headerAlign: "center",
      width: 180,
      disableClickEventBuddling: true,
      renderCell: ({ row }) => {
        if (row.detalle && row.detalle.length > 0) {
          return row.denominacion + " - " + row.detalle;
        } else {
          return row.denominacion;
        }
      },
      flex: 1,
    },
    {
      field: "precio_venta",
      headerName: "Precio",
      headerAlign: "center",
      type: "number",
      width: 80,
    },
    {
      field: "descuento",
      headerName: "Descuento",
      headerAlign: "center",
      type: "number",
      width: 110,
    },
    {
      field: "importe",
      headerName: "Importe",
      headerAlign: "center",
      type: "number",
      width: 90,
    },
  ];
  const [igvP, setIgvP] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [subTotalP, setSubTotalP] = useState(0);
  const [FProducts, setFProducts] = useState(false);
  const [cantidad, setCantidad] = useState(0);

  //se consultan los registros
  useEffect(() => {
    if (props.statusModal && props.tabKey === "salesList") {
      //props.getAllVouchers();
      props.getAllVouchersSerieComprobante(props.userRole);
      props.getAllTypesPayments();
      props.getAllCoinType();
    }
  }, [props.statusModal]);

  //se asigna el serie_id
  /* useEffect(() => {
    if (props.statusModal && props.tabKey === "salesList") {
      if (props.series.length !== 0) {
        const form = {
          idUser: props.userRole.id,
          idVoucher: values.comprobante,
          idSerie: props.series[0].serie_comprobante_id,
        };
        setValues({ ...values, serie: props.series[0].serie_comprobante_id });
        props.getCorrelativeSeriesVoucher(form);
      }
    }
  }, [props.series]); */

  //se asigna el serie voucher
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
      });
      setSeriesVoucher(props.vouchers_serie_comprobante[0].series);
    }
  }, [props.vouchers_serie_comprobante]);
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
  // se consultan los tipos de pago
  useEffect(() => {
    if (props.types_payments.length !== 0 && props.tabKey === "salesList") {
      props.getAllTypesPaymentsFroms(values.tipo_pago);
    }
  }, [props.types_payments]);

  //se consultan los registros
  useEffect(() => {
    if (props.tabKey === "salesList") {
      props.getAllUnitMeasures();
      props.getAllProducts();
      props.getDataBranchOptions(props.userRole.sucursal_id);
    }
  }, []);
  useEffect(() => {
    if (
      props.sales_info.detalle !== undefined &&
      props.tabKey === "salesList"
    ) {
      let tRows = props.sales_info.detalle.map((p) => {
        p.id =
          p.producto_id +
          "-" +
          p.unidad_medida_id +
          "-" +
          p.facturacion_detalle_id;
        p.precio_venta = p.precio_unitario;
        /* p.unidad_medida_id= p.tipoprecio; */
        p.importe = p.sub_total;
        return p;
      });
      let tFactura = props.sales_info.factura[0];
      tFactura.fecha_emision = tFactura.fecha_emision.split(" ")[0];
      tFactura.moneda = tFactura.tipo_moneda_id;
      tFactura.tipo_pago = tFactura.tipo_pago_id;
      tFactura.forma_pago = parseInt(tFactura.tipo_forma_pago_id);
      tFactura.comprobante = tFactura.comprobante_id;
      tFactura.serie = tFactura.serie_comprobante_id;
      tFactura.razon_social = tFactura.razon_social_nombre;
      tFactura.direccion = tFactura.direccion;
      tFactura.correlativo = tFactura.numero_comprobante;

      if (tFactura.modeda != 1) {
        tFactura.cambio = (
          parseFloat(tFactura.efectivo) * parseFloat(props.price_dollar.venta)
        ).toFixed(2);
      }
      setValues(tFactura);
      cSubTotalP(tRows); /* 
            console.log("rows");
            console.log(tFactura); */
      setRows(tRows);
    }
  }, [props.sales_info]);
  const deleteproductRow = (product) => {
    setRows(
      rows.filter((row) => {
        return row !== product;
      })
    );
    cSubTotalP(
      rows.filter((row) => {
        return row !== product;
      })
    );
  };
  const sTotalInputChange = (e) => {
    let { name, value } = e.target;
    value = parseFloat(value);
    setSubTotal(value);
  };
  const cSubTotalP = (arrayP) => {
    let subtotal = 0;
    let total = 0;
    let igv = 0;
    arrayP.forEach((p) => {
      subtotal += p.importe;
    });
    if (props.get_branch_options.igv == 1) {
      igv =
        subtotal * (parseFloat(props.get_branch_options.porcentaje_igv) / 100);
    }
    total = igv + subtotal;

    setIgvP(parseFloat(igv).toFixed(2));
    setSubTotalP(parseFloat(subtotal).toFixed(2));
    setTotalP(parseFloat(total).toFixed(2));
  };
  const dFProducts = () => {
    setRows([]);
    setValues(initialsStateValues);
    //setFProducts(true);
    setSubTotalP(0);
  };
  const handleChange = (selectedOption) => {
    const sTotal = selectedOption.precio_venta * cantidad;
    let p = JSON.parse(JSON.stringify(selectedOption));
    p.id = p.producto_id;
    setProducto(p);
    props.setProductId(p.id);
    setSubTotal(sTotal);
    props.showUnitMeasureModal();
  };
  const searchProducts = props.products
    ? props.products
        .map((p) => {
          p.id = p.producto_id;
          p.label = p.denominacion;
          p.value = p.producto_id;
          return p;
        })
        .filter((product) => product.estado == 1)
    : [];
  const cantidadInputChange = (e) => {
    let { name, value } = e.target;
    value = parseFloat(value);
    setCantidad(value);
    const sTotal = producto.precio_venta * value;
    setSubTotal(sTotal);
  };
  useEffect(() => {
    if (values.moneda != 1) {
      setValues({
        ...values,
        vuelto: (
          parseFloat(values.efectivo) * parseFloat(props.price_dollar.venta) -
          parseFloat(totalP)
        ).toFixed(2),
        cambio: (
          parseFloat(values.efectivo) * parseFloat(props.price_dollar.venta)
        ).toFixed(2),
      });
      //setValues({...values});
    } else {
      setValues({
        ...values,
        vuelto: (parseFloat(values.efectivo) - parseFloat(totalP)).toFixed(2),
      });
    }
  }, [values.efectivo, totalP]);
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
    console.log(customer, values);
    if (customer === null && values.persona_id === null) {
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
      toast.error("Cargando correlativo");
      return;
    }

    if (
      parseInt(
        customer ? customer.tipo_documento_id : values.tipo_documento_id
      ) === 6 &&
      parseInt(values.comprobante) !== 1
    ) {
      toast.error("El cliente solo puede generar facturas");
      return;
    }
    if (
      parseInt(
        customer ? customer.tipo_documento_id : values.tipo_documento_id
      ) === 1 &&
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

    const serieC = props.series.filter(
      (serie) => serie.serie_comprobante_id == values.serie
    );
    var date = new Date();

    const facturacion = {
      facturacion_id: values.facturacion_id,
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
      tipo_moneda_id: values.moneda,
      tipo_operacion_id: 1,
      tipo_pago_id: values.tipo_pago,
      tipo_forma_pago_id: values.forma_pago,
      comprobante_id: values.comprobante,
      serie_comprobante_id: values.serie,
      numero_comprobante: values.correlativo,
      valor_venta: parseFloat(subTotalP),
      descuento_global: 0.0,
      tasa_cambio: 0.0,
      gravadas: 0.0,
      exoneradas: 0.0,
      inafectas: 0.0,
      gratuitas: 0.0,
      totaligv: parseFloat(igvP),
      totalisc: 0.0,
      totalotrostributos: 0.0,
      totalventas: parseFloat(totalP),
      efectivo: values.efectivo,
      vuelto: parseFloat(values.vuelto),
      numero_operacion: values.numero_operacion,
      //es_concepto:"",
      //concepto:"",
      observacion: values.observacion,
      //fecha_registro:"",
      reserva_estancia_Id: 0,
      numero_habitacion: "",
      dias_estancia: 0,
      pago_id: 0,
      resumen_diario_id: 0,
      resumen_diario_anulado_id: 0,
      usuario_id: props.userRole.id,
      tipo_venta: 1,
      //estado_cierre:0,
      //estado_credito: 0,
      //estado_venta:0
    };

    let detalle = [];
    rows.map((item) => {
      const detailBilling = {
        unidad_medida_id: item.id.split("-")[1],
        facturacion_detalle_id: item.facturacion_detalle_id
          ? item.facturacion_detalle_id
          : null,
        //facturacion_id:values.facturacion_id,
        //facturacion_detalle_id: values.facturacion_id,
        producto_id: item.id.split("-")[0],
        cantidad: item.cantidad,
        precio_unitario: item.precio_venta,
        detalle: item.detalle || "",
        descuento: item.descuento,
        //tipoprecio: parseInt(item.unidad_medida_id),
        tipoprecio: "01",
        //tipoimpuesto:(props.get_branch_options.igv===1)? props.get_branch_options.porcentaje_igv:0,
        tipoimpuesto: 20,
        impuestoselectivo: 0.0,
        otroimpuesto: 0.0,
        sub_total: item.importe,
      };
      //console.log(detailBilling);
      detalle.push(detailBilling);
    });
    const factura = {
      facturacion,
      detalle,
    };
    /* console.log(factura); */
    setValues(initialsStateValues);
    props.updateSales(factura);
    setRows([]);

    props.hideModal();
  }
  const hideModal = () => {
    setValues(initialsStateValues);
    setProducto(initialsStateProduct);
    props.hideModal();
    setRows([]);
  };
  useEffect(() => {
    /* console.log(props.unitMeasureSelect);
        console.log(producto); */

    if (props.unitMeasureSelect) {
      if (parseInt(props.unitMeasureSelect.producto_id) == producto.id) {
        /* console.log(props.unitMeasureSelect); */
        setProducto({
          ...producto,
          precio_venta: props.unitMeasureSelect.precioventa,
        });
      }
    }
  }, [props.unitMeasureSelect]);
  useEffect(() => {
    if (producto.precio_venta) {
      const sTotal = cantidad * producto.precio_venta;
      setSubTotal(sTotal);
    }
  }, [producto.precio_venta]);
  const handleInputProductChange = (e) => {
    //let tProducto= values.producto;
    if (e.target.type === "checkbox") {
      var { name, checked } = e.target;
      checked = checked === true ? 1 : 0;
      //values.producto= {...tProducto,[name]:checked};
      setProducto({ ...producto, [name]: checked });
    }
    if (e.target.type === "text") {
      //console.log(e.target.type);
      const { name, value } = e.target;
      setProducto({ ...producto, [name]: value });
    }
    if (e.target.type === "select-one") {
      const { name, value } = e.target;
      setProducto({ ...producto, [name]: parseInt(value) });
      if (name === "tipo_pago") {
        props.getAllTypesPaymentsFroms(parseInt(value));
      }
      if (name === "comprobante") {
        const form = {
          idUser: props.userRole.id,
          idVoucher: parseInt(value),
        };
        //console.log(form);
        props.getAllSeriesVoucher(form);
      }
      if (name === "serie") {
        const form = {
          idUser: props.userRole.id,
          idVoucher: values.comprobante,
          idSerie: parseInt(value),
        };
        //console.log(form);
        props.getCorrelativeSeriesVoucher(form);
      }
    }
    if (e.target.type === "number") {
      const { name, value } = e.target;
      setProducto({ ...producto, [name]: parseInt(value) });
      if (name === "precio_venta") {
        const stotal = value * cantidad;
        setSubTotal(stotal);
      }
    }
    if (e.target.type === "date") {
      const { name, value } = e.target;
      setProducto({ ...producto, [name]: value });
    }
  };
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
      if (name != "comprobante" && name != "serie")
        setValues({ ...values, [name]: parseInt(value) });
      if (name === "tipo_pago") {
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
        let tFactura = props.sales_info.factura[0];
        if (
          parseInt(tFactura.comprobante_id) === parseInt(value) &&
          parseInt(comprobante.series[0].serie_comprobante_id) ===
            parseInt(tFactura.serie_comprobante_id)
        ) {
          setValues({
            ...values,
            serie: parseInt(comprobante.series[0].serie_comprobante_id),
            correlativo: zfill(parseInt(tFactura.numero_comprobante), 7),
            [name]: parseInt(value),
          });
        } else {
          setValues({
            ...values,
            serie: parseInt(comprobante.series[0].serie_comprobante_id),
            correlativo: zfill(parseInt(comprobante.series[0].correlativo), 7),
            [name]: parseInt(value),
          });
        }
        setSeriesVoucher(comprobante.series);
      }
      if (name === "serie") {
        /* const form = {
          idUser: props.userRole.id,
          idVoucher: values.comprobante,
          idSerie: parseInt(value),
        };
        props.getCorrelativeSeriesVoucher(form); */
        let tFactura = props.sales_info.factura[0];
        const serie = seriesVoucher.filter(
          (series) => parseInt(series.serie_comprobante_id) === parseInt(value)
        );
        if (parseInt(value) === parseInt(tFactura.serie_comprobante_id)) {
          setValues({
            ...values,
            correlativo: zfill(parseInt(tFactura.numero_comprobante), 7),
            [name]: parseInt(value),
          });
        } else {
          setValues({
            ...values,
            correlativo: zfill(parseInt(serie.correlativo), parseInt(7)),
            [name]: parseInt(value),
          });
        }
      }
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
  const rowDuplicate = (arrayP, product) => {
    for (let i = 0; i < arrayP.length; i++) {
      if (
        arrayP[i].id ==
        product.id + "-" + props.unitMeasureSelect.unidad_medida_id
      ) {
        return arrayP[i];
      }
    }

    return null;
  };
  const addProduct = () => {
    //console.log(values);
    if (producto.codigo_producto == null && producto.descripcion == null) {
      toast.error("Aun no seleccionó un producto");
      return;
    }
    if (cantidad == 0) {
      toast.error("Aun no ingreso la cantidad");
      return;
    }
    let tProduct = rowDuplicate(rows, producto);
    /* console.log("duplicado ",tProduct) */
    if (tProduct == null) {
      /* console.log(producto); */
      let tValues = producto;
      tValues.id = tValues.id + "-" + props.unitMeasureSelect.unidad_medida_id;
      tValues.cantidad = cantidad;
      tValues.importe = subTotal;
      tValues.descuento = 0;
      tValues.unidad_medida_id = props.unitMeasureSelect.unidad_medida_id;
      //tValues.index=rows.length+1;
      setRows([...rows, tValues]);
      cSubTotalP([...rows, tValues]);
      //localStorage.setItem("arraySales",JSON.stringify([...rows, tValues]));
    } else {
      let tRows = JSON.parse(JSON.stringify(rows));
      tProduct.cantidad += cantidad;
      tProduct.importe += subTotal;
      tProduct.descuento = 0;
      tRows[rows.indexOf(tProduct)] = tProduct;
      setRows(tRows);
      cSubTotalP(tRows);
      //localStorage.setItem("arraySales",JSON.stringify(tRows));
    }
    setProducto(initialsStateProduct);
    setCantidad(0);
    setSubTotal(0);
    props.setUnitMeasureSelect(null);
  };

  useEffect(() => {
    //console.log(props.price_dollar);
    if (values.moneda != 1 && props.price_dollar) {
      setValues({
        ...values,
        vuelto: (
          parseFloat(values.efectivo) * parseFloat(props.price_dollar.venta) -
          parseFloat(props.totalP)
        ).toFixed(2),
        cambio: (
          parseFloat(values.efectivo) * parseFloat(props.price_dollar.venta)
        ).toFixed(2),
      });
    } else {
      setValues({
        ...values,
        vuelto: (
          parseFloat(values.efectivo) - parseFloat(props.totalP)
        ).toFixed(2),
      });
    }
  }, [values.moneda]);
  useEffect(() => {
    //console.log(props.price_dollar);
    if (values.moneda != 1 && props.price_dollar) {
      setValues({
        ...values,
        vuelto: (parseFloat(values.cambio) - parseFloat(props.totalP)).toFixed(
          2
        ),
      });
    }
  }, [values.cambio]);
  /* useEffect(()=>{
        console.log(values.moneda);
        console.log(props.coins_types.filter(c=>c.tipo_moneda_id==values.moneda));
    },[props.coins_types]); */
  return (
    <div>
      <Modal size="xl" show={props.statusModal} onHide={hideModal} centered>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            {/* <Modal.Title>Editar factura</Modal.Title> */}
          </Modal.Header>
          <Modal.Body>
            <Container>
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
                      labelKey="razon_social_nombre"
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
                      -Seleccione-
                    </option>
                    {props.vouchers_serie_comprobante ? (
                      props.vouchers_serie_comprobante
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
                    value={values.serie}
                    name="serie"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      -Seleccione-
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
                        .filter(
                          (tPaymentFrom) => parseInt(tPaymentFrom.estado) === 1
                        )
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
                    value={values.fecha_emision || ""}
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
                      -Seleccione-
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
                    {values.moneda != 1 ? (
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
              </Row>
              <Row>
                <Col xl={12}>
                  <label className="form-label">Observación:</label>
                  <input
                    className="form-control"
                    value={values.observacion || ""}
                    name="observacion"
                    onChange={handleInputChange}
                    type="text"
                  />
                </Col>
              </Row>
              <Modal.Title className="mt-3">Detalles:</Modal.Title>
              <Row>
                <div style={{ height: 335, width: "100%" }} className="mt-2">
                  <DataGrid
                    onRowClick={({ row }) => {
                      console.log(row);
                    }}
                    rows={rows}
                    columns={columns}
                    localeText={esES.props.MuiDataGrid.localeText}
                    hideFooter={true}
                    hideFooterSelectedRowCount={true}
                    rowHeight={45}
                    disableColumnMenu={true}
                  />
                </div>
              </Row>
              <Row className="d-flex justify-content-around mt-3">
                <Row className="d-flex justify-content-xl-center justify-content-md-start">
                  <Col xl={2} md={3} className="my-md-3 my-3 my-xl-0">
                    <label className="form-label">Sub Total:</label>
                    <input
                      className="form-control"
                      value={subTotalP || ""}
                      type="text"
                      placeholder="0"
                      readOnly
                    />
                  </Col>
                  <Col xl={2} md={3} className="my-md-3 mb-3 my-xl-0">
                    <label className="form-label">IGV:</label>
                    <input
                      className="form-control"
                      value={igvP || ""}
                      type="text"
                      placeholder="0"
                      readOnly
                    />
                  </Col>
                  <Col xl={2} md={3} className="my-md-3 mb-3 my-xl-0">
                    <label className="form-label">Descuento:</label>
                    <input
                      className="form-control"
                      /* value={values.precio_venta||""} */ type="text"
                      placeholder="0"
                      readOnly
                    />
                  </Col>
                  <Col xl={2} md={3} className="my-md-3 mb-3 my-xl-0">
                    <label className="form-label">Total:</label>
                    <input
                      className="form-control"
                      value={totalP || ""}
                      type="text"
                      placeholder="0"
                      readOnly
                    />
                  </Col>
                </Row>
                <Col className="d-flex justify-content-md-end justify-content-sm-end py-3 align-items-end">
                  {rows.length == 0 ? (
                    ""
                  ) : (
                    <Button
                      md={2}
                      className="ml-3"
                      variant="success"
                      type="submit"
                    >
                      Actualizar
                    </Button>
                  )}
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
    vouchers: state.app.voucher.vouchers,
    userRole: state.auth.user[0],
    series: state.app.sales.series,
    types_payments: state.app.sales.types_payments,
    correlativo: state.app.sales.correlativo,
    types_payments_froms: state.app.sales.types_payments_froms,
    coins_types: state.app.sales.coins_types,
    vouchers_serie_comprobante: state.app.voucher.vouchers_serie_comprobante,
    openings: state.app.manageCash.openings,
    //
    products: state.app.products.products,
    unitmeasures: state.app.products.unitmeasures,
    get_branch_options: state.app.establishment.get_branch_options,
    //
    sales_info: state.app.sales.sales_info,
    client_save: state.app.clientsProviders.client_save,
    price_dollar: state.app.sales.price_dollar,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllVouchers: () => dispatch(Actions.getAllVouchers()),
    saveSales: (form) => dispatch(Actions.saveSales(form)),
    getAllSeriesVoucher: (form) => dispatch(Actions.getAllSeriesVoucher(form)),
    getCorrelativeSeriesVoucher: (form) =>
      dispatch(Actions.getCorrelativeSeriesVoucher(form)),
    getAllCoinType: () => dispatch(Actions.getAllCoinType()),
    getAllTypesPayments: () => dispatch(Actions.getAllTypesPayments()),
    getAllTypesPaymentsFroms: (idTypePayment) =>
      dispatch(Actions.getAllTypesPaymentsFroms(idTypePayment)),
    //
    getAllProducts: () => dispatch(Actions.getAllProducts()),
    getAllUnitMeasures: () => dispatch(Actions.getAllUnitMeasures()),
    getDataBranchOptions: (branchId) =>
      dispatch(Actions.getDataBranchOptions(branchId)),
    //
    updateSales: (form) => dispatch(Actions.updateSales(form)),
    clienteSaveReset: () => dispatch(Actions.clienteSaveReset()),
    getAllVouchersSerieComprobante: (form) =>
      dispatch(Actions.getAllVouchersSerieComprobante(form)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(EditSalesModal));
