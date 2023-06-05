import axios from "axios";
import * as Actions from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_ALL_INCOME_RECEIPT="[MANAGE CASH] GET ALL INCOME RECEIPT";
export const CRUD_INCOME="[INCOME RECEIPT] CRUD INCOME";
export function getAllIncomeReceipt() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/cajachica?tipo=I`);
    
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
            type: GET_ALL_INCOME_RECEIPT,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
  }
  export function saveIncome(from) {
    const request = axios.post(
        `${process.env.REACT_APP_API_URL}/api/rcajachica`,
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
          console.log(response.data);
            //toast.success(response.data.mensaje);            
        } else {
           //toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_INCOME,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function updateStatusIncome(from) {
  const request = axios.post(
      `${process.env.REACT_APP_API_URL}/api/ccajachica`,
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
        from.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);
      } else {
          toast.error(response.data.mensaje);
      }
      return dispatch({
          type: CRUD_INCOME,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function updateIncome(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/acajachica`,
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
        type: CRUD_INCOME,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}