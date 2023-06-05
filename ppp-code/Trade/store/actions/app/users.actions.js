import axios from "axios";
import * as Actions from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_ALL_USERS ="[USERS] GET ALL USERS";
export const CRUD_USERS="[USERS] CRUD USERS";
export const CRUD_SERIES_USERS="[USERS] CRUD SERIES USERS";
export const GET_DATA_ESTABLISHMENT_USER="[USERS] GET DATA ESTABLISHMEN_USER";
export const GET_DATA_SERIE_USER="[USERS] GET DATA SERIE USER";
export function saveSeriesUser(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/rusuarioserie`,
      from);
  
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
      if (response.data.status === 200) {
          toast.success(response.data.mensaje);            
      } else {
          toast.error(response.data.mensaje);
      }
      return dispatch({
          type: CRUD_SERIES_USERS,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function getDataUsersSerie() {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/usuarioserie`);
  
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
          type: GET_DATA_SERIE_USER,
          payload: response.data.detalles === null ? null : response.data.detalles    
          })
      }
    );
}
export function getDataUsersEstablishment() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/establecimiento`);
    
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
            type: GET_DATA_ESTABLISHMENT_USER,
            payload: response.data.detalles === null ? null : response.data.detalles    
            })
        }
      );
}
export function getAllUsers() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/usuario`);
    
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
            type: GET_ALL_USERS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function saveUser(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/rusuario`,
        from);
    
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
        if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
        } else {
            toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_USERS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function updateUser(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/ausuario`,
        from);
    
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
        if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
        } else {
            toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_USERS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function deleteSerieUser(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/eusuarioserie`,
      from);
  
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
      if (response.data.status === 200) {
          toast.success(response.data.mensaje);            
      } else {
          toast.error(response.data.mensaje);
      }
      return dispatch({
          type: CRUD_SERIES_USERS,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function deleteUser(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/eusuario`,
        from);
    
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
        if (response.data.status === 200) {
            toast.success(response.data.mensaje);            
        } else {
            toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_USERS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function updateStatusUsuario(form){
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/cusuario`,
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
            type: CRUD_USERS,
            payload: response.data.mensaje ? response.data.mensaje : null,
          });
      });
}
export function updateStatusSerieUsuario(form){
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/cusuarioserie`,
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
          type: CRUD_SERIES_USERS,
          payload: response.data.mensaje ? response.data.mensaje : null,
        });
    });
}