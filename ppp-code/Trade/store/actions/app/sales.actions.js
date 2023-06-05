import axios from "axios";
import * as Actions from "components/auth/store/actions";

import { toast } from "react-toastify";
export const GET_DATA_TYPE_PAYMENT = "[SALES] GET ALL TYPE PAYMENT";
export const GET_DATA_TYPE_PAYMENT_FROMS = "[SALES] GET ALL TYPE PAYMENT FROMS";
export const GET_DATA_SERIES_VOUCHER = "[SALES] GET ALL DATA SERIES BY VOUCHER";
export const GET_DATA_CORRELATIVE_SERIES_VOUCHER =
  "[SALES] GET DATA CORRELATIVE SERIES BY VOUCHER";
export const GET_DATA_COIN_TYPE = "[SALES] GET DATA COIN TYPE";
export const GET_SALES_LIST = "[SALES] GET SALES LIST";
export const GET_SALES_INFO = "[SALES] GET SALES INFO";
export const CRUD_SALES = "[SALES] CRUD SALES";
export const GET_PRICE_DOLLAR_SALES = "[SALES] GET PRICE DOLLAR";
export const GET_DATA_RESERVATION_RESIDENCE =
  "[SALES] GET ALL RESERVATION RESIDENCE";
export const GET_DATA_RESERVATION_RESIDENCE_CONSUMPTION_STAY =
  "[SALES] GET DATA RESERVATION RESIDENCE CONSUMPTION STAY";
export function updateStatusBySales(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cfacturacion`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        form.estado_venta === 1
          ? toast.success(response.data.mensaje)
          : toast.error(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_SALES,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateSales(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/afacturacion`,
    form
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_SALES,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function getInfoSales(from) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/facturadetalle/${from}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      return dispatch({
        type: GET_SALES_INFO,
        payload: response.data.detalles === null ? {} : response.data.detalles,
      });
    });
}
export function saveSales(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rfacturacion`,
    from
  );

  return (dispatch) =>
    request.then((response) => {
      console.log(response.data.detalle);

      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
        console.log(response.data);
        /* window.open(
            `${process.env.REACT_APP_API_URL}/api/factura/${response.data.facturacion.facturacion_id}`,
            "_blank"
          ); */
        window.open(
          `${process.env.REACT_APP_API_URL}/api/factura/1/${response.data.detalles.facturacion_id}`,
          "_blank"
        );
      } else {
        toast.error(response.data.mensaje);
      }
      return dispatch({
        type: CRUD_SALES,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function getAllSales(iduser = null) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/facturacion/${iduser ? iduser : ""}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }

      return dispatch({
        type: GET_SALES_LIST,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getPriceDollar() {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/preciodollar`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      return dispatch({
        type: GET_PRICE_DOLLAR_SALES,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function deleteSales(idSales) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/dfacturacion/${idSales}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
        console.log(response.data);
      } else {
        toast.error(response.data.mensaje);
      }
      return dispatch({
        type: CRUD_SALES,
        payload: response.data.mensaje === null ? [] : response.data.mensaje,
      });
    });
}
export function getAllCoinType() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/tipomoneda`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      return dispatch({
        type: GET_DATA_COIN_TYPE,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getCorrelativeSeriesVoucher(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/seriexcomprobantexusuario/${form.idUser}/${form.idVoucher}/${form.idSerie}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      return dispatch({
        type: GET_DATA_CORRELATIVE_SERIES_VOUCHER,
        payload: response.data.detalles === null ? {} : response.data.detalles,
      });
    });
}
export function getAllSeriesVoucher(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/seriexcomprobante/${form.idUser}/${form.idVoucher}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      return dispatch({
        type: GET_DATA_SERIES_VOUCHER,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getAllTypesPayments() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/tipopago`);

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }

      return dispatch({
        type: GET_DATA_TYPE_PAYMENT,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getAllTypesPaymentsFroms(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/tipoformapago/${form}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }

      return dispatch({
        type: GET_DATA_TYPE_PAYMENT_FROMS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getAllReservationResidence() {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/creservaestancialist`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }

      return dispatch({
        type: GET_DATA_RESERVATION_RESIDENCE,
        payload:
          response.data.detalles.reserva === null
            ? []
            : response.data.detalles.reserva,
      });
    });
}
export function getAllReservationResidenceConsumptionStay(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/cconsumopagolist/${form}`
  );

  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }

      return dispatch({
        type: GET_DATA_RESERVATION_RESIDENCE_CONSUMPTION_STAY,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
