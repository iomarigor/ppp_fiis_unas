import axios from "axios";
import * as Actions from "components/auth/store/actions";
import { toast } from "react-toastify";
export const GET_ALL_OPENINGS = "[MANAGE CASH] GET ALL OPENINGS";
export const GET_PRICE_DOLLAR = "[MANAGE CASH] GET PRICE DOLLAR";
export const CRUD_OPENINGS = "[MANAGE CASH] CRUD OPENING";

export function getPriceDollar() {
  const now = new Date();
  const day = ("0" + now.getDate()).slice(-2);
  const month = ("0" + (now.getMonth() + 1)).slice(-2);

  const request = axios.get(
    `https://api.apis.net.pe/v1/tipo-cambio-sunat?fecha=${
      now.getFullYear() + "-" + month + "-" + day
    }`,
    { withCredentials: false, headers: { "Access-Control-Allow-Origin": "*" } }
  );

  return (dispatch) =>
    request.then((response) => {
      return dispatch({
        type: GET_PRICE_DOLLAR,
        payload: response.data.venta,
      });
    });
}
export function getAllOpenings(iduser = null) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/apertura/${iduser ? iduser : ""}`
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
        type: GET_ALL_OPENINGS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function saveOpening(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rapertura`,
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
        type: CRUD_OPENINGS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateOpenings(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aapertura`,
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
        type: CRUD_OPENINGS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function deleteOpenings(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/eapertura`,
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
        type: CRUD_OPENINGS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function closeOpening(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aaperturacierre`,
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
        type: CRUD_OPENINGS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
