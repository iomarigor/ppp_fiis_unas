import axios from "axios";
import * as Actions from ".";
import * as Actionss from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_LIST_MANAGEMENT_DRIVER="[MANAGEMENT DRIVER] GET LIST MANAGEMENT DRIVER";
export const SAVE_MANAGEMENT_DRIVER="[MANAGEMENT DRIVER] SAVE MANAGEMENT DRIVER";
export const UPDATE_MANAGEMENT_DRIVER="[MANAGEMENT DRIVER] UPDATE MANAGEMENT DRIVER";
export const DELETE_MANAGEMENT_DRIVER="[MANAGEMENT DRIVER] DELETE MANAGEMENT DRIVER";
export const CRUD_MANAGEMENT_DRIVER="[MANAGEMENT DRIVER] CRUD MANAGEMENT DRIVER";
  export function getManagementDriver() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/transportista`);
    
    return dispatch =>
      request.then(response =>{
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            return dispatch(Actionss.logoutUser());
          }
          return;
        }
        return dispatch({
            type: GET_LIST_MANAGEMENT_DRIVER,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  export function saveManagementDriver(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/rtransportista`,
      form
    );
  
    return dispatch =>
      request.then(response => {
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
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
        dispatch({
          type: CRUD_MANAGEMENT_DRIVER,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }
  export function updateManagementDriver(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/atransportista`,
      form
    );
  
    return dispatch =>
      request.then(response => {
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
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
        dispatch(getManagementDriver());
        dispatch({
          type: CRUD_MANAGEMENT_DRIVER,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }
  export function deleteManagementDriver(form) {
    const request = axios.get(
      `${process.env.REACT_APP_API_URL}/api/etransportista/${form.idtransportista}`,
      form
    );
  
    return dispatch =>
      request.then(response => {
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
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
          type: CRUD_MANAGEMENT_DRIVER,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }