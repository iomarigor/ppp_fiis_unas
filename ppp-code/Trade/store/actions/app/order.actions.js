import axios from "axios";
import * as Actions from "../app";
import * as Actionss from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_LIST_ORDERS="[ORDER] GET LIST ORDERS";
export const GET_LIST_ROOM_ORDERS="[ORDER] GET LIST ROOM ORDERS";
export const GET_DETAIL_ORDERS="[ORDER] GET DETAIL ORDERS";
export const SEARCH_ROOM="[ORDER] SEARCH_ROOM";
export const SEARCH_ROOM_CUSTOMER_LOADING="[ORDER] SEARCH ROOM CUSTOMER LOADING";
export const CRUD_ORDERS="[ORDER] CRUD ORDERS";
export function getListOrders() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/pedidos`);
    
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
            type: GET_LIST_ORDERS,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  
  export function getDetailOrders(form) {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/cpedido/${form}`);
    //console.log('test');
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
            type: GET_DETAIL_ORDERS,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  }
  export function searchRoom(search,option=true) {
    console.log(search);
    const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/chabitacionpedido?parametro=${search}`
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
        //console.log(response.data);
        if(option){
          dispatch(Actions.searchRoomCustomerLoading(false));

        }
        dispatch({
          type: SEARCH_ROOM,
          payload: response.data.detalles === null ? [] : response.data.detalles
        });
      });
  }
  export function searchRoomCustomerLoading(flag) {
    return {
      type: SEARCH_ROOM_CUSTOMER_LOADING,
      payload: flag
    };
  }
  export function saveOrder(from) {
    console.log("test")
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/rpedidoform`,
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
            type: CRUD_ORDERS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
  }
  export function updateOrder(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/apedidoform`,
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
            type: CRUD_ORDERS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
  }
  export function deleteOrder(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/epedido`,
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
            type: CRUD_ORDERS,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
  }
  