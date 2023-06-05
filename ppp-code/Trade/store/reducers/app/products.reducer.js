import * as Actions from "../../actions/app";

const initialState = {
    products: null,
    sorts:null,
    subsorts:null,
    brands:[],
    materials:null,
    presentations:null,
    typeexistences:null,
    unitmeasures:null,
    unitmeasureproduct:[],
    product:{},
    set_crud_unit_measures_by_product:null,
    product_saved:null,
    set_saved_product:null,
    product_update:null,
    set_update_product:null,
    product_status_update:null,
    set_status_product:null,
    product_delete_update: null,
    set_delete_product:null,
    set_crud_sort:null,
    set_crud_subsort:null,
    set_crud_unitmeasure:null,
    set_crud_material:null,
    set_crud_presentacion:null,
    set_crud_typeexistence:null,
};
const productsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.RESET_ATRIBUTES:{
            //console.log("RESETSSSS");
            let stateTemp= JSON.parse(JSON.stringify(state));
            stateTemp.materials=null;
            stateTemp.presentations=null;
            stateTemp.sorts=null;
            stateTemp.subsorts=null;
            stateTemp.typeexistences=null;
            stateTemp.unitmeasures=null;
            //stateTemp.products=null;
            return stateTemp;
        }
        case Actions.GET_ALL_UNIT_MEASURES_BY_PRODUCT:{
            return {
                ...state,
                unitmeasureproduct: [...action.payload]               
            };
        }
        case Actions.GET_ALL_PRODUCTS: {                   
            return {
                ...state,
                products: action.payload.map(p => {
                    p.id = p.producto_id;
                    return p;
                })              
            };
        }
        case Actions.GET_ALL_SORTS: {                   
            return {
                ...state,
                sorts: action.payload.map(s => {
                    s.id = s.clase_id;
                    return s;
                })
            };
        }
        case Actions.GET_ALL_SUBSORTS: {                   
            return {
                ...state,
                subsorts: action.payload.map(s => {
                    s.id = s.sub_clase_id;
                    return s;
                })           
            };
        }
        case Actions.GET_ALL_BRANDS: {                   
            return {
                ...state,
                brands: [...action.payload]               
            };
        }
        case Actions.GET_ALL_MATERIALS: {   
            return {
                ...state,
                materials: action.payload.map((item)=>{
                    item.id= item.material_id;
                    return item;
                })         
            };
        }
        case Actions.GET_ALL_PRESENTATIONS: {                   
            return {
                ...state,
                presentations: action.payload.map((item) => {
                    item.id = item.presentacion_id;
                    return item;
                })              
            };
        }
        case Actions.GET_ALL_TYPEEXISTENCES: {                   
            return {
                ...state,
                typeexistences: action.payload.map(t => {
                    t.id = t.tipo_existencia_id;
                    return t;
                })             
            };
        }
        case Actions.GET_ALL_UNITMEASURES: {                   
            return {
                ...state,
                unitmeasures: action.payload.map(u => {
                    u.id = u.unidad_medida_id;
                    return u;
                })           
            };
        }
        case Actions.GET_DATA_PRODUCT:{
            //console.log(action.payload);
            initialState.product={};
            return {
                ...state,
                product: action.payload             
            };
        }
        case Actions.SAVE_PRODUCT:{
            //console.log(action.payload);
            return {
                ...state,
                product_saved: action.payload,
                set_saved_product: action.payload === null ? false : true          
            };
        }
        case Actions.UPDATE_PRODUCT:{
            //console.log(action.payload);
            return {
                ...state,
                product_update: action.payload,
                set_update_product: action.payload === null ? false : true          
            };
        }
        case Actions.UPDATE_STATUS_PRODUCT:{
            return {
                ...state,
                product_status_update: action.payload,                
                set_status_product: action.update_status_product       
            };
        }
        case Actions.DELETE_PRODUCT:{
            return {
                ...state,
                product_delete_update: action.payload,                
                set_delete_product: action.payload === null ? false : true        
            };
        }
        case Actions.CRUD_UNIT_MEASURES_BY_PRODUCT:{
            if(state.set_crud_unit_measures_by_product){
                return {
                    ...state,
                    set_crud_unit_measures_by_product: null            
                };
            }  
            return {
                ...state,             
                set_crud_unit_measures_by_product: action.payload 
            };
        }
        case Actions.CRUD_SORT:{
            if(state.set_crud_sort){
                return {
                    ...state,
                    set_crud_sort: null            
                };
            }  
            return {
                ...state,             
                set_crud_sort: action.payload 
            };
        }
        case Actions.CRUD_SUBSORT:{
            if(state.set_crud_subsort){
                return {
                    ...state,
                    set_crud_subsort: null            
                };
            } 
            return {
                ...state,             
                set_crud_subsort: action.payload     
            };
        }
        case Actions.CRUD_UNITMEASURES:{
            if(state.set_crud_unitmeasure){
                return {
                    ...state,
                    set_crud_unitmeasure: null            
                };
            } 
            return {
                ...state,             
                set_crud_unitmeasure: action.payload     
            };
        }
        case Actions.CRUD_MATERIAL:{
            if(state.set_crud_material){
                return {
                    ...state,
                    set_crud_material: null            
                };
            }
            return {
                ...state,             
                set_crud_material: action.payload
            };
        }
        case Actions.CRUD_PRESENTATION:{
            if(state.set_crud_presentacion){
                return {
                    ...state,
                    set_crud_presentacion: null            
                };
            }
            return {
                ...state,             
                set_crud_presentacion: action.payload     
            };
        }
        case Actions.CRUD_TYPEEXISTENCE:{
            if(state.set_crud_typeexistence){
                return {
                    ...state,
                    set_crud_typeexistence: null            
                };
            } 
            return {
                ...state,             
                set_crud_typeexistence: action.payload     
            };
        }
        default: {
            return state;
        }
    }
}
export default productsReducer;
