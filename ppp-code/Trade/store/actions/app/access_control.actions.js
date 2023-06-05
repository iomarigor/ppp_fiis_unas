import axios from "axios";
import * as Actions from "../app";
import * as Actionss from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_LIST_ACCESS_CONTROL="[ACCESS_CONTROL] GET LIST ACCESS";
export const CRUD_ACCESS_CONTROL="[ACCESS_CONTROL] CRUD ACCESS";
export function getAccessControl() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/usuariomenu`);
    
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
            type: GET_LIST_ACCESS_CONTROL,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
}
export function saveUsuarioMenu(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/rusuariomenu`,
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
          type: CRUD_ACCESS_CONTROL,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }
  export function updateUsuarioMenu(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/ausuariomenu`,
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
        dispatch({
          type: CRUD_ACCESS_CONTROL,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }
  export function deleteUsuarioMenu(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/eusuariomenu`,
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
          type: CRUD_ACCESS_CONTROL,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }