import axios from "axios";
import * as Actions from "../app";
import * as Actionss from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_LIST_MENUS="[MENU CONTROL] GET LIST MENU CONTROL";
export const GET_LIST_MENUS_PADRES="[MENU CONTROL] GET LIST MENU PADRES";
export const GET_LIST_MENUS_HIJOS="[MENU CONTROL] GET LIST MENU HIJOS";
export const SAVE_MENU_CONTROL="[MENU CONTROL] SAVE MENU CONTROL";
export const UPDATE_MENU_CONTROL="[MENU CONTROL] UPDATE MENU CONTROL";
export function getMenuControl() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/menu`);
    
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
            type: GET_LIST_MENUS,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  export function getMenuPadres() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/menupadres`);
    
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
            type: GET_LIST_MENUS_PADRES,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  export function getMenus() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/menus`);
    
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
            type: GET_LIST_MENUS_HIJOS,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  export function saveMenu(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/rmenu`,
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
          type: SAVE_MENU_CONTROL,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }
  export function updateMenu(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/amenu`,
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
          type: UPDATE_MENU_CONTROL,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }
  export function deleteMenu(form) {
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/emenu`,
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
          type: UPDATE_MENU_CONTROL,
          payload: response.data.detalles ? response.data.detalles : null
        });
      });
  }