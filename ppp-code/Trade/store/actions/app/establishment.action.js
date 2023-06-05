import axios from "axios";
import * as Actions from "components/auth/store/actions";
import { toast } from "react-toastify";
export const GET_DATA_ESTABLISHMENT = "[ESTABLISHMENT] GET DATA ESTABLISHMENT";
export const CRUD_ESTABLISHMENT = "[ESTABLISHMENT] CRUD ESTABLISHMENT";
export const GET_DATA_BRANCHS = "[ESTABLISHMENT] GET DATA BRANCHS";
export const CRUD_BRANCHS = "[ESTABLISHMENT] CRUD BRANCHS";
export const GET_DATA_BRANCH_OPTIONS =
  "[ESTABLISHMENT] GET DATA BRANCH OPTIONS";
export const CRUD_BRANCHS_OPTIONS = "[ESTABLISHMENT] CRUD BRANCHS OPTIONS";
export const RESET_DATA_BRANCH_OPTIONS =
  "[ESTABLISHMENT] RESET DATA BRANCH OPTIONS";
export function resetDataBranchOptions() {
  console.log("RESET");
  return (dispatch) => {
    dispatch({
      type: RESET_DATA_BRANCH_OPTIONS,
      payload: null,
    });
  };
}
export function getDataBranchOptions(form) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gopciones/${form}`
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
        type: GET_DATA_BRANCH_OPTIONS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function saveDataBranchOptions(from) {
  toast.info("Guardando...", {
    toastId: "saveDataBranchOptions",
    autoClose: 10000,
  });
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/ropciones`,
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
      toast.update("saveDataBranchOptions", {
        render: response.data.mensaje,
        type: response.data.status == 200 ? "success" : "error",
        isLoading: false,
        autoClose: 2000,
      });
      return dispatch({
        type: CRUD_BRANCHS_OPTIONS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function getDataEstablishment() {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/establecimiento`
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
        type: GET_DATA_ESTABLISHMENT,
        payload:
          response.data.detalles === null ? null : response.data.detalles,
      });
    });
}
export function getDataBranchs() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/esucursal`);

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
        type: GET_DATA_BRANCHS,
        payload:
          response.data.detalles === null ? null : response.data.detalles,
      });
    });
}
export function saveDataEstablishment(from) {
  console.log(JSON.stringify(from));
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/raestablecimiento`,
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
        type: CRUD_ESTABLISHMENT,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function saveDataBranch(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/resucursal`,
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
        type: CRUD_BRANCHS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateDataBranch(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aesucursal`,
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
        type: CRUD_BRANCHS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function deleteDataBranch(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/eesucursal`,
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
        type: CRUD_BRANCHS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateStatusBranch(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cesucursal`,
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
        type: CRUD_BRANCHS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
