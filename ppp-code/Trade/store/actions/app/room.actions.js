import axios from "axios";
import * as Actions from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_ALL_ROOMS="[ROOM] GET ALL ROOMS";
export const GET_ALL_BEDS_ROOM="[ROOM] GET ALL BEDS ROOM";
export const GET_ALL_LOCATIONS="[ROOM] GET ALL LOCATIONS";
export const CRUD_ROOM="[ROOM] CRUD ROOM";
export const CRUD_BED_ROOM="[ROOM] CRUD BED ROOM";
export const CRUD_SORT_ROOM="[ROOM] CRUD BED SORT";
export const GET_ALL_BEDS="[ROOM] GET ALL BEDS";
export const CRUD_SERVICE_ROOM="[ROOM] CRUD SERVICE ROOM";
export const GET_ALL_SERVICES="[ROOM] GET ALL SERVICES";
export const GET_ALL_SORTS_ROOM="[ROOM] GET ALL SORTS ROOM";
export const GET_ALL_SORTS_BY_ROOM="[ROOM] GET ALL SORTS BY ROOM";
export const GET_ALL_SERVICES_BY_ROOM="[ROOM] GET ALL SERVICES BY ROOM";
export function getAllRooms() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/habitacion`);
    
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
            type: GET_ALL_ROOMS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllbeds() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/cama`);
    
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
            type: GET_ALL_BEDS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllServices() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/servicio`);
    
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
            type: GET_ALL_SERVICES,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllSortsRoom() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/clasehabitacion`);
    
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
            type: GET_ALL_SORTS_ROOM,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllLocations() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ubicacion`);
    
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
            type: GET_ALL_LOCATIONS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllBedsByRoom(form) {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ghabitacioncama/${form}`);
  
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
          type: GET_ALL_BEDS_ROOM,
          payload: response.data.detalles === null ? [] : response.data.detalles          
          })
      }
    );
}
export function getAllSortsByRoom(form) {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ghabitacionclase/${form}`);
  
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
          type: GET_ALL_SORTS_BY_ROOM,
          payload: response.data.detalles === null ? [] : response.data.detalles          
          })
      }
    );
}
export function getAllServicesByRoom(form) {
  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ghabitacionservicio/${form}`);
  
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
          type: GET_ALL_SERVICES_BY_ROOM,
          payload: response.data.detalles === null ? [] : response.data.detalles          
          })
      }
    );
}
export function updateStatusByRoom(form){
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/chabitacion`,
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
          if(form.estado===1) toast.success(response.data.mensaje);
          if(form.estado===2) toast.error(response.data.mensaje);
          if(form.estado===3) toast.warn(response.data.mensaje);
          
        } else {
          toast.error(response.data.mensaje);
        }
  
        dispatch({
          type: CRUD_ROOM,
          payload: response.data.mensaje ? response.data.mensaje : null,
        });
    });
}
export function saveRoom(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/rhabitacion`,
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
            type: CRUD_ROOM,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function updateRoom(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/ahabitacion`,
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
            type: CRUD_ROOM,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function deleteRoom(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/ehabitacion`,
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
            type: CRUD_ROOM,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function saveBedByRoom(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/rhcama`,
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
          type: CRUD_BED_ROOM,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function deleteBedRoom(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/ehcama`,
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
          type: CRUD_BED_ROOM,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function saveSortByRoom(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/rhclase`,
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
          type: CRUD_SORT_ROOM,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function deleteSortRoom(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/ehclase`,
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
          type: CRUD_SORT_ROOM,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function saveServiceByRoom(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/rhservicio`,
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
          type: CRUD_SERVICE_ROOM,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function deleteServiceRoom(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/ehservicio`,
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
          type: CRUD_SERVICE_ROOM,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}