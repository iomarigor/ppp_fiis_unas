import axios from "axios";
import * as Actions from "components/auth/store/actions";
import * as Actionss from "../app";

import { toast } from "react-toastify";
export const GET_ALL_CLIENTS_PROVIDERS =
  "[CLIENTSPROVIDERS] GET ALL CLIENTS PROVIDERS";
export const CRUD_CLIENTS_PROVIDERS =
  "[CLIENTSPROVIDERS] CRUD CLIENTS PROVIDERS";
export const GET_ALL_TYPE_DOCUMENTS =
  "[CLIENTSPROVIDERS] GET ALL TYPE DOCUMENTS";
export const GET_ALL_SUNAT_DNI = "[CLIENTSPROVIDERS] GET ALL SUNAT DNI";
export const GET_ALL_SUNAT_RUC = "[CLIENTSPROVIDERS] GET ALL SUNAT RUC";
export const CLIENT_SAVE_RESET = "[CLIENTSPROVIDERS] CLIENT SAVE RESET";
export const SEARCH_DNI_RUC_LOADING =
  "[CLIENTSPROVIDERS] SEARCH DNI RUC LOADING";
export function clienteSaveReset() {
  return (dispatch) =>
    dispatch({
      type: CLIENT_SAVE_RESET,
    });
}
export function getAllSunatDNI(from) {
  if (!from) {
    return (dispatch) =>
      dispatch({
        type: GET_ALL_SUNAT_DNI,
        payload: {},
      });
  }
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/consultadni/${from}`
  );
  return (dispatch) => {
    dispatch(Actionss.searchDniRucLoading(true));
    return request
      .then((response) => {
        if (response.data.status) {
          if (parseInt(response.data.status) === 404) {
            if (localStorage.getItem("access_token")) {
              console.log(response.data.detalle);
              localStorage.removeItem("access_token");
              delete axios.defaults.headers.common["Authorization"];
              return dispatch(Actions.logoutUser());
            }
            return;
          }
        }
        dispatch(Actionss.searchDniRucLoading(false));
        if (response.data.apellidoPaterno === null) {
          toast.success("Datos no encontrados");
        }

        if (response.data.success !== undefined) {
          if (!response.data.success) {
            return toast.error(response.data.message);
          }
        }

        if (response.data.success !== undefined) {
          if (!response.data.success) {
            return dispatch({
              type: GET_ALL_SUNAT_DNI,
              payload: null,
            });
          }
        }

        return dispatch({
          type: GET_ALL_SUNAT_DNI,
          payload: response.data.apellidoPaterno === null ? {} : response.data,
        });
      })
      .catch((res) => {
        //console.log(res);

        if ((res.response.status = 500)) {
          toast.warn("Error al conectar con el servidor");
          dispatch(Actionss.searchDniRucLoading(false));
        }
        //console.log("500",{...res});
      });
  };
}
export function getAllSunatRUC(from) {
  if (!from) {
    return (dispatch) =>
      dispatch({
        type: GET_ALL_SUNAT_RUC,
        payload: {},
      });
  }
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/consultaruc/${from}`
  );
  //const request = axios.get(`${process.env.REACT_APP_API_SUNAT}search?businessId=${from}&apikey=${process.env.REACT_APP_KEY_SUNAT}`);
  return (dispatch) => {
    dispatch(Actionss.searchDniRucLoading(true));
    return request
      .then((response) => {
        if (response.data.status) {
          if (parseInt(response.data.status) === 404) {
            if (localStorage.getItem("access_token")) {
              console.log(response.data.detalle);
              localStorage.removeItem("access_token");
              delete axios.defaults.headers.common["Authorization"];
              return dispatch(Actions.logoutUser());
            }
            return;
          }
        }
        dispatch(Actionss.searchDniRucLoading(false));
        console.log(response.data);
        if (!(response.data.code === 200)) {
          toast.success("Datos no encontrados");
        }

        return dispatch({
          type: GET_ALL_SUNAT_RUC,
          payload: !response.data.code === 200 ? {} : response.data.data,
        });
      })
      .catch((res) => {
        //console.log(res);

        if ((res.response.status = 500)) {
          toast.warn("Error al conectar con el servidor");
          dispatch(Actionss.searchDniRucLoading(false));
        }
        //console.log("500",{...res});
      });
  };
}
export function searchDniRucLoading(option) {
  return {
    type: SEARCH_DNI_RUC_LOADING,
    payload: option,
  };
}

export function getAllClientsProviders(from) {
  console.log("getAllClientes", from);
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gupersona/${from}`
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
        type: GET_ALL_CLIENTS_PROVIDERS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function getAllTypeDocuments() {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/tipodocumento`
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
        type: GET_ALL_TYPE_DOCUMENTS,
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
export function saveClientsProviders(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rpersonaprovedor`,
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
        type: CRUD_CLIENTS_PROVIDERS,
        payload: response.data.mensaje ? response.data : null,
      });
    });
}
export function updateClientsProviders(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/apersonaprovedor`,
    from
  );
  console.log(from);
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
        type: CRUD_CLIENTS_PROVIDERS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function deleteClientsProviders(from) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/epersonaprovedor`,
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
        type: CRUD_CLIENTS_PROVIDERS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
export function updateStatusByClientsProviders(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cpersonaprovedor`,
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
        type: CRUD_CLIENTS_PROVIDERS,
        payload: response.data.mensaje ? response.data.mensaje : null,
      });
    });
}
