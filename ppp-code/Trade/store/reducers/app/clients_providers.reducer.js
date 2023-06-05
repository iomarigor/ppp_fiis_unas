import * as Actions from "../../actions/app";
const initialState = {
    clients_providers:null,
    type_documents:[],
    set_clients_providers:null,
    client_save:{},
    sunat_dni:{},
    sunat_ruc:{},
    search_dni_ruc_loading:false
};
const clientsProviders = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SEARCH_DNI_RUC_LOADING:{
            return{
                ...state,
                search_dni_ruc_loading:action.payload
            }
        }
        case Actions.GET_ALL_SUNAT_DNI: {                   
            return {
                ...state,
                sunat_dni: action.payload        
            };
        }
        case Actions.GET_ALL_SUNAT_RUC: {                   
            return {
                ...state,
                sunat_ruc: action.payload           
            };
        }
        case Actions.GET_ALL_CLIENTS_PROVIDERS: {                   
            return {
                ...state,
                clients_providers: [...action.payload]               
            };
        }
        case Actions.GET_ALL_TYPE_DOCUMENTS: {                   
            return {
                ...state,
                type_documents: [...action.payload]               
            };
        }
        case Actions.CRUD_CLIENTS_PROVIDERS: {                   
            if(state.set_clients_providers){
                return {
                    ...state,
                    client_save:action.payload.detalles,
                    set_clients_providers: null            
                };
            }              
            return {
                ...state,
                client_save:action.payload.detalles,
                set_clients_providers: action.payload.mensaje  
            };
        }
        case Actions.CLIENT_SAVE_RESET: {  
            return {
                    ...state,
                    client_save:{},
                    sunat_dni:{},
                    sunat_ruc:{}
            };
        }
        default: {
            return state;
        }
    }
}
export default clientsProviders;
