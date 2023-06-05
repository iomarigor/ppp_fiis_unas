import axios from "axios";
import * as Actions from "components/auth/store/actions";

import { toast } from "react-toastify";
export const GET_ALL_DASHBOARD = "[DASHBOARD] GET ALL DASHBOARD";
export function getAllDashboard(iduser = null) {
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/dashboard/${iduser ? iduser : ""}`
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
      if (response.data.status === 400) {
        toast.error(response.data.mensaje);
      }
      return dispatch({
        type: GET_ALL_DASHBOARD,
        payload:
          response.data.detalles === null ? null : response.data.detalles,
      });
    });
}
