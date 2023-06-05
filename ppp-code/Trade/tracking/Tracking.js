import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Col, Row, Container, Card } from "react-bootstrap";
import withDragDropContext from "./helper/withDnDContext";
import { connect } from "react-redux";
import TrackingExample from "./helper/trackingExample.png";
import * as Actions from "store/actions/app";
import Loader from "../helpers/loader/Loader";

function Tracking(props) {
  const initialStateValues = {
    nroGuia: "",
    codGuia: "",
  };
  const [values, setValues] = useState(initialStateValues);
  useEffect(() => {
    if (props.parsel_search) {
      console.log(props.parsel_search);
    }
  }, [props.parsel_search]);
  useEffect(() => {
    console.log("loaderSearch", props.loader_parsel_search);
  }, [props.loader_parsel_search]);
  function validateForm() {
    if (values.nroGuia.length != 7) {
      toast.error("Ingrese numero de guia valido");
      focusForm("nroGuia");
      return true;
    }
    if (values.codGuia.length != 4) {
      toast.error("Ingrese código de guia valido");
      focusForm("codGuia");
      return true;
    }
    return false;
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) return;
    props.searchParcelRegister(values);
    focusForm("card-data");
  }
  const focusForm = (idForm) => {
    const x = document.getElementById(idForm);
    x.focus();
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexWrap: "warp",
        flexDirection: "column",
      }}
    >
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-primary"
        style={{ flexShrink: 1, flexGrow: 0 }}
      >
        <a className="navbar-brand" href="#">
          Trade <i className="fas fa-box"></i>
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
              Inicio
            </a>
          </div>
        </div>
      </nav>
      <Container
        style={{
          width: "100%",
          flexShrink: 1,
          flexGrow: 1,
        }}
      >
        <Row
          style={{
            height: "100%",
            paddingTop: "1rem",
          }}
        >
          <Col
            sm={6}
            className="d-flex align-items-center justify-content-center my-4"
          >
            <Card style={{ width: "80%" }}>
              <Card.Header className="bg-primary">
                Rastrear encomienda <i className="fas fa-map-marked-alt"></i>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12}>
                      <label className="form-label">Numero de guía:</label>
                      <input
                        className="form-control"
                        value={values.nroGuia}
                        id="nroGuia"
                        onChange={(e) => {
                          if (e.target.value.length <= 7)
                            setValues({ ...values, nroGuia: e.target.value });
                        }}
                        type="text"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={12}>
                      <label className="form-label">Codigo de guía:</label>
                      <input
                        className="form-control"
                        value={values.codGuia}
                        id="codGuia"
                        onChange={(e) => {
                          if (e.target.value.length <= 4)
                            setValues({ ...values, codGuia: e.target.value });
                        }}
                        type="text"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col sm={12} className="d-flex justify-content-end">
                      <Button variant="success" type="submit">
                        Rastrear <i className="fas fa-search-location"></i>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </Card.Body>
            </Card>
          </Col>
          <Col
            sm={6}
            className="d-flex align-items-center justify-content-center"
          >
            <Card
              style={{ width: "80%", height: "28rem" }}
              className="position-relative"
              id="card-data"
            >
              <Loader
                show={props.loader_parsel_search}
                center={true}
                isbd={false}
              />
              {!props.parsel_search ? (
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Col>
                    <Row>
                      <Col sm={12}>
                        <p className="h4 text-center">
                          Puedes consutar los datos rastreo en la parte inferior
                          de su guia:
                        </p>
                      </Col>
                    </Row>
                    <img
                      src={TrackingExample}
                      width="100%"
                      alt="ejemplo rastreo"
                      className="border border-dark"
                    />
                  </Col>
                </Card.Body>
              ) : (
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Col>
                    <Row>
                      <Col sm={12}>
                        <p className="h4 text-center">
                          Encomienda {props.parsel_search.codigo}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <label className="form-label mr-2">Remitente:</label>
                        <input
                          className="form-control"
                          value={
                            props.parsel_search.remitente_documento +
                            " - " +
                            props.parsel_search.remitente_nombre
                          }
                          disabled={true}
                          type="text"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col sm={12}>
                        <label className="form-label mr-2">Consignado:</label>
                        <input
                          className="form-control"
                          value={
                            props.parsel_search.consignado_documento +
                            " - " +
                            props.parsel_search.consignado_nombre
                          }
                          disabled={true}
                          type="text"
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4 d-flex justify-content-center">
                      <Col
                        sm={12}
                        className=" d-flex justify-content-center align-items-center"
                      >
                        <button
                          className={
                            " btn  " +
                            (props.parsel_search.estado == 0
                              ? "bg_button_tracking"
                              : "border border-dark")
                          }
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={props.parsel_search.fecharegistro}
                          style={{ borderRadius: "10px" }}
                        >
                          Origen
                          <br /> ({props.parsel_search.sucursalinicio})
                        </button>

                        <i
                          className="fas fa-arrow-right"
                          style={{ color: "#A1A1A1" }}
                        ></i>
                        <button
                          className={
                            " btn  " +
                            (props.parsel_search.estado == 1
                              ? "bg_button_tracking"
                              : "border border-dark")
                          }
                          data-placement="bottom"
                          title={props.parsel_search.fechatransporte}
                          style={{ height: "100%", borderRadius: "10px" }}
                        >
                          Transito
                        </button>

                        <i
                          className="fas fa-arrow-right"
                          style={{ color: "#A1A1A1" }}
                        ></i>
                        <button
                          className={
                            " btn  " +
                            (props.parsel_search.estado == 2
                              ? "bg_button_tracking"
                              : "border border-dark")
                          }
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={props.parsel_search.fecharecepcion}
                          style={{ borderRadius: "10px" }}
                        >
                          Destino
                          <br /> ({props.parsel_search.sucursalfin})
                        </button>

                        <i
                          className="fas fa-arrow-right"
                          style={{ color: "#A1A1A1" }}
                        ></i>
                        <button
                          className={
                            " btn  " +
                            (props.parsel_search.estado == 3
                              ? "bg_button_tracking"
                              : "border border-dark")
                          }
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title={props.parsel_search.fechaentrega}
                          style={{ height: "100%", borderRadius: "10px" }}
                        >
                          Entregado
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    parsel_search: state.app.parcelRegister.parsel_search,
    loader_parsel_search: state.app.parcelRegister.loader_parsel_search,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    searchParcelRegister: (form) =>
      dispatch(Actions.searchParcelRegister(form)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(Tracking));
