import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import withDragDropContext from "./helper/withDnDContext";
import moment from "moment";
import "moment/locale/es";

import {
  getAllRooms,
  getAllBookings,
  getAllDailyReport,
  doCheckIn,
  doCheckOut,
  closeBookingForm,
  moveBooking,
  deleteBooking,
  getAllUnitMeasures,
  getStayCancel,
  getAllOpenings,
  resetRoomsBooKing,
  sendMailRegisterEstancia,
} from "store/actions/app";
import Content from "components/templates/content";
import Scheduler, {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT,
} from "react-big-scheduler";
import "react-big-scheduler/lib/css/style.css";
import _ from "@lodash";
import { toast } from "react-toastify";
import { ButtonToolbar, Button, Row, Badge, Col, Toast } from "react-bootstrap";
import ConfirmationDialog from "components/commons/ConfirmationDialog";
import PaymentModal from "./modal/payment.modal";
import GuestModal from "./modal/guest.modal";
import BookModal from "./modal/book.modal";
import ExtraModal from "./modal/extra.modal";
import FlightModal from "./modal/flight.modal";
import ConciergeModal from "./modal/concierge.modal";
import OrderModal from "./modal/order.modal";
import ResumeModal from "./modal/resume.modal";
import MailModal from "./modal/mail.modal";
import DetailModal from "./modal/detail.modal";
import UnitMeasureModal from "./modal/UnitMeasureModal";
import DailyReportModal from "./modal/dailyreport.modal";
import ExitReportModal from "./modal/exitreport.modal";
import Loader from "../helpers/loader/Loader";
import "./helper/Grid.css";

class Grid extends React.Component {
  constructor(props) {
    super(props);

    let schedulerData = new SchedulerData(
      new moment().format(DATE_FORMAT),
      ViewTypes.Month,
      false,
      false,
      {
        checkConflict: true,
        schedulerMaxHeight: 400,
        schedulerWidth: "80%",
        resourceName: "Habitaciones",
        views: [
          {
            viewName: "Mensual",
            viewType: ViewTypes.Month,
            showAgenda: false,
            isEventPerspective: false,
          },
          {
            viewName: "Anual",
            viewType: ViewTypes.Year,
            showAgenda: false,
            isEventPerspective: false,
          },
        ],
      },
      moment
    );
    schedulerData.localeMoment.locale("es");
    schedulerData.setResources([]);
    schedulerData.setEvents([]);

    this.state = {
      viewModel: schedulerData,
      rooms: this.props.rooms ? this.props.rooms : [],
      bookings: this.props.booking ? this.props.booking : [],
      openings: this.props.openings ? this.props.openings : [],
      userRole: this.props.userRole,
      bookRoom: null,
      bookModal: false,
      extraModal: false,
      flightModal: false,
      guestModal: false,
      paymentModal: false,
      conciergeModal: false,
      orderModal: false,
      resumeModal: false,
      mailModal: false,
      detailModal: false,
      unitMeasureModal: false,
      dailyReportModal: false,
      exitReportModal: false,
      price_sales: 0.0,
      productID: null,
    };
  }
  handleStatusChange(status) {
    console.log("handleStatusChange", status);
    /*  */
  }
  componentDidMount() {
    this.props.getAllRooms();
    this.props.getAllBookings();
    this.props.getAllUnitMeasures(); /* 
    this.props.getAllDailyReport(); */
    this.props.getAllOpenings();
    /* this.setState({
      openings: (this.props.openings)? this.props.openings:[]
    }); */
  }
  componentWillUnmount() {
    this.props.resetRoomsBooKing();
    this.props.getAllOpenings();
    /* this.setState({
      openings: (this.props.openings)? this.props.openings:[]
    }); */
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let schedulerData = prevState.viewModel;

    if (nextProps.rooms ? nextProps.rooms.length : 0 > 0) {
      if (nextProps.rooms !== prevState.rooms) {
        schedulerData.setResources(
          _.map(nextProps.rooms, (room) => {
            return {
              id: room.habitacion_id,
              name: `${room.numero_habitacion}`,
            };
          })
        );
      }

      if (nextProps.bookings !== prevState.bookings) {
        schedulerData.setEvents(
          _.map(nextProps.bookings, (booking) => {
            return {
              id: booking.reserva_estancia_id,
              start: booking.fecha_llegada,
              end: booking.fecha_salida,
              resourceId: booking.habitacion_id,
              title: booking.razon_social_nombre,
              startResizable: false,
              bgColor: Grid.setBackgroundColor(booking),
              booking,
            };
          })
        );
      }

      return {
        viewModel: schedulerData,
        rooms: nextProps.rooms,
        bookings: nextProps.bookings,
      };
    }

    return null;
  }

  render() {
    const { viewModel } = this.state;

    return (
      <React.Fragment>
        <Content
          title="Grilla"
          section="Panel principal"
          content={
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <i className="fas fa-bed mr-1"></i>Gestión de Reservas y
                      estancias
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <button
                          type="button"
                          onClick={() => {
                            this.setState({ dailyReportModal: true });
                          }}
                          className="btn btn-warning mr-2"
                        >
                          Parte diario
                        </button>
                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => {
                            this.setState({ exitReportModal: true });
                          }}
                        >
                          Salidas
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div
                          style={{ minHeight: 420, width: "100%" }}
                          className="mt-1  position-relative"
                        >
                          <Loader
                            show={!this.props.rooms && !this.props.booking}
                            center={true}
                          />
                          <Scheduler
                            className="position-absolute w-full"
                            schedulerData={viewModel}
                            prevClick={this.prevClick}
                            nextClick={this.nextClick}
                            onSelectDate={this.onSelectDate}
                            onViewChange={this.onViewChange}
                            newEvent={this.newEvent}
                            updateEventEnd={this.updateEventEnd}
                            moveEvent={this.moveEvent}
                            toggleExpandFunc={this.toggleExpandFunc}
                            conflictOccurred={this.conflictOccurred}
                            eventItemPopoverTemplateResolver={
                              this.eventItemPopoverTemplateResolver
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <DailyReportModal
          show={this.state.dailyReportModal}
          onHide={() => {
            this.setState({ dailyReportModal: false });
          }}
        />
        <ExitReportModal
          show={this.state.exitReportModal}
          onHide={() => {
            this.setState({ exitReportModal: false });
          }}
        />
        <BookModal
          room={this.state.bookRoom}
          show={this.state.bookModal}
          onHide={() => {
            this.props.closeBookingForm(false);
            this.setState({ bookModal: false });
          }}
        />
        <ExtraModal
          room={this.state.bookRoom}
          show={this.state.extraModal}
          onHide={() => {
            this.setState({ extraModal: false });
          }}
        />
        <FlightModal
          room={this.state.bookRoom}
          show={this.state.flightModal}
          onHide={() => {
            this.setState({ flightModal: false });
          }}
        />
        <GuestModal
          room={this.state.bookRoom}
          show={this.state.guestModal}
          onHide={() => {
            this.setState({ guestModal: false });
          }}
        />
        <PaymentModal
          room={this.state.bookRoom}
          show={this.state.paymentModal}
          onHide={() => {
            this.setState({ paymentModal: false });
          }}
        />
        <ConciergeModal
          room={this.state.bookRoom}
          show={this.state.conciergeModal}
          pricesales={this.state.price_sales}
          onHide={() => {
            this.setState({ conciergeModal: false });
            this.setState({ unitMeasureModal: false });
          }}
          onUnitMeasureShow={(productid) => {
            if (productid) {
              this.setState({ productID: productid });
              this.setState({ conciergeModal: false });
              this.setState({ unitMeasureModal: true });
            }
          }}
        />
        <OrderModal
          room={this.state.bookRoom}
          show={this.state.orderModal}
          onHide={() => {
            this.setState({ orderModal: false });
          }}
        />
        <UnitMeasureModal
          statusModal={this.state.unitMeasureModal}
          hideModal={() => {
            this.setState({ unitMeasureModal: false });
          }}
          productId={this.state.productID}
          setUnitMeasureSelect={(p) => {
            this.setState({ price_sales: p });
            this.setState({ conciergeModal: true });
            this.setState({ unitMeasureModal: false });
          }}
          /* resetDataProduct={resetDataProduct} */
        />

        <ResumeModal
          room={this.state.bookRoom}
          show={this.state.resumeModal}
          onHide={() => {
            this.setState({ resumeModal: false });
          }}
        />
        <MailModal
          room={this.state.bookRoom}
          show={this.state.mailModal}
          onHide={() => {
            this.setState({ mailModal: false });
          }}
        />
        <DetailModal
          room={this.state.bookRoom}
          show={this.state.detailModal}
          onHide={() => {
            this.setState({ detailModal: false });
          }}
        />
      </React.Fragment>
    );
  }

  prevClick = (schedulerData) => {
    schedulerData.prev();
    this.props.getAllBookings();
    this.setState({
      viewModel: schedulerData,
    });
  };

  nextClick = (schedulerData) => {
    schedulerData.next();
    this.props.getAllBookings();
    this.setState({
      viewModel: schedulerData,
    });
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    this.props.getAllBookings();
    this.setState({
      viewModel: schedulerData,
    });
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    this.props.getAllBookings();
    this.setState({
      viewModel: schedulerData,
    });
  };

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    //var fi = new Intl.DateTimeFormat('en-GB').format(new Date(start));
    //var fa = new Intl.DateTimeFormat('en-GB').format(new Date());
    var d = new Date();
    var fi = new Date(start).setHours(
      d.getHours(),
      d.getMinutes(),
      d.getMilliseconds()
    );
    var fa = new Date();
    if (fi >= fa.getTime()) {
      this.setState({
        bookRoom: {
          roomId: slotId,
          roomName: slotName,
          start: start,
          end: end,
        },
        bookModal: true,
      });
    } else {
      toast.warn("No se puede generar eventos con fechas pasadas");
    }
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    this.props.moveBooking({
      booking_id: event.id,
      start: event.start,
      end: newEnd,
      room_id: event.resourceId,
    });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    //if (new Date(start).addHours(12).getTime() < new Date().getTime()) {
    //toast.warn("No se puede mover eventos a fechas pasadas");
    //} else {
    this.props.moveBooking({
      booking_id: event.id,
      start,
      end,
      room_id: slotId,
    });
    //}
  };

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData,
    });
  };

  conflictOccurred = (
    schedulerData,
    action,
    event,
    type,
    slotId,
    slotName,
    start,
    end
  ) => {
    toast.warn("No se puede sobreponer fechas entre eventos");
  };

  eventItemPopoverTemplateResolver = (
    schedulerData,
    eventItem,
    title,
    start,
    end,
    statusColor
  ) => {
    return (
      <div
        style={{
          width: "300px",
        }}
      >
        <Row>
          <Col xs="6">
            <small className="text-muted">
              Registrado por: {eventItem.booking.nombres}
            </small>
          </Col>
          <Col xs="6">
            <small className="text-muted">
              Fecha: {eventItem.booking.fecha_reserva}
            </small>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6># {eventItem.booking.codigo_reserva}</h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="text-primary" title={title}>
              CLIENTE: {title}
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span className="text-success">
              Teléfono: {eventItem.booking.telefono}
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span
              className="header1-text"
              style={{ fontSize: "20px !important" }}
            >
              {start.format("HH:mm")} - {end.format("HH:mm")}
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>
              <Badge style={{ backgroundColor: statusColor, color: "white" }}>
                {this.setStateText(eventItem.booking)}
              </Badge>
            </h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <b>Datos generales</b>
          </Col>
        </Row>
        <Row className="mt-1 mb-1">
          <Col>
            <span className="mr-2">
              Paquete:{" "}
              <Badge variant="warning">{eventItem.booking.descripcion}</Badge>
            </span>
            |
            <span className="ml-2 mr-2">
              Tarifa: <Badge variant="info">{eventItem.booking.tarifa}</Badge>
            </span>
            |
            <span className="ml-2 mr-2">
              Total: <Badge variant="success">{eventItem.booking.total}</Badge>
            </span>
            |
            <span className="ml-2 mr-2">
              Pagos: <Badge variant="primary">{eventItem.booking.pagos}</Badge>
            </span>
          </Col>
        </Row>

        {
          /* ((eventItem.booking.early_checkin !== null &&
          parseFloat(eventItem.booking.early_checkin) !== 0.0) ||
          (eventItem.booking.late_checkout !== null &&
            parseFloat(eventItem.booking.late_checkout) !== 0.0)) && ( */
          <React.Fragment>
            <Row>
              <Col>
                <b>Datos extras</b>{" "}
                <span className="ml-2 mr-2">
                  Saldo:{" "}
                  <Badge variant="danger">{eventItem.booking.saldo}</Badge>
                </span>
              </Col>
            </Row>
            <Row className="mt-1 mb-1">
              <Col>
                {eventItem.booking.early_checkin !== null &&
                  parseFloat(eventItem.booking.early_checkin) !== 0.0 && (
                    <span className="mr-2">
                      <Badge variant="warning">
                        Early Check-in: {eventItem.booking.early_checkin}
                      </Badge>
                    </span>
                  )}
                {eventItem.booking.late_checkout !== null &&
                  parseFloat(eventItem.booking.late_checkout) !== 0.0 && (
                    <span className="mr-2">
                      <Badge variant="info">
                        Late Check-out: {eventItem.booking.late_checkout}
                      </Badge>
                    </span>
                  )}
              </Col>
            </Row>
          </React.Fragment>
          /* ) */
        }
        {parseInt(eventItem.booking.estado) === 1 && (
          <Row className="mt-1 w-100">
            <Col>
              <ButtonToolbar className="d-flex">
                <Button
                  className="rounded-0 mx-1 mb-1"
                  variant="outline-warning"
                  size="sm"
                  onClick={() =>
                    this.setState({ bookRoom: eventItem, extraModal: true })
                  }
                  data-toggle="tooltip"
                  data-placement="right"
                  title="Extras"
                >
                  <i className="fas fa-tags"></i>
                </Button>
                <Button
                  className="rounded-0 mx-1 mb-1"
                  variant="outline-info"
                  size="sm"
                  onClick={() =>
                    this.setState({ bookRoom: eventItem, detailModal: true })
                  }
                  data-toggle="tooltip"
                  data-placement="right"
                  title="Información"
                >
                  <i className="fas fa-info-circle "></i>
                </Button>
                {parseInt(eventItem.booking.tipo_reserva_estancia) === 1 && (
                  <Button
                    className="rounded-0 mx-1 mb-1"
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      this.setState({ bookRoom: eventItem, flightModal: true })
                    }
                    data-toggle="tooltip"
                    data-placement="right"
                    title="Arrivos"
                  >
                    <i className="fas fa-plane-departure"></i>
                  </Button>
                )}
                <Button
                  className="rounded-0 mx-1 mb-1"
                  variant="outline-success"
                  size="sm"
                  onClick={() =>
                    this.setState({ bookRoom: eventItem, guestModal: true })
                  }
                  data-toggle="tooltip"
                  data-placement="right"
                  title="Huéspedes"
                >
                  <i className="fas fa-users"></i>
                </Button>
                <Button
                  className="rounded-0 mx-1 mb-1"
                  variant="outline-info"
                  size="sm"
                  onClick={() => {
                    if (
                      this.props.openings.filter(
                        (opening) =>
                          parseInt(opening.id_usuario) ===
                            parseInt(this.state.userRole.id) &&
                          parseInt(opening.estado) === 0
                      ).length === 0
                    ) {
                      toast.error("Caja no aperturada");
                      return;
                    }
                    this.setState({ bookRoom: eventItem, paymentModal: true });
                  }}
                  data-toggle="tooltip"
                  data-placement="right"
                  title="Pagos"
                >
                  <i className="fas fa-money-check"></i>
                </Button>
                {parseInt(eventItem.booking.tipo_reserva_estancia) === 2 && (
                  <ConfirmationDialog
                    title="Mensaje de confirmación"
                    description="¿ Desea realizar el Check In ?"
                  >
                    {(confirm) => (
                      <Button
                        className="rounded-0 mx-1 mb-1"
                        variant="outline-danger"
                        size="sm"
                        onClick={confirm(() => {
                          this.handleCheckIn(eventItem.booking);
                        })}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Check In"
                      >
                        <i className="far fa-calendar-check"></i>
                      </Button>
                    )}
                  </ConfirmationDialog>
                )}
                {parseInt(eventItem.booking.tipo_reserva_estancia) === 2 && (
                  <Button
                    className="rounded-0 mx-1 mb-1"
                    variant="outline-info"
                    size="sm"
                    onClick={() => {
                      //this.handleSendMailBooking(eventItem.booking);
                      this.setState({
                        bookRoom: eventItem,
                        mailModal: true,
                      });
                    }}
                    data-toggle="tooltip"
                    data-placement="right"
                    title="Enviar mail"
                  >
                    <i className="far fa-envelope"></i>
                  </Button>
                )}
                {parseInt(eventItem.booking.tipo_reserva_estancia) === 1 && (
                  <React.Fragment>
                    <ConfirmationDialog
                      title="Mensaje de confirmación"
                      description="¿ Desea realizar el Check Out ?"
                    >
                      {(confirm) => (
                        <Button
                          className="rounded-0 mx-1 mb-1"
                          variant="outline-danger"
                          size="sm"
                          onClick={confirm(() => {
                            this.handleCheckOut(eventItem.booking);
                          })}
                          disabled={!parseFloat(eventItem.booking.saldo) <= 0}
                          data-toggle="tooltip"
                          data-placement="right"
                          title="Check Out"
                        >
                          <i className="far fa-calendar-times"></i>
                        </Button>
                      )}
                    </ConfirmationDialog>
                    <Button
                      className="rounded-0 mx-1 mb-1"
                      variant="outline-warning"
                      size="sm"
                      onClick={() =>
                        this.setState({
                          bookRoom: eventItem,
                          resumeModal: true,
                        })
                      }
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Resumen"
                    >
                      <i className="fas fa-poll"></i>
                    </Button>
                    <Button
                      className="rounded-0 mx-1 mb-1"
                      variant="outline-success"
                      size="sm"
                      onClick={() =>
                        this.setState({
                          bookRoom: eventItem,
                          conciergeModal: true,
                        })
                      }
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Consumo y
                      Servicio Habitación"
                    >
                      <i className="fas fa-concierge-bell"></i>
                    </Button>
                    <Button
                      className="rounded-0 mx-1 mb-1"
                      variant="outline-warning"
                      size="sm"
                      onClick={() =>
                        this.setState({
                          bookRoom: eventItem,
                          orderModal: true,
                        })
                      }
                      data-toggle="tooltip"
                      data-placement="right"
                      title="Consumo y
                      Servicio Pedido"
                    >
                      <i className="fas fa-concierge-bell"></i>
                    </Button>
                    {parseInt(this.props.userRole.rol) === "Administrador" && (
                      <Button
                        className="rounded-0 mx-1 mb-1"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          this.props.getStayCancel(
                            eventItem.booking.reserva_estancia_id
                          );
                        }}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Anular"
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    )}
                  </React.Fragment>
                )}
                {parseInt(eventItem.booking.tipo_reserva_estancia) === 2 && (
                  <ConfirmationDialog
                    title="Mensaje de confirmación"
                    description="¿ Desea cancelar la reserva ?"
                  >
                    {(confirm) => (
                      <Button
                        className="rounded-0 mx-1 mb-1"
                        variant="outline-danger"
                        size="sm"
                        onClick={confirm(() =>
                          this.handleCancelBooking(eventItem.booking)
                        )}
                        data-toggle="tooltip"
                        data-placement="right"
                        title="Cancelar
                        reserva"
                      >
                        <i className="far fa-trash-alt"></i>
                      </Button>
                    )}
                  </ConfirmationDialog>
                )}
              </ButtonToolbar>
            </Col>
          </Row>
        )}
        {parseInt(eventItem.booking.estado) === 2 && (
          <Row className="mb-1">
            <Button
              variant="primary"
              onClick={() => {
                window.open(
                  `${process.env.REACT_APP_API_URL}/api/resumenestancia/${eventItem.booking.reserva_estancia_id}`,
                  "_blank"
                );
              }}
            >
              Imprimir
            </Button>
          </Row>
        )}
      </div>
    );
  };

  handleCheckOut = (booking) => {
    this.props.doCheckOut({
      reserva_estancia_id: booking.reserva_estancia_id,
    });
  };

  handleCheckIn = (booking) => {
    this.props.doCheckIn({
      reserva_estancia_id: booking.reserva_estancia_id,
    });
  };

  handleCancelBooking = (booking) => {
    this.props.deleteBooking({
      reserva_estancia_id: booking.reserva_estancia_id,
    });
  };
  handleSendMailBooking = (booking) => {
    if (!booking.correo_electronico || booking.correo_electronico.length == 0) {
      toast.warn("El usuario no tiene el correo registrado");
      return;
    }
    console.log(booking);
    const dataSend = {
      to: booking.correo_electronico,
      urlSend:
        process.env.REACT_APP_URL + "/booking/" + booking.reserva_estancia_id,
      nameUser: booking.razon_social_nombre,
      detalle: "Confirmación de registro de reserva",
      subject: "Reserva habitación",
    };
    this.props.sendMailRegisterEstancia(dataSend);
  };

  static setBackgroundColor = (event) => {
    var color = "";

    if (
      parseInt(event.estado) === 1 &&
      parseInt(event.tipo_reserva_estancia) === 2
    ) {
      //RESERVA
      color = "#ABEBC6";
    } else if (
      parseInt(event.estado) === 2 &&
      parseInt(event.tipo_reserva_estancia) === 1
    ) {
      //CHECKOUT
      color = "#FFDD33";
    } else if (
      parseInt(event.estado) === 1 &&
      parseInt(event.tipo_reserva_estancia) === 1
    ) {
      //ESTANCIA
      color = "#3498DB";
    } else if (
      parseInt(event.estado) === -1 &&
      parseInt(event.tipo_reserva_estancia) === 1
    ) {
      //ESTANCIA Cancelada
      color = "#DA416F";
    }

    return color;
  };

  setStateText = (event) => {
    var text = "";

    if (
      parseInt(event.estado) === 1 &&
      parseInt(event.tipo_reserva_estancia) === 2
    ) {
      text = "RESERVA PENDIENTE DE PAGO";
    } else if (
      parseInt(event.estado) === 2 &&
      parseInt(event.tipo_reserva_estancia) === 2
    ) {
      text = "RESERVA PAGADA";
    } else if (
      parseInt(event.estado) === 1 &&
      parseInt(event.tipo_reserva_estancia) === 1
    ) {
      text = "ESTANCIA";
    }

    return text;
  };
}

const mapStateToProps = (state) => {
  return {
    rooms: state.app.grid.rooms,
    bookings: state.app.grid.bookings,
    openings: state.app.manageCash.openings,
    userRole: state.auth.user[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllRooms: () => dispatch(getAllRooms()),
    getAllBookings: () => dispatch(getAllBookings()),
    doCheckIn: (booking) => dispatch(doCheckIn(booking)),
    doCheckOut: (booking) => dispatch(doCheckOut(booking)),
    closeBookingForm: (flag) => dispatch(closeBookingForm(flag)),
    moveBooking: (booking) => dispatch(moveBooking(booking)),
    deleteBooking: (booking) => dispatch(deleteBooking(booking)),
    getAllUnitMeasures: () => dispatch(getAllUnitMeasures()),
    resetRoomsBooKing: () => dispatch(resetRoomsBooKing()),
    getAllOpenings: () => dispatch(getAllOpenings()),
    getStayCancel: (id) => dispatch(getStayCancel(id)),
    sendMailRegisterEstancia: (form) =>
      dispatch(sendMailRegisterEstancia(form)),
  };
};

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withDragDropContext(Grid));
