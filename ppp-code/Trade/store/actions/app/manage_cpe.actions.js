import axios from "axios";
import * as Actions from "components/auth/store/actions";
import { toast } from "react-toastify";
export const GENERATE_VOUCHER = "[MANAGE CPE] GENERATE VOUCHER";

export function generateVoucher(from, iduser) {
  toast.info("Generando...", {
    toastId: "generateVoucher",
    autoClose: 10000,
  });
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/generacomprobante`,
    from
  );
  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          //console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      /* response.data.facturaid=facturaid; */
      toast.update("generateVoucher", {
        render: response.data.mensaje,
        type: response.data.status == 200 ? "success" : "error",
        isLoading: false,
        autoClose: 2000,
      });

      //return  dispatch(registerVoucher(response.data));
      if (from.tipo_documento == 1) {
        return dispatch(getAllSales(iduser));
      } else {
        return dispatch(listCreditNote());
      }
    });
}
export function firmarVoucher(from, iduser) {
  toast.info("Firmando...", {
    toastId: "firmarVoucher",
    autoClose: 10000,
  });
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/firmacomprobante`,
    from
  );
  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          //console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      /* response.data.facturaid=facturaid; */
      toast.update("firmarVoucher", {
        render: response.data.mensaje,
        type: response.data.status == 200 ? "success" : "error",
        isLoading: false,
        autoClose: 2000,
      });

      //return  dispatch(registerVoucher(response.data));
      if (from.tipo_documento == 1) {
        return dispatch(getAllSales(iduser));
      } else {
        return dispatch(listCreditNote());
      }
    });
}
export function enviarVoucher(from, iduser) {
  toast.info("Enviando...", {
    toastId: "enviarVoucher",
    autoClose: 10000,
  });
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/enviarcomprobante`,
    from
  );
  return (dispatch) =>
    request.then((response) => {
      if (parseInt(response.data.status) === 404) {
        if (localStorage.getItem("access_token")) {
          //console.log(response.data.detalle);
          localStorage.removeItem("access_token");
          delete axios.defaults.headers.common["Authorization"];
          return dispatch(Actions.logoutUser());
        }
        return;
      }
      /* response.data.facturaid=facturaid; */
      toast.update("enviarVoucher", {
        render: response.data.mensaje,
        type: response.data.status == 200 ? "success" : "error",
        isLoading: false,
        autoClose: 2000,
      });

      //return  dispatch(registerVoucher(response.data));
      if (from.tipo_documento == 1) {
        return dispatch(getAllSales(iduser));
      } else {
        return dispatch(listCreditNote());
      }
    });
}
function getAllSales(iduser = null) {
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
        type: "[SALES] GET SALES LIST",
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
function listCreditNote() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/notacredito`);

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
        type: "[CREDIT_NOTE] GET LIST CREDIT NOTE",
        payload: response.data.detalles === null ? [] : response.data.detalles,
      });
    });
}
