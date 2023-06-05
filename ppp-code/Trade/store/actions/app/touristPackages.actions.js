import axios from "axios";
import * as Actions from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_ALL_TOURIST_PACKAGES="[TOURIST PACKAGES] GET ALL TOURIST PACKAGES";
export const GET_ALL_TYPE_ROOM="[TYPE ROOM] GET ALL TYPE ROOM";
export const CRUD_TOURIST_PACKAGES="[TOURIST PACKAGES] CRUD TOURIST PACKAGES";

export function getAllTouristPackages() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/paquetes`);
    
    return dispatch =>
      request.then(response =>{
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            return dispatch(Actions.logoutUser());
          }
          return;
        }
        
        return dispatch({
            type: GET_ALL_TOURIST_PACKAGES,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllTypeRoom() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/tipohabitacion`);
    
    return dispatch =>
      request.then(response =>{
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            return dispatch(Actions.logoutUser());
          }
          return;
        }
        
        return dispatch({
            type: GET_ALL_TYPE_ROOM,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function saveTouristPackages(form){
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/rpaquetes`,
        form
      );
    
      return dispatch =>
        request.then(response => {
          if(parseInt(response.data.status)===404){
            if((localStorage.getItem('access_token'))){
              console.log(response.data.detalle);
              localStorage.removeItem('access_token');
              delete axios.defaults.headers.common['Authorization'];
              return dispatch(Actions.logoutUser());
            }
            return;
          }
          if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
          } else {
            toast.error(response.data.mensaje);
          }
    
          dispatch({
            type: CRUD_TOURIST_PACKAGES,
            payload: response.data.mensaje ? response.data.mensaje : null,
          });
      });
}
export function updateTouristPackages(form){
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/apaquetes`,
        form
      );
    
      return dispatch =>
        request.then(response => {
          if(parseInt(response.data.status)===404){
            if((localStorage.getItem('access_token'))){
              console.log(response.data.detalle);
              localStorage.removeItem('access_token');
              delete axios.defaults.headers.common['Authorization'];
              return dispatch(Actions.logoutUser());
            }
            return;
          }
          if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
          } else {
            toast.error(response.data.mensaje);
          }
    
          dispatch({
            type: CRUD_TOURIST_PACKAGES,
            payload: response.data.mensaje ? response.data.mensaje : null,
          });
      });
}
export function deleteTouristPackages(form){
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/epaquetes`,
        form
      );
    
      return dispatch =>
        request.then(response => {
          if(parseInt(response.data.status)===404){
            if((localStorage.getItem('access_token'))){
              console.log(response.data.detalle);
              localStorage.removeItem('access_token');
              delete axios.defaults.headers.common['Authorization'];
              return dispatch(Actions.logoutUser());
            }
            return;
          }
          if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
          } else {
            toast.error(response.data.mensaje);
          }
    
          dispatch({
            type: CRUD_TOURIST_PACKAGES,
            payload: response.data.mensaje ? response.data.mensaje : null,
          });
      });
}
export function updateStatusByTouristPackage(form){
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/cpaquetes`,
        form
      );
    
      return dispatch =>
        request.then(response => {
          if(parseInt(response.data.status)===404){
            if((localStorage.getItem('access_token'))){
              console.log(response.data.detalle);
              localStorage.removeItem('access_token');
              delete axios.defaults.headers.common['Authorization'];
              return dispatch(Actions.logoutUser());
            }
            return;
          }
          if (response.data.status === 200) {
            (form.estado===1) ? toast.success(response.data.mensaje): toast.error(response.data.mensaje);            
          } else {
            toast.error(response.data.mensaje);
          }
    
          dispatch({
            type: CRUD_TOURIST_PACKAGES,
            payload: response.data.mensaje ? response.data.mensaje : null,
          });
      });
}