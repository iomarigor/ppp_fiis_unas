/*
    Action: Chart
    Descripción: Acciones del componente Chart de la aplicación
*/

import axios from "axios";
import * as Actions from 'components/auth/store/actions';

export const GET_CHART_SALES_BY_MONTH = "[CHART] GET CHART SALES BY MONTH";
export const GET_CHART_SALES_BY_TYPE = "[CHART] GET CHART SALES BY TYPE";
export const GET_CHART_SALES_BY_CHANNEL = "[CHART] GET CHART SALES BY CHANNEL";
export const GET_CHART_SALES_BY_CUSTOMER = "[CHART] GET CHART SALES BY CUSTOMER";
export const GET_CHART_SALES_BY_PACKAGE = "[CHART] GET CHART SALES BY PACKAGE";

export function getChartSalesByMonth(start, end) {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ecuadro01/?f1=${start}&f2=${end}`);

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
            dispatch({
                type: GET_CHART_SALES_BY_MONTH,
                payload: response.data.detalles.cuadro01 === null ? [] : response.data.detalles.cuadro01
            })
        });
}

export function getChartSalesByType(start, end) {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ecuadro02/?f1=${start}&f2=${end}`);

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
            dispatch({
                type: GET_CHART_SALES_BY_TYPE,
                payload: response.data.detalles.cuadro02 === null ? [] : response.data.detalles.cuadro01
            })
        });
}

export function getChartSalesByChannel(start, end) {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ecuadro03/?f1=${start}&f2=${end}`);

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
            dispatch({
                type: GET_CHART_SALES_BY_CHANNEL,
                payload: response.data.detalles.cuadro01 === null ? [] : response.data.detalles.cuadro01
            })
        });
}

export function getChartSalesByCustomer(start, end) {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ecuadro04/?f1=${start}&f2=${end}`);

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
            dispatch({
                type: GET_CHART_SALES_BY_CUSTOMER,
                payload: response.data.detalles.cuadro01 === null ? [] : response.data.detalles.cuadro01
            })
        });
}

export function getChartSalesByPackage(start, end) {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/ecuadro05/?f1=${start}&f2=${end}`);

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
            dispatch({
                type: GET_CHART_SALES_BY_PACKAGE,
                payload: response.data.detalles.cuadro01 === null ? [] : response.data.detalles.cuadro01
            })
        });
}