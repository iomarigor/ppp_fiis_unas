import React, { useState, useEffect } from "react";
import { Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
import { connect } from "react-redux";
import withDragDropContext from "../helper/withDnDContext";
import { toast } from "react-toastify";
import * as Actions from "store/actions/app";

const GuestRegister = (props) => {
  const initialsStateValues = {
    reserva_estancia_huesped_id: null,
    persona_id: null,
    nacionalidad: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    fechaNacimiento: "",
    tipo_documento_id: 0,
    nDocumento: "",
    correo: "",
    reserva_estancia_id: null,
    menor: 0,
  };
  const [values, setValues] = useState(initialsStateValues);
  useEffect(() => {
    console.log(props.data);
    if (props.data) {
      let nombreArray = props.data.razon_social_nombre.split(" ");
      let apellidos = "";
      let nombres = "";
      if (nombreArray.length >= 3) {
        apellidos = nombreArray.slice(-2).join(" ");
        nombres = nombreArray.slice(0, -2).join(" ");
      } else {
        nombres = nombreArray.join(" ");
      }

      setValues({
        ...values,
        reserva_estancia_huesped_id: props.data.reserva_estancia_huesped_id,
        persona_id: props.data.persona_id,
        nacionalidad: props.data.nacionalidad || "",
        nombres: nombres,
        apellidos: apellidos,
        telefono: props.data.telefono || "",
        fechaNacimiento: props.data.fecha_nacimiento || "",
        tipo_documento_id: parseInt(props.data.tipo_documento_id),
        nDocumento: props.data.numero_documento,
        correo: props.data.correo_electronico,
        reserva_estancia_id: props.reserva_estancia_id,
        menor: props.isChildren ? 1 : 0,
      });
    } else {
      setValues({
        ...values,
        reserva_estancia_id: props.reserva_estancia_id,
        menor: props.isChildren ? 1 : 0,
      });
    }
  }, []);
  //actualizo los valores de los inputs segun su tipo
  const handleInputChange = (e) => {
    if (e.target.type === "checkbox") {
      var { name, checked } = e.target;
      checked = checked === true ? 1 : 0;
      setValues({ ...values, [name]: checked });
    }
    if (e.target.type === "text") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
    }
    if (e.target.type === "select-one") {
      const { name, value } = e.target;
      setValues({ ...values, [name]: parseInt(value) });
    }
    if (e.target.type === "number") {
      const { name, value } = e.target;
      let tValues = { ...values, [name]: parseFloat(value) };
      setValues(tValues);
    }
  };
  function handleSubmit(e) {
    e.preventDefault();
    /*  if (
      parseInt(values.icbper) === 1 &&
      parseInt(values.icbper_importe) === 0
    ) {
      toast.error("Aun no se ingreso el ICBPER");
      return;
    } */
    props.loaderGuestRegister(props.key);
    props.saveGuestByBookingRegister(values);
    //setValues({...values,});
  }
  return (
    <div
      className={
        "card my-3 " + (props.isChildren ? "border-warning" : "border-primary")
      }
    >
      <form onSubmit={handleSubmit} id={props.key}>
        <div className="card-header">
          {props.isChildren ? "Registrar menor" : "Registrar huesped"}
        </div>
        <div className="card-body">
          <Row>
            <Col sm={12}>
              <Row>
                <label for="staticEmail" className="col-sm-3 col-form-label">
                  Nacionalidad:
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="staticEmail"
                    name="nacionalidad"
                    onChange={handleInputChange}
                    value={values.nacionalidad}
                    disabled={
                      !props.data || parseInt(props.data.estado_registro) === 0
                        ? false
                        : true
                    }
                  />
                </div>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={6}>
              <Row>
                <label for="staticEmail" className="col-sm-3 col-form-label">
                  Tipo documento:
                </label>
                <div className="col-sm-9">
                  <Form.Control
                    as="select"
                    value={values.tipo_documento_id}
                    name="tipo_documento_id"
                    onChange={handleInputChange}
                    disabled={
                      !props.data || parseInt(props.data.estado_registro) === 0
                        ? false
                        : true
                    }
                  >
                    {props.type_documents.map((type_documents) => {
                      return (
                        <option
                          value={parseInt(type_documents.tipo_documento_id)}
                          key={type_documents.tipo_documento_id}
                        >
                          {" "}
                          {type_documents.tipo_documento}{" "}
                        </option>
                      );
                    })}
                  </Form.Control>
                </div>
              </Row>
            </Col>
            <Col sm={6}>
              <Row>
                <label for="staticEmail" className="col-sm-3 col-form-label">
                  N. Documento:
                </label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    id="staticEmail"
                    name="nDocumento"
                    onChange={handleInputChange}
                    value={values.nDocumento}
                    disabled={
                      !props.data || parseInt(props.data.estado_registro) === 0
                        ? false
                        : true
                    }
                  />
                </div>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={6}>
              <Row>
                <label for="staticEmail" className="col-sm-3 col-form-label">
                  Nombres:
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="staticEmail"
                    name="nombres"
                    onChange={handleInputChange}
                    value={values.nombres}
                    disabled={
                      !props.data || parseInt(props.data.estado_registro) === 0
                        ? false
                        : true
                    }
                  />
                </div>
              </Row>
            </Col>
            <Col sm={6}>
              <Row>
                <label for="staticEmail" className="col-sm-3 col-form-label">
                  Apellidos:
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="staticEmail"
                    name="apellidos"
                    onChange={handleInputChange}
                    value={values.apellidos || ""}
                    disabled={
                      !props.data || parseInt(props.data.estado_registro) === 0
                        ? false
                        : true
                    }
                  />
                </div>
              </Row>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col sm={6}>
              <Row>
                <label for="staticEmail" className="col-sm-3 col-form-label">
                  Teléfono:
                </label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    id="staticEmail"
                    name="telefono"
                    onChange={handleInputChange}
                    value={values.telefono || ""}
                    disabled={
                      !props.data || parseInt(props.data.estado_registro) === 0
                        ? false
                        : true
                    }
                  />
                </div>
              </Row>
            </Col>
            <Col sm={6}>
              <Row>
                <label for="staticEmail" className="col-sm-3 col-form-label">
                  Correo electrónico:
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="staticEmail"
                    name="correo"
                    onChange={handleInputChange}
                    value={values.correo || ""}
                    disabled={
                      !props.data || parseInt(props.data.estado_registro) === 0
                        ? false
                        : true
                    }
                  />
                </div>
              </Row>
            </Col>
          </Row>
          {!props.data || parseInt(props.data.estado_registro) === 0 ? (
            <Row className="d-flex justify-content-end mt-3">
              <Col sm={1}>
                <Button
                  disabled={
                    props.loader_guest_register === props.key ? true : false
                  }
                  variant="success"
                  type="submit"
                  form={props.key}
                >
                  Guardar
                </Button>
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </div>
      </form>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    type_documents: state.app.clientsProviders.type_documents,
    loader_guest_register: state.app.grid.loader_guest_register,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveGuestByBookingRegister: (form) =>
      dispatch(Actions.saveGuestByBookingRegister(form)),
    loaderGuestRegister: (form) => dispatch(Actions.loaderGuestRegister(form)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(GuestRegister));
