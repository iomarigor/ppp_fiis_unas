import axios from "axios";
//import history from '@history';
import * as Actions from 'components/auth/store/actions';

import { toast } from 'react-toastify';
export const GET_ALL_PRODUCTS = "[PRODUCTS] GET ALL PRODUCTS";
export const GET_ALL_SORTS = "[PRODUCTS] GET ALL SORTS";
export const GET_ALL_SUBSORTS = "[PRODUCTS] GET ALL SUBSORTS";
export const GET_ALL_BRANDS = "[PRODUCTS] GET ALL BRANDS";
export const GET_ALL_MATERIALS = "[PRODUCTS] GET ALL MATERIALS";
export const GET_ALL_PRESENTATIONS = "[PRODUCTS] GET ALL PRESENTATIONS";
export const GET_ALL_TYPEEXISTENCES = "[PRODUCTS] GET ALL TYPEEXISTENCES";
export const GET_ALL_UNITMEASURES = "[PRODUCTS] GET ALL UNITMEASURES";
export const GET_ALL_UNIT_MEASURES_BY_PRODUCT = "[PRODUCTS] GET ALL UNIT MEASURES BY PRODUCT";

export const GET_DATA_PRODUCT= "[PRODUCTS] GET DATA PRODUCT";
export const SAVE_PRODUCT="[PRODUCTS] SAVE PRODUCT";
export const UPDATE_PRODUCT="[PRODUCTS] UPDATE PRODUCT";
export const UPDATE_STATUS_PRODUCT="[PRODUCTS] UPDATE STATUS PRODUCT";
export const DELETE_PRODUCT="[PRODUCTS] DELETE PRODUCT";
export const CRUD_SORT= "[PRODUCTS] CRUD SORT";
export const CRUD_SUBSORT= "[PRODUCTS] CRUD SUBSORT";
export const CRUD_UNITMEASURES="[PRODUCTS] CRUD UNITMEASURES";
export const CRUD_MATERIAL="[PRODUCTS] CRUD MATERIAL";
export const CRUD_PRESENTATION="[PRODUCTS] CRUD PRESENTATION";
export const CRUD_TYPEEXISTENCE="[PRODUCTS] CRUD TYPEEXISTENCE";
export const CRUD_UNIT_MEASURES_BY_PRODUCT = "[PRODUCTS] CRUD UNIT MEASURES BY PRODUCT";
export const RESET_ATRIBUTES="[PRODUCTS] RESET ATRIBUTES";
export function resetAtributes(){
  return dispatch=>{
    dispatch({
      type: RESET_ATRIBUTES,
      payload: null,
    });
  }
}
export function deleteUnitMeasuresByProduct(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/eumproducto`,
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
        type: CRUD_UNIT_MEASURES_BY_PRODUCT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateAllUnitMeasuresByProduct(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aumproducto`,
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
        type: CRUD_UNIT_MEASURES_BY_PRODUCT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function getAllUnitMeasuresByProduct(from) {
  //console.log(from);

  const request = axios.get(`${process.env.REACT_APP_API_URL}/api/umproducto?producto_id=${from}`);
  
  return dispatch =>
    request.then(response =>{
      /* console.log(response.data.mensaje);
      console.log(response.data.detalles); */

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
          type: GET_ALL_UNIT_MEASURES_BY_PRODUCT,
          payload: response.data.detalles === null ? [] : response.data.detalles          
          })
      }
    );
}
export function getAllProducts() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/producto`);
    
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
            type: GET_ALL_PRODUCTS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllSorts() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/clase`);
    
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
            type: GET_ALL_SORTS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllSubSorts() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/subclase`);
    
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
            type: GET_ALL_SUBSORTS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllBrands() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/marca`);
    
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
            type: GET_ALL_BRANDS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllMaterials() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/material`);
    
    return dispatch =>
      request.then(response =>{
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            //console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            return dispatch(Actions.logoutUser());
          }
          return;
        }
        return dispatch({
            type: GET_ALL_MATERIALS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllPresentation() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/presentacion`);
    
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
            type: GET_ALL_PRESENTATIONS,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllTypeExistences() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/tipoexistencia`);
    
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
            type: GET_ALL_TYPEEXISTENCES,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getAllUnitMeasures() {
    const request = axios.get(`${process.env.REACT_APP_API_URL}/api/unidadmedida`);
    
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
            type: GET_ALL_UNITMEASURES,
            payload: response.data.detalles === null ? [] : response.data.detalles          
            })
        }
      );
}
export function getDataProduct(idProduct){
  const request = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gproducto/${idProduct}`
  );
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
        type: GET_DATA_PRODUCT,
        payload: response.data.detalles === null ? {} : response.data.detalles[0]      
        })
    }
  );
}
export function saveUnitMeasureProduct(form) {
  /* console.log(JSON.stringify(form));
 */
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rumproducto`,
    form
  );

  return dispatch =>
    request.then(response => {
      /* console.log(response) */
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
        type: CRUD_UNIT_MEASURES_BY_PRODUCT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function saveProduct(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rproducto`,
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
        type: SAVE_PRODUCT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateProduct(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aproducto`,
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
        type: UPDATE_PRODUCT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateStatusByProduct(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cproducto`,
    form
  );

  return dispatch =>
    request.then(response => {
      if (response.data.status === 200) {
        if(parseInt(response.data.status)===404){
          if((localStorage.getItem('access_token'))){
            console.log(response.data.detalle);
            localStorage.removeItem('access_token');
            delete axios.defaults.headers.common['Authorization'];
            return dispatch(Actions.logoutUser());
          }
          return;
        }
        form.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);;
        
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: UPDATE_STATUS_PRODUCT,
        payload: response.data.detalles ? response.data.detalles : null,
        update_status_product: form
      });
    });
}
export function deleteProduct(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/eproducto`,
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
        type: DELETE_PRODUCT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function deleteSort(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/eclase`,
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
        type: CRUD_SORT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function deleteSubSort(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/esubclase`,
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
        type: CRUD_SUBSORT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function saveSort(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rclase`,
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
        type: CRUD_SORT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function saveSubSort(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rsubclase`,
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
        getAllSubSorts();
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_SUBSORT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateSort(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aclase`,
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
        type: CRUD_SORT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateSubSort(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/asubclase`,
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
        type: CRUD_SUBSORT,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function deleteUnitMeasure(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/eunidadmedida`,
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
        type: CRUD_UNITMEASURES,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function deleteMaterial(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/ematerial`,
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
        type: CRUD_MATERIAL,
        payload: response.data.detalles
      });
    });
}
export function deletePresentation(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/epresentacion`,
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
        type: CRUD_PRESENTATION,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function deleteTypeExistence(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/etipoexistencia`,
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
        type: CRUD_TYPEEXISTENCE,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function saveUnitMeasure(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/runidadmedida`,
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
        type: CRUD_UNITMEASURES,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function saveMaterial(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rmaterial`,
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
        type: CRUD_MATERIAL,
        payload: response.data.detalles 
      });
    });
}
export function savePresentation(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rpresentacion`,
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
        type: CRUD_PRESENTATION,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function saveTypeExistence(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/rtipoexistencia`,
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
        type: CRUD_TYPEEXISTENCE,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateUnitMeasure(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/aunidadmedida`,
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
        type: CRUD_UNITMEASURES,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateMaterial(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/amaterial`,
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
        type: CRUD_MATERIAL,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updatePresentation(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/apresentacion`,
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
        type: CRUD_PRESENTATION,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateTypeExistence(form) {
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/atipoexistencia`,
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
        type: CRUD_TYPEEXISTENCE,
        payload: response.data.detalles ? response.data.detalles : null
      });
    });
}
export function updateStatusBySort(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cclase`,
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
        form.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);;
        
      } else {
        toast.error(response.data.mensaje);
      }
      dispatch({
        type: CRUD_SORT,
        payload: response.data.detalles ? response.data.detalles : null,
      });

      
    });
}
export function updateStatusBySubSort(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/csubclase`,
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
        form.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);;
        
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_SUBSORT,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateStatusByUnitMeasure(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cunidadmedida`,
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
        form.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);;
        
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_UNITMEASURES,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateStatusByMaterial(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cmaterial`,
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
        form.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);;
        
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_MATERIAL,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateStatusByPresentation(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/cpresentacion`,
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
        form.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);;
        
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_PRESENTATION,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}
export function updateStatusByTypeExistence(form){
  const request = axios.post(
    `${process.env.REACT_APP_API_URL}/api/ctipoexistencia`,
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
        form.estado===1? toast.success(response.data.mensaje):toast.error(response.data.mensaje);;
        
      } else {
        toast.error(response.data.mensaje);
      }

      dispatch({
        type: CRUD_TYPEEXISTENCE,
        payload: response.data.detalles ? response.data.detalles : null,
      });
    });
}