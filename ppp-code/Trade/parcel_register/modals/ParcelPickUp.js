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
import { generateRandomString } from "../helper/Helpers";

const ParcelPickUp = (props) => {
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
  const dispatch = useDispatch();
  const [values, setValues] = useState(initialsStateValues);
  const [clave, setClave] = useState("");
  useEffect(() => {
    if (props.statusModal) {
      if (props.driverSelect) {
        /* props.getSearchSelectGrid(
          props.driverSelect.idremitente + "-" + props.driverSelect.idconsignado
        ); */
        setValues(props.driverSelect);
      } else {
        setValues(initialsStateValues);
      }
    }
  }, [props.statusModal]);

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
      setValues({ ...values, correlativo: value });
    }
    if (e.target.type === "number") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: parseInt(value) });
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

  function validateForm() {
    if (clave != values.clave) {
      toast.error("Clave incorrecta");
      focusForm("clave");
      return true;
    }
    return false;
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) return;
    props.updateStatus({
      ...values,
      estado: 3,
      id_user: props.userId,
    });
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
              Registrar recepción de encomienda - {values.codigo}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col sm={8} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2" style={{ width: "25%" }}>
                    Remitente:
                  </label>
                  <input
                    className="form-control"
                    value={values.remitente_nombre}
                    disabled={true}
                    style={{ width: "70%" }}
                    type="text"
                  />
                </Col>
                <Col sm={4} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2">DNI/RUC:</label>
                  <input
                    className="form-control"
                    style={{ width: "55%" }}
                    value={values.remitente_documento}
                    disabled={true}
                    type="text"
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={8} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2" style={{ width: "25%" }}>
                    Consignado:
                  </label>
                  <input
                    className="form-control"
                    style={{ width: "70%" }}
                    value={values.remitente_nombre}
                    disabled={true}
                    type="text"
                  />
                </Col>
                <Col sm={4} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2">DNI/RUC:</label>
                  <input
                    className="form-control"
                    style={{ width: "55%" }}
                    value={values.remitente_documento}
                    disabled={true}
                    type="text"
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={6} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2" style={{ width: "34%" }}>
                    Condición:
                  </label>
                  <input
                    className="form-control"
                    style={{ width: "60%" }}
                    value={values.condicion}
                    disabled={true}
                    type="text"
                  />
                </Col>
                <Col sm={6} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2" style={{ width: "25%" }}>
                    Entrega:
                  </label>
                  <input
                    className="form-control"
                    style={{ width: "70%" }}
                    value={values.entrega}
                    disabled={true}
                    type="text"
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col
                  sm={12}
                  className="d-flex justify-content-center align-items-center"
                >
                  <button
                    className=" btn border border-dark"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={values.fecharegistro}
                    style={{ borderRadius: "10px" }}
                  >
                    Origen ({values.sucursalinicio})
                  </button>
                  <i
                    className="fas fa-arrow-right"
                    style={{ color: "#A1A1A1" }}
                  ></i>
                  <button
                    className=" btn border border-dark"
                    data-placement="bottom"
                    title={values.fechatransporte}
                    style={{ borderRadius: "10px" }}
                  >
                    Transito
                  </button>
                  <i
                    className="fas fa-arrow-right"
                    style={{ color: "#A1A1A1" }}
                  ></i>
                  <button
                    className=" btn  bg_button_tracking"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={values.fecharecepcion}
                    style={{ borderRadius: "10px" }}
                  >
                    Destino ({values.sucursalfin})
                  </button>
                </Col>
              </Row>
              <Row className="d-flex justify-content-end mt-4">
                <Col sm={4} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2" style={{ width: "25%" }}>
                    Total:
                  </label>
                  <input
                    className="form-control"
                    style={{ width: "70%" }}
                    value={parseFloat(values.subtotal).toFixed(2)}
                    disabled={true}
                    type="text"
                  />
                </Col>
                <Col sm={4} className="form-inline my-2 my-lg-0 d-flex">
                  <label className="form-label mr-2" style={{ width: "25%" }}>
                    Clave:
                  </label>
                  <input
                    className="form-control"
                    style={{ width: "70%" }}
                    value={clave}
                    name="clave"
                    id="clave"
                    type="password"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      if (e.target.value.length <= 4 && e.target.validity.valid)
                        setClave(e.target.value);
                    }}
                  />
                </Col>
                <Col sm={2}>
                  <Col sm={12}>
                    <Button variant="primary" type="submit">
                      Entregar
                    </Button>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getSearchSelectGrid: (id) => dispatch(Actions.getSearchSelectGrid(id)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(ParcelPickUp));
