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
import { generateRandomString, generateX } from "../helper/Helpers";

const ParcelRegisterModal = (props) => {
  const initialsStateValues = {
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
  const initialsStateValuesData = {
    id_encomienda: null,
    descripcion: null,
    idunidadmedida: 69,
    cantidad: null,
    precio: null,
    subtotal: null,
  };
  /* const initialStateCode = {
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
    f: "",
  }; */
  const columns = [
    {
      field: "",
      headerName: "Acciones",
      headerAlign: "center",
      width: 110,
      disableClickEventBuddling: true,
      renderCell: ({ row }) => {
        //Elimina producto de datagrid
        const onClickDelete = () => {
          removeProductData(row.id);
        };
        return (
          <>
            <Button
              onClick={onClickDelete}
              variant="danger"
              data-toggle="tooltip"
              data-placement="right"
              title="Eliminar"
            >
              <i className="fas fa-trash-alt"></i>
            </Button>
          </>
        );
      },
    },
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
  const dispatch = useDispatch();
  const [values, setValues] = useState(initialsStateValues);
  const [data, setData] = useState(initialsStateValuesData);
  const [dataArray, setDataArray] = useState([]);
  const [transportistaSelect, setTransportistaSelect] = useState(null);
  const [show_new_remitente_form, setShow_new_remitente_form] = useState(false);
  //const [code, setCode] = useState(initialStateCode);
  const [show_new_consignado_form, setShow_new_consignado_form] =
    useState(false);
  const [remitenteSelect, setRemitenteSelect] = useState(null);
  const [consignadoSelect, setConsignadoSelect] = useState(null);
  const search_customer_loading = useSelector(
    (gridApp) => gridApp.app.grid.search_customer_loading
  );
  const search_people = useSelector(
    (gridApp) => gridApp.app.grid.search_people
  );
  useEffect(() => {
    if (props.statusModal) {
      if (props.driverSelect) {
        console.log(
          "idselect",
          props.driverSelect.idremitente + "-" + props.driverSelect.idconsignado
        );
        props.getSearchSelectGrid(
          props.driverSelect.idremitente + "-" + props.driverSelect.idconsignado
        );
        setValues(props.driverSelect);
      } else {
        setValues(initialsStateValues);
      }
    }
  }, [props.statusModal]);
  useEffect(() => {
    if (props.search_select && props.driverSelect) {
      setRemitenteSelect(props.search_select.remitente);
      setConsignadoSelect(props.search_select.consignado);
      props.getSearchSelectGrid(null);
    }
  }, [props.search_select]);
  useEffect(() => {
    if (props.series) {
      if (props.driverSelect) {
        setValues({
          ...values,
          serie_comprobante_id: props.driverSelect.serie_comprobante_id,
          correlativo: props.driverSelect.serie_comprobante_id,
        });
      } else {
        if (
          props.series.filter(({ comprobante_id }) => comprobante_id == 11)
            .length === 0
        ) {
          toast.error("No tiene serie de cargo asignado");
          props.hideModal();
          return;
        }
        setValues({
          ...values,
          serie_comprobante_id: props.series.filter(
            ({ comprobante_id }) => comprobante_id == 11
          )[0].serie_comprobante_id,
          correlativo:
            parseInt(
              props.series.filter(
                ({ comprobante_id }) => comprobante_id == 11
              )[0].correlativo
            ) + 1,
        });
      }
    }
  }, [props.series, props.statusModal]);
  useEffect(() => {
    if (props.list_parcel_register_detail && props.driverSelect) {
      setValues(props.list_parcel_register_detail.encomienda);
      setDataArray(
        props.list_parcel_register_detail.detalle.map((row, index) => {
          row.id = index;
          return row;
        })
      );
    }
  }, [props.list_parcel_register_detail]);
  useEffect(() => {
    if (props.list_drivers && props.driverSelect) {
      //console.log(props.driverSelect.idtransportista,props.list_drivers);
      const transportistaTemp = props.list_drivers
        .filter((p) => p.idtransportista == props.driverSelect.idtransportista)
        .map((p) => {
          p.id = p.idtransportista;
          p.label = p.razonsocial.toUpperCase() + " - " + p.placa;
          p.value = p.idtransportista;
          return p;
        })[0];
      //console.log("transportistaTemp", transportistaTemp);
      setTransportistaSelect(transportistaTemp);
    }
  }, [props.list_drivers, props.statusModal]);
  useEffect(() => {
    console.log(values);
  }, [values]);
  const handleChangeShowRemitenteForm = () => {
    setShow_new_remitente_form(!show_new_remitente_form);
    if (show_new_consignado_form) setShow_new_consignado_form(false);
  };
  const handleChangeShowConsignadoForm = () => {
    setShow_new_consignado_form(!show_new_consignado_form);
    if (show_new_remitente_form) setShow_new_remitente_form(false);
  };
  const handleRemitenteSaved = (saved) => {
    setRemitenteSelect(saved);
  };
  const handleConsignadoSaved = (saved) => {
    setConsignadoSelect(saved);
  };
  const handleSearchRemitente = (query) => {
    dispatch(Actions.searchCustomerLoading(true));
    dispatch(Actions.searchPerson(query.toLowerCase()));
  };
  const handleSearchConsignado = (query) => {
    dispatch(Actions.searchCustomerLoading(true));
    dispatch(Actions.searchPerson(query.toLowerCase()));
  };
  const handleSelectRemitente = (selected) => {
    if (selected.length > 0) {
      setRemitenteSelect(selected[0]);
      setValues({ ...values, idremitente: selected[0].persona_id });
    } else {
      setRemitenteSelect(null);
      setValues({ ...values, idremitente: null });
    }
  };
  const handleSelectConsignado = (selected) => {
    if (selected.length > 0) {
      setConsignadoSelect(selected[0]);
      setValues({ ...values, idconsignado: selected[0].persona_id });
    } else {
      setConsignadoSelect(null);
      setValues({ ...values, idconsignado: null });
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
      setValues({ ...values, [name]: value });
      if (name === "serie_comprobante_id") {
        setValues({ ...values, correlativo: value });
      }
    }
    if (e.target.type === "number") {
      const { name, value } = e.target;

      setValues({ ...values, [name]: parseInt(value) });
    }
    if (e.target.type === "date") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    }
    if (e.target.type === "password") {
      const { name, value } = e.target;
      if (name == "clave") {
        if (value.length <= 4 && e.target.validity.valid)
          setValues({ ...values, [name]: parseInt(value) });
      } else {
        setValues({ ...values, [name]: value });
      }
    }
  };
  const handleInputChangeData = (e) => {
    //console.log(e.target.type);
    if (e.target.type === "checkbox") {
      var { name, checked } = e.target;
      checked = checked === true ? 1 : 0;
      setData({ ...data, [name]: checked });
    }
    if (e.target.type === "text") {
      //console.log(e.target.type);
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    }
    if (e.target.type === "select-one") {
      const { name, value } = e.target;
      setData({ ...data, [name]: parseInt(value) });
    }
    if (e.target.type === "number") {
      const { name, value } = e.target;
      setData({ ...data, [name]: parseFloat(value) });
      if (name === "precio") {
        setData({
          ...data,
          subtotal: parseFloat(value),
          precio: parseFloat(value),
        });
      }
    }
    if (e.target.type === "date") {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });
    }
  };
  const focusForm = (idForm) => {
    const x = document.getElementById(idForm);
    x.focus();
  };
  const getSeriesCorrelativo = () => {
    setValues({
      ...values,
      correlativo:
        props.series && values.serie_comprobante_id
          ? parseInt(
              props.series.filter(
                ({ serie_comprobante_id }) =>
                  serie_comprobante_id == values.serie_comprobante_id
              )[0].correlativo
            ) + 1
          : 0,
    });
  };
  function validateForm() {
    /* serie_comprobante_id: null,
    correlativo: null,
    idtransportista: null,
    destino: null,
    idremitente: null,
    idconsignado: null,
    direccion: null,
    condicion: null,
    entrega: null,
    observacion: null, */
    if (!values.serie_comprobante_id || values.serie_comprobante_id == "") {
      toast.error("Seleccione la serie");
      focusForm("serie_comprobante_id");
      return true;
    }
    if (!values.correlativo || values.correlativo == "") {
      toast.error("Seleccione la serie");
      focusForm("correlativo");
      return true;
    }
    if (!values.idtransportista || values.idtransportista == "") {
      toast.error("Seleccione el transportista");
      focusForm("idtransportista");
      return true;
    }
    if (!values.id_sucursal_fin || values.id_sucursal_fin == 0) {
      toast.error("Seleccione el destino");
      focusForm("id_sucursal_fin");
      return true;
    }
    if (!values.idremitente || values.idremitente == "") {
      toast.error("Seleccione el remitente");
      //focusForm("idremitente");
      return true;
    }
    if (!values.idconsignado || values.idconsignado == "") {
      toast.error("Seleccione el consignado");
      //focusForm("idconsignado");
      return true;
    }
    /* if (!values.direccion || values.direccion == "") {
      toast.error("Ingrese la direccion");
      focusForm("direccion");
      return true;
    } */
    if (!values.condicion || values.condicion == "") {
      toast.error("Seleccione la condicion");
      focusForm("condicion");
      return true;
    }
    if (!values.entrega || values.entrega == "") {
      toast.error("Seleccione la entrega");
      focusForm("entrega");
      return true;
    }
    if (!values.clave || values.clave == "") {
      toast.error("Ingrese la clave");
      focusForm("clave");
      return true;
    }
    /* if (!values.observacion || values.observacion == "") {
      toast.error("Ingrese la observacion");
      focusForm("observacion");
      return true;
    } */
    if (dataArray.length === 0) {
      toast.error("Aun no ingresó productos");
      return true;
    }
    return false;
  }
  function validateFormData() {
    /* descripcion: null,
    idunidadmedida: 68,
    cantidad: null,
    precio: null,
    subtotal: null, */
    if (!data.descripcion || data.descripcion == "") {
      toast.error("Ingrese la descripcion");
      focusForm("descripcion");
      return true;
    }
    if (!data.idunidadmedida || data.idunidadmedida == "") {
      toast.error("Seleccione la unidad de medida");
      focusForm("idunidadmedida");
      return true;
    }
    if (!data.cantidad || data.cantidad == "") {
      toast.error("Ingrese la cantidad");
      focusForm("cantidad");
      return true;
    }
    if (!data.precio || data.precio == "") {
      toast.error("Ingrese el precio");
      focusForm("precio");
      return true;
    }
    return false;
  }
  const removeProductData = (index) => {
    let dataArrayTemp = dataArray.filter(({ id }) => id != index);
    setDataArray(dataArrayTemp);
  };
  const indexData = () => {
    if (dataArray.length === 0) {
      return 0;
    } else {
      return dataArray.reverse()[0].id + 1;
    }
  };
  const addProductData = () => {
    if (validateFormData()) return;
    let dataTemp = { ...data, id: indexData() };
    console.log(dataTemp);
    setDataArray([...dataArray, dataTemp]);
    setData(initialsStateValuesData);
  };
  const sumSubTotalData = () => {
    let subTotal = 0;
    dataArray.map((p) => {
      subTotal += parseFloat(p.subtotal);
    });
    return subTotal;
  };
  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) return;

    const form = {
      encomienda: { ...values, subtotal: sumSubTotalData() },
      detalle: dataArray,
    };

    if (props.driverSelect) {
      props.updateParcelRegister(form);
    } else {
      props.saveParcelRegister(form);
    }
    setValues(initialsStateValues);
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
              {!props.driverSelect
                ? "Registrar encomienda "
                : "Actualizar encomienda "}
              {values.id_encomienda
                ? "/ Guía " + props.leftZero(values.id_encomienda, 7)
                : ""}
              {values.codigo ? " / Codigo " + values.codigo : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row className="d-flex justify-content-center">
                <Col sm={3}>
                  <select
                    className="form-select"
                    value={values.serie_comprobante_id || 0}
                    name="serie_comprobante_id"
                    id="serie_comprobante_id"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      Seleccionar
                    </option>
                    {props.series ? (
                      props.series
                        .filter(({ comprobante_id }) => comprobante_id == 11)
                        .map((driver) => {
                          return (
                            <option
                              value={driver.serie_comprobante_id}
                              key={driver.serie_comprobante_id}
                            >
                              {" "}
                              {driver.serie_comprobante}{" "}
                            </option>
                          );
                        })
                    ) : (
                      <></>
                    )}
                  </select>
                </Col>
                <Col sm={3}>
                  <input
                    className="form-control"
                    value={props.leftZero(values.correlativo || 0, 7)}
                    name="correlativo"
                    id="correlativo"
                    onChange={handleInputChange}
                    type="text"
                    readOnly={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <label className="form-label">Destino:</label>
                  <select
                    className="form-select"
                    value={values.id_sucursal_fin || 0}
                    name="id_sucursal_fin"
                    id="id_sucursal_fin"
                    onChange={handleInputChange}
                  >
                    <option value={0} disabled>
                      Seleccionar
                    </option>
                    {props.list_branchs ? (
                      props.list_branchs
                        .filter(
                          ({
                            establecimiento_sucursal_id,
                            establecimiento_id,
                          }) =>
                            establecimiento_sucursal_id !=
                              props.user.sucursal_id &&
                            establecimiento_id == props.user.establecimiento_id
                        )
                        .map((branch) => {
                          return (
                            <option
                              value={branch.establecimiento_sucursal_id}
                              key={branch.establecimiento_sucursal_id}
                            >
                              {" "}
                              {props.list_branchs.filter(
                                ({
                                  establecimiento_sucursal_id,
                                  establecimiento_id,
                                }) =>
                                  establecimiento_sucursal_id ==
                                    props.user.sucursal_id &&
                                  establecimiento_id ==
                                    props.user.establecimiento_id
                              ).length > 0
                                ? props.list_branchs.filter(
                                    ({
                                      establecimiento_sucursal_id,
                                      establecimiento_id,
                                    }) =>
                                      establecimiento_sucursal_id ==
                                        props.user.sucursal_id &&
                                      establecimiento_id ==
                                        props.user.establecimiento_id
                                  )[0].sucursal
                                : ""}
                              -{branch.sucursal}{" "}
                            </option>
                          );
                        })
                    ) : (
                      <></>
                    )}
                  </select>
                </Col>
                <Col sm={6}>
                  <label className="form-label">Conductor:</label>
                  <Select
                    value={transportistaSelect}
                    onChange={(selectedOption) => {
                      setTransportistaSelect(selectedOption);
                      setValues({
                        ...values,
                        idtransportista: selectedOption.idtransportista,
                      });
                    }}
                    options={
                      props.list_drivers
                        ? props.list_drivers.map((p) => {
                            p.id = p.idtransportista;
                            p.label =
                              p.razonsocial.toUpperCase() + " - " + p.placa;
                            p.value = p.idtransportista;
                            return p;
                          })
                        : []
                    }
                  />
                </Col>
                <Col sm={3}>
                  <label className="form-label">Placa:</label>
                  <input
                    className="form-control"
                    value={
                      props.list_drivers && values.idtransportista
                        ? props.list_drivers.filter(
                            ({ idtransportista }) =>
                              idtransportista == values.idtransportista
                          )[0].placa
                        : "---"
                    }
                    type="text"
                    readOnly={true}
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
                    value={
                      remitenteSelect ? remitenteSelect.numero_documento : "---"
                    }
                    type="text"
                    readOnly={true}
                  />
                </Col>
                <Col sm={9}>
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
                      onSearch={handleSearchRemitente}
                      onChange={handleSelectRemitente}
                      placeholder="Buscar cliente"
                      promptText="Ingrese al menos 3 caracteres para realizar la búsqueda"
                      searchText="Realizando la búsqueda, por favor espere un momento"
                      emptyLabel={
                        search_customer_loading
                          ? "Obteniendo datos desde el servidor"
                          : "No se encontraron resultados"
                      }
                      selected={
                        remitenteSelect == null ? [] : [remitenteSelect]
                      }
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
                        onClick={handleChangeShowRemitenteForm}
                        className="btn-success"
                      >
                        <i className="fas fa-user"></i>
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Row>

              <NewCustomerForm
                handleCustomerSaved={handleRemitenteSaved}
                handleCloseNewCustomerForm={() => {
                  handleChangeShowRemitenteForm();
                  Actions.searchPerson(null);
                }}
                show={show_new_remitente_form}
              />
              <Row>
                <label className="form-label">Consignado a:</label>
              </Row>
              <Row>
                <Col sm={3}>
                  <input
                    className="form-control"
                    value={
                      consignadoSelect
                        ? consignadoSelect.numero_documento
                        : "---"
                    }
                    type="text"
                    readOnly={true}
                  />
                </Col>
                <Col sm={9}>
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
                      onSearch={handleSearchConsignado}
                      onChange={handleSelectConsignado}
                      placeholder="Buscar cliente"
                      promptText="Ingrese al menos 3 caracteres para realizar la búsqueda"
                      searchText="Realizando la búsqueda, por favor espere un momento"
                      emptyLabel={
                        search_customer_loading
                          ? "Obteniendo datos desde el servidor"
                          : "No se encontraron resultados"
                      }
                      selected={
                        consignadoSelect == null ? [] : [consignadoSelect]
                      }
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
                        onClick={handleChangeShowConsignadoForm}
                        className="btn-success"
                      >
                        <i className="fas fa-user"></i>
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Row>
              <NewCustomerForm
                handleCustomerSaved={handleConsignadoSaved}
                handleCloseNewCustomerForm={() => {
                  Actions.searchPerson(null);
                  handleChangeShowRemitenteForm();
                }}
                show={show_new_consignado_form}
              />
              <Row>
                <Col sm={4}>
                  <label className="form-label">Clave:</label>
                  <input
                    className="form-control"
                    value={values.clave || ""}
                    name="clave"
                    id="clave"
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    type="password"
                  />
                </Col>
                <Col sm={8}>
                  <label className="form-label">Direccion:</label>
                  <input
                    className="form-control"
                    value={values.direccion || ""}
                    name="direccion"
                    id="direccion"
                    onChange={handleInputChange}
                    type="text"
                  />
                </Col>
              </Row>
              <Col className="border border-dark mt-3">
                <Row>
                  <Col xl={4} md={4} sm={3}>
                    <label className="form-label fs-6">Descripción:</label>
                    <input
                      className="form-control"
                      value={data.descripcion || ""}
                      name="descripcion"
                      id="descripcion"
                      onChange={handleInputChangeData}
                      type="text"
                    />
                  </Col>
                  <Col xl={3} md={3} sm={3}>
                    <label className="form-label">Unidad:</label>
                    <select
                      className="form-select"
                      value={data.idunidadmedida || 0}
                      name="idunidadmedida"
                      id="idunidadmedida"
                      onChange={handleInputChangeData}
                    >
                      <option value={0} disabled>
                        Seleccionar
                      </option>
                      {props.unitmeasures ? (
                        props.unitmeasures.map((driver) => {
                          return (
                            <option
                              value={driver.unidad_medida_id}
                              key={driver.unidad_medida_id}
                            >
                              {" "}
                              {driver.unidad_medida}{" "}
                            </option>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </select>
                  </Col>
                  <Col xl={2} md={2} sm={2}>
                    <label className="form-label">Cantidad:</label>
                    <input
                      className="form-control"
                      min="0"
                      step="0.1"
                      value={data.cantidad || ""}
                      type="number"
                      name="cantidad"
                      id="cantidad"
                      onChange={handleInputChangeData}
                    />
                  </Col>
                  <Col xl={2} md={2} sm={2}>
                    <label className="form-label">Precio:</label>
                    <input
                      className="form-control"
                      min="0"
                      step="0.1"
                      value={data.precio || ""}
                      type="number"
                      name="precio"
                      id="precio"
                      onChange={handleInputChangeData}
                    />
                  </Col>
                  <Col
                    xl={1}
                    md={1}
                    sm={2}
                    className="d-flex align-items-end justify-content-end my-3 my-xl-0"
                  >
                    <Button
                      variant="success"
                      style={{ width: 40, heigth: 40 }}
                      onClick={addProductData}
                      className="rounded-circle"
                    >
                      <i className="fas fa-plus "></i>
                    </Button>
                  </Col>
                </Row>
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
                <Col sm={10}>
                  <Row>
                    <Col sm={6}>
                      <label className="form-label">Condición:</label>
                      <select
                        className="form-select"
                        value={values.condicion || 0}
                        name="condicion"
                        id="condicion"
                        onChange={handleInputChange}
                      >
                        <option value={0} disabled>
                          Seleccionar
                        </option>
                        <option value={"PAGADO"}>PAGADO</option>
                        <option value={"CONTRAENTREGA"}>CONTRAENTREGA</option>
                      </select>
                    </Col>
                    <Col sm={6}>
                      <label className="form-label">Entrega a:</label>
                      <select
                        className="form-select"
                        value={values.entrega || 0}
                        name="entrega"
                        id="entrega"
                        onChange={handleInputChange}
                      >
                        <option value={0} disabled>
                          Seleccionar
                        </option>
                        <option value={"AGENCIA"}>AGENCIA</option>
                        <option value={"DOMICILIO"}>DOMICILIO</option>
                      </select>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <label className="form-label">Observación:</label>
                      <input
                        className="form-control"
                        value={values.observacion || ""}
                        name="observacion"
                        id="observacion"
                        onChange={handleInputChange}
                        type="text"
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
                  <Col sm={12} className="d-flex align-items-end">
                    <Col sm={12}>
                      <Button variant="primary" type="submit">
                        {!props.driverSelect ? "Guardar" : "Actualizar"}{" "}
                      </Button>
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
    list_drivers: state.app.managementDriver.list_drivers,
    unitmeasures: state.app.products.unitmeasures,
    search_select: state.app.grid.search_select,
    list_branchs: state.app.establishment.list_branchs,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveParcelRegister: (form) => dispatch(Actions.saveParcelRegister(form)),
    updateParcelRegister: (form) =>
      dispatch(Actions.updateParcelRegister(form)),
    getSearchSelectGrid: (id) => dispatch(Actions.getSearchSelectGrid(id)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(ParcelRegisterModal));
