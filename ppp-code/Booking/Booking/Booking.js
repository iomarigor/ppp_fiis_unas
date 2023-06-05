import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Content from "components/templates/content";
import {
  Row,
  Col,
  InputGroup,
  FormControl,
  Form,
  Container,
  Button,
} from "react-bootstrap";
import { connect } from "react-redux";
import withDragDropContext from "./helper/withDnDContext";

import Loader from "../helpers/loader/Loader";
import * as Actions from "store/actions/app";
import moment from "moment";
import "moment/locale/es";
import GuestRegister from "./forms/GuestRegister";
const Booking = (props) => {
  const [huespedes, setHuespedes] = useState([]);
  useEffect(() => {
    if (!props.match.params.reserva_estancia_id) {
      return;
    }
    props.getResumeByBooking(props.match.params.reserva_estancia_id);
    props.getAllTypeDocuments();
    //return props.getResumeByBooking(null);
  }, []);
  useEffect(() => {
    if (props.resume && props.resume.resumen.length > 0) {
      /* setHuespedes(
        parseInt(props.resume.resumen[0].numero_adultos) +
          parseInt(props.resume.resumen[0].numero_ninos)
      ); */
      var hupedes = props.resume.huespedes.filter(
        (h) => parseInt(h.menor) === 0
      );
      var hupedesMenos = props.resume.huespedes.filter(
        (h) => parseInt(h.menor) === 1
      );
      let tHuespedes = [];
      for (let i = 0; i < props.resume.resumen[0].numero_adultos; i++) {
        tHuespedes.push({
          key: i,
          isChildren: false,
          data: hupedes[i] ? hupedes[i] : null,
        });
      }
      let index = tHuespedes.length;
      for (let i = 0; i < props.resume.resumen[0].numero_ninos; i++) {
        tHuespedes.push({
          key: index,
          isChildren: true,
          data: hupedesMenos[i] ? hupedesMenos[i] : null,
        });
        index++;
      }
      console.log(tHuespedes);
      setHuespedes(tHuespedes);
    }
  }, [props.resume]);
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-primary"
        style={{ flexShrink: 1, flexGrow: 0 }}
      >
        <a className="navbar-brand ml-2" href="#">
          Tampu <i className="fas fa-box"></i>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link active" href="#">
              Registro de huespedes
            </a>
          </div>
        </div>
      </nav>
      <Container
        className="mt-3  position-relative"
        style={{
          width: "100%",
          flexShrink: 1,
          flexGrow: 1,
          minHeight: 420,
        }}
      >
        <Loader show={!props.resume} center={true} />
        {/* <Col
          style={{
            height: "100%",
            paddingTop: "1rem",
          }}
        ></Col> */}
        {props.resume && props.resume.resumen.length > 0 ? (
          <>
            <Row className="mt-1">
              <Col sm={6}>
                <Row>
                  <label for="staticEmail" className="col-sm-2 col-form-label">
                    Contacto:
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      readonly
                      disabled={true}
                      className="form-control"
                      id="staticEmail"
                      value={
                        props.resume.resumen.length > 0
                          ? props.resume.resumen[0].razon_social_nombre
                          : ""
                      }
                    />
                  </div>
                </Row>
              </Col>
              <Col sm={6}>
                <Row>
                  <label for="staticEmail" className="col-sm-2 col-form-label">
                    RUC/DNI:
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      readonly
                      disabled={true}
                      className="form-control"
                      id="staticEmail"
                      value={
                        props.resume.resumen.length > 0
                          ? props.resume.resumen[0].numero_documento
                          : ""
                      }
                    />
                  </div>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={4}>
                <Row>
                  <label for="staticEmail" className="col-sm-6 col-form-label">
                    Fecha de llegada:
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="text"
                      readonly
                      disabled={true}
                      className="form-control"
                      id="staticEmail"
                      value={
                        props.resume.resumen.length > 0
                          ? props.resume.resumen[0].fecha_llegada.split(" ")[0]
                          : ""
                      }
                    />
                  </div>
                </Row>
              </Col>
              <Col sm={4}>
                <Row>
                  <label for="staticEmail" className="col-sm-6 col-form-label">
                    Fecha de salida:
                  </label>
                  <div className="col-sm-6">
                    <input
                      type="text"
                      readonly
                      disabled={true}
                      className="form-control"
                      id="staticEmail"
                      value={
                        props.resume.resumen.length > 0
                          ? props.resume.resumen[0].fecha_salida.split(" ")[0]
                          : ""
                      }
                    />
                  </div>
                </Row>
              </Col>
              <Col sm={4}>
                <Row>
                  <label for="staticEmail" className="col-sm-4 col-form-label">
                    Habitación:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      readonly
                      disabled={true}
                      className="form-control"
                      id="staticEmail"
                      value={
                        props.resume.resumen.length > 0
                          ? props.resume.resumen[0].numero_habitacion +
                            " " +
                            props.resume.resumen[0].clase_habitacion
                          : ""
                      }
                    />
                  </div>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={12}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label className="form-check-label" for="flexCheckDefault">
                    Deseo recibir información de ofertas y promociones
                  </label>
                </div>
              </Col>
            </Row>
            {huespedes.map((huesped) => {
              return (
                <GuestRegister
                  key={"huesped" + huesped.key}
                  isChildren={huesped.isChildren}
                  data={huesped.data}
                  reserva_estancia_id={
                    props.resume.resumen[0].reserva_estancia_id
                  }
                />
              );
            })}
            <Row className="d-flex justify-content-end mb-3">
              {parseInt(props.resume.resumen[0].estado_registro) === 1 ? (
                <Col sm={3}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      window.open(
                        `${process.env.REACT_APP_API_URL}/api/registroestancia/${props.resume.resumen[0].reserva_estancia_id}`,
                        "_blank"
                      );
                    }}
                  >
                    Imprimir registro de huesped
                  </Button>
                </Col>
              ) : (
                <Col sm={2}>
                  <Button
                    disabled={props.loader_comfir_register}
                    variant="success"
                    onClick={() => {
                      props.loaderComfirRegister(true);
                      props.saveRegisterEstancia(
                        props.resume.resumen[0].reserva_estancia_id
                      );
                    }}
                  >
                    Confirmar registro
                  </Button>
                </Col>
              )}
            </Row>
          </>
        ) : (
          <h1 className="text-center">Estancia no registrada</h1>
        )}
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    resume: state.app.grid.resume,
    loader_comfir_register: state.app.grid.loader_comfir_register,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    //getAccessControl: () => dispatch(Actions.getAccessControl()),
    getResumeByBooking: (reserva_estancia_id) =>
      dispatch(Actions.getResumeByBooking(reserva_estancia_id)),
    getAllTypeDocuments: () => dispatch(Actions.getAllTypeDocuments()),
    saveRegisterEstancia: (reserva_estancia_id) =>
      dispatch(Actions.saveRegisterEstancia(reserva_estancia_id)),
    loaderComfirRegister: (form) =>
      dispatch(Actions.loaderComfirRegister(form)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(Booking));
