import axios from "axios";
import * as Actions from "components/auth/store/actions";

import { toast } from "react-toastify";
export const GET_ALL_VOUCHERS = "[VOUCHER] GET ALL VOUCHERS";
export const CRUD_VOUCHERS = "[VOUCHER] CRUD VOUCHERS";
export const VOUCHERS_SERIE_COMPROBANTE =
  "[VOUCHER] VOUCHERS SERIE COMPROBANTE";
export function getAllVouchersSerieComprobante(form) {
  if (!form) {
    return (dispatch) =>
      dispatch({
        type: VOUCHERS_SERIE_COMPROBANTE,
        payload: null,
      });
  }
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/voucher_serie_comprobante`,
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
      //console.log(response.data.detalles);
      return dispatch({
        type: VOUCHERS_SERIE_COMPROBANTE,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getAllVouchers() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/comprobante`);

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
      //console.log(response.data.detalles);
      return dispatch({
        type: GET_ALL_VOUCHERS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function deleteVoucher(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/ecomprobante`,
    from
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
      return dispatch({
        type: CRUD_VOUCHERS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function saveVoucher(from) {
  //console.log(from);
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rcomprobante`,
    from
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
      return dispatch({
        type: CRUD_VOUCHERS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateVoucher(from) {
  //console.log(from);
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/acomprobante`,
    from
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
      return dispatch({
        type: CRUD_VOUCHERS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateStatusByVoucher(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/ccomprobante`,
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
        form.estado === 1
          ? toast.success(response.data.mensaje)
          : toast.error(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_VOUCHERS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
