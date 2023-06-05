import * as Actions from "../../actions/app";
const initialState = {
    types_payments: [],
    types_payments_froms: [],
    series:[],
    correlativo:{},
    coins_types:[],
    price_dollar:null,
    sales_list:null,
    set_crud_sale:null,
    sales_info:{},
    reservation_residence:[],
    reservation_residence_consumption_stay:{}
};
const salesReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CRUD_SALES: {     
            if(state.set_crud_sale){
                return {
                    ...state,
                    set_crud_sale: null            
                };
            }              
            return {
                ...state,
                set_crud_sale: action.payload             
            };
        }
        case Actions.GET_SALES_INFO: {                   
            return {
                ...state,
                sales_info: action.payload             
            };
        }
        case Actions.GET_SALES_LIST: {                   
            return {
                ...state,
                sales_list: [...action.payload]               
            };
        }
        case Actions.GET_PRICE_DOLLAR_SALES: {                   
            return {
                ...state,
                price_dollar: action.payload              
            };
        }
        case Actions.GET_DATA_COIN_TYPE: {                   
            return {
                ...state,
                coins_types: [...action.payload]               
            };
        }
        case Actions.GET_DATA_CORRELATIVE_SERIES_VOUCHER: {                   
            return {
                ...state,
                correlativo: action.payload[0]            
            };
        }
        case Actions.GET_DATA_SERIES_VOUCHER: {                   
            return {
                ...state,
                series: [...action.payload]               
            };
        }
        case Actions.GET_DATA_TYPE_PAYMENT: {                   
            return {
                ...state,
                types_payments: [...action.payload]               
            };
        }
        case Actions.GET_DATA_TYPE_PAYMENT_FROMS:{
            return {
                ...state,
                types_payments_froms: [...action.payload]               
            };
        }
        case Actions.GET_DATA_RESERVATION_RESIDENCE:{
            return {
                ...state,
                reservation_residence: [...action.payload]               
            };
        }
        case Actions.GET_DATA_RESERVATION_RESIDENCE_CONSUMPTION_STAY:{
            return {
                ...state,
                reservation_residence_consumption_stay: action.payload              
            };
        }
        default: {
            return state;
        }
    }
}
export default salesReducer;
