/*
    Action: Grid
    Descripción: Acciones del componente Grid de la aplicación
*/

import axios from "axios";
import * as Actionss from "components/auth/store/actions";

import * as Actions from "../app";

import { toast } from "react-toastify";

export const GET_ALL_ROOMS = "[GRID] GET ALL ROOMS";
export const GET_DAILY_REPORT = "[GRID] GET DAILY REPORT";
export const RESET_ROOMS_BOOKING = "[GRID] RESET ROOMS BOOKING";
export const GET_ALL_AIRLINE = "[GRID] GET ALL AIRLINE";
export const GET_ALL_ROOM_CLASS = "[GRID] GET ALL ROOM CLASS";
export const SEARCH_PERSON = "[GRID] SEARCH PERSON";
export const SEARCH_CUSTOMER_LOADING = "[GRID] SEARCH CUSTOMER LOADING";
export const SEARCH_GUEST_LOADING = "[GRID] SEARCH CUSTOMER LOADING";
export const SAVE_CUSTOMER = "[GRID] SAVE CUSTOMER";
export const SAVE_GUEST = "[GRID] SAVE GUEST";
export const SET_SAVED_CUSTOMER = "[GRID] SET SAVED CUSTOMER";
export const SET_SAVED_GUEST = "[GRID] SET SAVED GUEST";
export const SAVE_BOOKING = "[GRID] SAVE BOOKING";
export const DELETE_BOOKING = "[GRID] DELETE BOOKING";
export const GET_ALL_BOOKINGS = "[GRID] GET ALL BOOKINGS";
export const MOVE_BOOKING = "[GRID] MOVE BOOKING";
export const GET_ALL_PACKAGES = "[GRID] GET ALL PACKAGES";
export const CLOSE_BOOKING_FORM = "[GRID] CLOSE BOOKING FORM";
export const GET_FLIGHTS_BY_BOOKING = "[GRID] GET FLIGHTS BY BOOKING";
export const GET_GUESTS_BY_BOOKING = "[GRID] GET GUESTS BY BOOKING";
export const SAVE_FLIGHT_BY_BOOKING = "[GRID] SAVE FLIGHT BY BOOKING";
export const DELETE_FLIGHT_BY_BOOKING = "[GRID] DELETE FLIGHT BY BOOKING";
export const SAVE_GUEST_BY_BOOKING = "[GRID] SAVE GUEST BY BOOKING";
export const DELETE_GUEST_BY_BOOKING = "[GRID] DELETE GUEST BY BOOKING";
export const GET_ORIGIN_DESTINATION = "[GRID] GET ORIGIN DESTINATION";
export const GET_ALL_OCCUPATION = "[GRID] GET ALL OCCUPATION";
export const SAVE_EXTRA = "[GRID] SAVE EXTRA";
export const GET_EXTRA = "[GRID] GET EXTRA";
export const GET_PAYMENTS_BY_BOOKING = "[GRID] GET PAYMENTS BY BOOKING";
export const SAVE_PAYMENT_BY_BOOKING = "[GRID] SAVE PAYMENT BY BOOKING";
export const DELETE_PAYMENT_BY_BOOKING = "[GRID] DELETE PAYMENT BY BOOKING";
export const GET_ALL_BANKS = "[GRID] GET ALL BANKS";
export const SET_SAVED_PAYMENT = "[GRID] SET SAVED PAYMENT";
export const DO_CHECK_IN = "[GRID] DO CHECK IN";
export const DO_CHECK_OUT = "[GRID] DO CHECK OUT";
export const GET_SALE_CHANNEL = "[GRID] GET SALE CHANNEL";
export const GET_ALL_CONSUME_BY_ROOM = "[GRID] GET ALL CONSUME BY ROOM";
export const SEARCH_PRODUCT = "[GRID] SEARCH PRODUCT";
export const SEARCH_PRODUCT_LOADING = "[GRID] SEARCH PRODUCT LOADING";
export const SAVE_CONSUME_BY_BOOKING = "[GRID] SAVE CONSUME BY BOOKING";
export const SET_SAVED_CONSUME = "[GRID] SET SAVED CONSUME";
export const DELETE_CONSUME_BY_BOOKING = "[GRID] DELETE CONSUME BY BOOKING";
export const GET_DETAIL_BY_BOOKING = "[GRID] GET DETAIL BY BOOKING";
export const SAVE_DETAIL_BY_BOOKING = "[GRID] SAVE DETAIL BY BOOKING;";
export const GET_RESUME_BY_BOOKING = "[GRID] GET RESUME BY BOOKING";
//AGREGADO POR JOSUE
export const GET_ALL_EMPLOYEES = "[GRID] GET ALL EMPLOYEES";
export const CRUD_STAY = "[GRID] CRUD STAY";
export const SEARCH_SELECT = "[GRID] SEARCH SELECT";
export function getSearchSelectGrid(id) {
  if (!id) {
    return (dispatch) =>
      dispatch({
        type: SEARCH_SELECT,
        payload: null,
      });
  }
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/sidpersonaprovedor/${id}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: SEARCH_SELECT,
        payload: response.data.detalles,
      });
    });
}

export function getStayCancel(id) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/aestancia/${id}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }
      dispatch(getAllBookings());
      dispatch({
        type: CRUD_STAY,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getAllDailyReport() {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/reportearrivodiario`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_DAILY_REPORT,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getAllRooms() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/habitacion`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_ROOMS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getAllAirline() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/aerolinea`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_AIRLINE,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getAllRoomClass() {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/clasehabitacion`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_ROOM_CLASS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function searchPerson(search, option = true) {
  if (!search) {
    return (dispatch) =>
      dispatch({
        type: SEARCH_PERSON,
        payload: [],
      });
  }
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/persona/search?parametro=${search}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (option) {
        dispatch(Actions.searchCustomerLoading(false));
      }
      /* console.log(response.data.detalles); */
      dispatch({
        type: SEARCH_PERSON,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function searchCustomerLoading(flag) {
  return {
    type: SEARCH_CUSTOMER_LOADING,
    payload: flag,
  };
}

export function searchGuestLoading(flag) {
  return {
    type: SEARCH_GUEST_LOADING,
    payload: flag,
  };
}

export function saveCustomer(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rapersona`,
    form
  );
  console.log(form);
  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: SAVE_CUSTOMER,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}

export function saveGuest(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rapersona`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: SAVE_GUEST,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}

export function setSavedCustomer(flag) {
  return {
    type: SET_SAVED_CUSTOMER,
    payload: flag,
  };
}

export function setSavedGuest(flag) {
  return {
    type: SET_SAVED_GUEST,
    payload: flag,
  };
}

export function saveBooking(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/reserva`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllBookings());
      dispatch(Actions.closeBookingForm(true));

      dispatch({
        type: SAVE_BOOKING,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}

export function getAllBookings() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/reserva`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_BOOKINGS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function moveBooking(booking) {
  const request = axios.post(`${process.env.REACT_APP_API_URL}/api/pfreserva`, {
    reserva_estancia_id: booking.booking_id,
    f1: booking.start.split(" ")[0],
    f2: booking.end.split(" ")[0],
    h: booking.room_id,
  });

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllBookings());

      dispatch({
        type: MOVE_BOOKING,
      });
    });
}

export function deleteBooking(form) {
  const request = axios.post(`${process.env.REACT_APP_API_URL}/api/dreserva`, {
    reserva_estancia_id: form.reserva_estancia_id,
  });

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllBookings());
      dispatch({
        type: DELETE_BOOKING,
      });
    });
}

export function getAllPackages() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/paquetes`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_PACKAGES,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function closeBookingForm(flag) {
  return {
    type: CLOSE_BOOKING_FORM,
    payload: flag,
  };
}

export function getFlightsByBooking(booking) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gvuelos/${booking}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_FLIGHTS_BY_BOOKING,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getGuestsByBooking(booking) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/ghuespedes/${booking}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_GUESTS_BY_BOOKING,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function saveFlightByBooking(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rvuelor`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getFlightsByBooking(form.reserva_estancia_id));
      dispatch({
        type: SAVE_FLIGHT_BY_BOOKING,
      });
    });
}

export function deleteFlightByBooking(form) {
  const request = axios.post(`${process.env.REACT_APP_API_URL}/api/dvuelor`, {
    reserva_estancia_vuelo_id: form.reserva_estancia_vuelo_id,
  });

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getFlightsByBooking(form.reserva_estancia_id));
      dispatch({
        type: DELETE_FLIGHT_BY_BOOKING,
      });
    });
}

export function saveGuestByBooking(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rhuespedr`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getGuestsByBooking(form.reserva_estancia_id));
      dispatch({
        type: SAVE_GUEST_BY_BOOKING,
      });
    });
}

export function deleteGuestByBooking(form) {
  const request = axios.post(`${process.env.REACT_APP_API_URL}/api/dhuespedr`, {
    reserva_estancia_huesped_id: form.reserva_estancia_huesped_id,
  });

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getGuestsByBooking(form.reserva_estancia_id));
      dispatch({
        type: DELETE_GUEST_BY_BOOKING,
      });
    });
}

export function getOriginDestination() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/gprode`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ORIGIN_DESTINATION,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getAllOccupation() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/gprofesion`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_OCCUPATION,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function saveExtra(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/pelhreserva`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllBookings());
      dispatch({
        type: SAVE_EXTRA,
      });
    });
}

export function getExtra(booking) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gextrasel/${booking}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_EXTRA,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getPaymentsByBooking(booking) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gpagos/${booking}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_PAYMENTS_BY_BOOKING,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function savePaymentByBooking(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rpagos`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      if (response.data.status !== 200) {
        dispatch(Actions.setSavedPayment(false));
      } else {
        dispatch(Actions.setSavedPayment(true));
        dispatch(Actions.getPaymentsByBooking(form.reserva_estancia_id));
        dispatch(Actions.getAllBookings());
      }

      dispatch({
        type: SAVE_PAYMENT_BY_BOOKING,
      });
    });
}

export function deletePaymentByBooking(form) {
  const request = axios.post(`${process.env.REACT_APP_API_URL}/api/dpagos`, {
    pago_id: form.pago_id,
  });

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getPaymentsByBooking(form.reserva_estancia_id));
      dispatch(Actions.getAllBookings());
      dispatch({
        type: DELETE_PAYMENT_BY_BOOKING,
      });
    });
}

export function getAllBanks() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/bancos`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_BANKS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function setSavedPayment(flag) {
  return {
    type: SET_SAVED_PAYMENT,
    payload: flag,
  };
}
export function resetRoomsBooKing() {
  return (dispatch) =>
    dispatch({
      type: RESET_ROOMS_BOOKING,
    });
}
export function doCheckIn(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/checkin`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllBookings());
      dispatch({
        type: DO_CHECK_IN,
      });
    });
}

export function doCheckOut(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/checkout`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllBookings());
      dispatch({
        type: DO_CHECK_OUT,
      });
    });
}

export function getSaleChannel() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/canales`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_SALE_CHANNEL,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getAllEmployees() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/empleado`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_EMPLOYEES,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function getAllConsumeByRoom(id, tipo) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gpncm/${id}/${tipo}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_ALL_CONSUME_BY_ROOM,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function searchProduct(search) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gprod?param=${search}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch(Actions.searchProductLoading(false));
      dispatch({
        type: SEARCH_PRODUCT,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function searchProductLoading(flag) {
  return {
    type: SEARCH_PRODUCT_LOADING,
    payload: flag,
  };
}

export function saveConsumeByBooking(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rpncm`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      if (response.data.status !== 200) {
        dispatch(Actions.setSavedConsume(false));
      } else {
        dispatch(Actions.setSavedConsume(true));
        dispatch(Actions.getAllConsumeByRoom(form.reserva_estancia_id, "CS"));
      }

      dispatch({
        type: SAVE_CONSUME_BY_BOOKING,
      });
    });
}

export function setSavedConsume(flag) {
  return {
    type: SET_SAVED_CONSUME,
    payload: flag,
  };
}

export function deleteConsumeByBooking(form) {
  const request = axios.post(`${process.env.REACT_APP_API_URL}/api/dpncm`, {
    pedido_nota_consumo_maestro_id: form.pedido_nota_consumo_maestro_id,
  });

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllConsumeByRoom(form.reserva_estancia_id, "CS"));
      dispatch({
        type: DELETE_CONSUME_BY_BOOKING,
      });
    });
}

export function getDetailByBooking(booking) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/greservapth?param=${booking}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_DETAIL_BY_BOOKING,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}

export function saveDetailByBooking(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/ureservapth`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch(Actions.getAllBookings());
      dispatch({
        type: SAVE_DETAIL_BY_BOOKING,
      });
    });
}

export function getResumeByBooking(booking) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/rresumen?param=${booking}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      dispatch({
        type: GET_RESUME_BY_BOOKING,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
