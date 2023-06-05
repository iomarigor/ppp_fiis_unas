import axios from "axios";
import * as Actionss from "components/auth/store/actions";

import { toast } from "react-toastify";
export const GET_LIST_EXIT_VEHICLES = "[EXIT VEHICLES] GET LIST EXIT VEHICLES";
export const GET_LIST_REPORT_EXIT_VEHICLES =
  "[EXIT VEHICLES] GET LIST REPORT EXIT VEHICLES";
export const CRUD_EXIT_VEHICLES = "[EXIT VEHICLES] CRUD EXIT VEHICLES";
export function getExitReportVehicles(from) {
  if (!from) {
    return (dispatch) =>
      dispatch({
        type: GET_LIST_REPORT_EXIT_VEHICLES,
        payload: null,
      });
  }
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/reporte_salida_vehiculos`,
    from
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
        type: GET_LIST_REPORT_EXIT_VEHICLES,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getExitVehicles() {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/salidavehiculos`
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
        type: GET_LIST_EXIT_VEHICLES,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function saveExitVehicles(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rsalidavehiculos`,
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
        `${process.env.REACT_APP_API_URL}/api/salidavehiculos/${response.data.detalles.idsalidavehiculos}`,
        "_blank"
      );
      /* getMenuControl(); */
      dispatch({
        type: CRUD_EXIT_VEHICLES,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateExitVehicles(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/asalidavehiculos`,
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
        type: CRUD_EXIT_VEHICLES,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function deleteExitVehicles(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/esalidavehiculos/${form.idsalidavehiculos}`,
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
        type: CRUD_EXIT_VEHICLES,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
