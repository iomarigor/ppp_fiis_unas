import axios from "axios";
import * as Actionss from "components/auth/store/actions";

import { toast } from "react-toastify";
export const GET_LIST_ADVANCE_SHIFT = "[ADVANCE SHIFT] GET LIST ADVANCE SHIFT";
export const CRUD_ADVANCE_SHIFT = "[ADVANCE SHIFT] CRUD ADVANCE SHIFT";
export function getAdvanceShift() {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/adelantoturno`
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
      return dispatch({
        type: GET_LIST_ADVANCE_SHIFT,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function saveAdvanceShift(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/radelantoturno`,
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
      window.open(
        `${process.env.REACT_APP_API_URL}/api/adelantoturno/${response.data.detalles.idadelantoturno}`,
        "_blank"
      );
      dispatch({
        type: CRUD_ADVANCE_SHIFT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateAdvanceShift(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aadelantoturno`,
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
      /* getMenuControl(); */
      return dispatch({
        type: CRUD_ADVANCE_SHIFT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function deleteAdvanceShift(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/eadelantoturno/${form.idadelantoturno}`,
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
      console.log(response.data.detalles);
      /* getMenuControl(); */
      dispatch({
        type: CRUD_ADVANCE_SHIFT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
