import axios from "axios";
import * as Actions from 'components/auth/store/actions';
import { toast } from 'react-toastify';
export const GET_ALL_EXPENSES_RECEIPT="[EXPENSES RECEIPT] GET ALL EXPENSES RECEIPT";
export const CRUD_EXPENSES="[EXPENSES RECEIPT] CRUD EXPENSES";
export function getAllExpensesReceipt() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/cajachica?tipo=E`);
    
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
            type: GET_ALL_EXPENSES_RECEIPT,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
  }
  export function saveExpenses(from) {
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
            toast.success(response.data.mensaje);            
        } else {
            toast.error(response.data.mensaje);
        }
        return dispatch({
            type: CRUD_EXPENSES,
            payload: response.data.mensaje ? response.data.mensaje : null,          
            })
        }
      );
}
export function updateStatusExpenses(from) {
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
          type: CRUD_EXPENSES,
          payload: response.data.mensaje ? response.data.mensaje : null,          
          })
      }
    );
}
export function updateExpenses(form) {
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
        type: CRUD_EXPENSES,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}