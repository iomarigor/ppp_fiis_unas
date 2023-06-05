import axios from "axios";
import * as Actions from "components/auth/store/actions";

import { toast } from "react-toastify";
export const GET_ALL_VOUCHERS = "[SERIES] GET ALL VOUCHERS";
export const GET_ALL_SERIES = "[SERIES] GET ALL SERIES";
export const CRUD_SERIES = "[SERIES] CRUD SERIES";
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

      return dispatch({
        type: GET_ALL_VOUCHERS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getAllSeries(id = -1) {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/serie/${id}`);

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
        type: GET_ALL_SERIES,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function saveSeries(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rserie`,
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
        type: CRUD_SERIES,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateSeries(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aserie`,
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
        type: CRUD_SERIES,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function deleteSeries(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/eserie`,
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
        type: CRUD_SERIES,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateStatusSeries(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cserie`,
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
        type: CRUD_SERIES,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
