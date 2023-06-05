import axios from "axios";
import * as Actions from "../app";
import * as Actionss from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_LIST_PROFORMAS="[PROFORMAS] GET LIST PROFORMAS";
export const CRUD_PROFORMAS="[PROFORMAS] CRUD PROFORMAS";
export const GET_DETAIL_PROFORMAS="[PROFORMAS] GET DETAIL PROFORMAS";
export function getListProformas() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/proforma`);
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
            type: GET_LIST_PROFORMAS,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  export function saveProforma(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/rproformaform`,
        from);
    
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
        if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
        } else {
            toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_PROFORMAS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
  }
  export function updateProforma(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/aproformaform`,
        from);
    
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
        if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
        } else {
            toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_PROFORMAS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
  }
  export function getDetailProformas(form) {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/cproforma/${form}`);
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
            type: GET_DETAIL_PROFORMAS,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  export function deleteProforma(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/eproforma`,
        from);
    
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
        if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
        } else {
            toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_PROFORMAS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
  }