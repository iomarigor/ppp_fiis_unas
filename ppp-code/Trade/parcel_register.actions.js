import axios from "axios";
import * as Actionss from "components/auth/store/actions";

import { toast } from "react-toastify";
export const GET_LIST_PARCEL_REGISTER =
  "[PARCEL REGISTER] GET LIST PARCEL REGISTER";
export const GET_LIST_PARCEL_REGISTER_DETAIL =
  "[PARCEL REGISTER] GET LIST PARCEL REGISTER DETAIL";
export const CRUD_PARCEL_REGISTER = "[PARCEL REGISTER] CRUD PARCEL REGISTER";
export const PARCEL_SEARCH = "[PARCEL REGISTER] PARCEL SEARCH";
export const PARCEL_SEARCH_LOADER = "[PARCEL REGISTER] PARCEL SEARCH LOADER";
export function getParcelRegister() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/encomienda`);

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
        type: GET_LIST_PARCEL_REGISTER,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getParcelRegisterDetail(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gencomienda/${form.id_encomienda}`
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
        type: GET_LIST_PARCEL_REGISTER_DETAIL,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function saveParcelRegister(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rencomienda`,
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
        window.open(
          `${process.env.REACT_APP_API_URL}/api/encomienda/${response.data.detalles.id_encomienda}`,
          "_blank"
        );
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_PARCEL_REGISTER,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateParcelRegister(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aencomienda`,
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
        type: CRUD_PARCEL_REGISTER,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function searchParcelLoader(status) {
  return {
    type: PARCEL_SEARCH_LOADER,
    payload: status,
  };
}
export function searchParcelRegister(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rastrearencomienda`,
    form
  );

  return (dispatch) => {
    dispatch(searchParcelLoader(true));
    return request.then((response) => {
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
      } else {
        toast.error(response.data.mensaje);
      }
      dispatch(searchParcelLoader(false));
      return dispatch({
        type: PARCEL_SEARCH,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
  };
}
export function updateStatusParcelRegister(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aencomiendaestado`,
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
        type: CRUD_PARCEL_REGISTER,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function deleteParcelRegister(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/eencomienda/${form.idadelantoturno}`,
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
        type: CRUD_PARCEL_REGISTER,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function saveSalesParcel(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rfacturacionencomienda`,
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
          return dispatch(Actionss.logoutUser());
        }
        return;
      }
      if (response.data.status === 200) {
        toast.success(response.data.mensaje);
        console.log(response.data);
        window.open(
          `${process.env.REACT_APP_API_URL}/api/factura/1/${response.data.detalles.facturacion_id}`,
          "_blank"
        );
      } else {
        toast.error(response.data.mensaje);
      }
      return dispatch({
        type: CRUD_PARCEL_REGISTER,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
