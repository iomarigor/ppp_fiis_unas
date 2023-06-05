import axios from "axios";
import * as Actions from "../app";
import * as Actionss from 'components/auth/store/actions';

import { toast } from 'react-toastify';
/* export const GET_LIST_DISCREPANCIES="[CREDIT_NOTE] GET LIST DISCREPANCIES";
export const GET_LIST_CREDIT_NOTE="[CREDIT_NOTE] GET LIST CREDIT NOTE";
export const SAVE_CREDIT_NOTE="[CREDIT_NOTE] SAVE CREDIT NOTE";
export const SAVE_CREDIT_NOTE_LOADING="[CREDIT_NOTE] SAVE CREDIT NOTE LOADING"; */
/* export function getDiscrepancies() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/tdiscrepancias`);
    
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
            type: GET_LIST_DISCREPANCIES,
            payload: response.data.detalles === null ? [] : response.data.detalles  
            })
        }
      );
  } */