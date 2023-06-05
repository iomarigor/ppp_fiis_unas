import * as Actions from "../../actions/app";
const initialState = {
    list_orders:null,
    detail_order:{},
    search_room:[],
    search_room_customer_loading:false,
    set_crud_orders:null
};
const orderReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_LIST_ORDERS: {                   
            return {
                ...state,
                list_orders: action.payload             
            };
        }
        
        case Actions.GET_DETAIL_ORDERS: {                   
            return {
                ...state,
                detail_order: action.payload             
            };
        }
        case Actions.SEARCH_ROOM: {      
            return {
                ...state,
                search_room: [...action.payload]         
            };
        }
        case Actions.SEARCH_ROOM_CUSTOMER_LOADING: {                   
            return {
                ...state,
                search_room_customer_loading: action.payload     
            };
        }
        case Actions.CRUD_ORDERS: {     
            if(state.set_crud_orders){
                return {
                    ...state,
                    set_crud_orders: null            
                };
            }              
            return {
                ...state,
                set_crud_orders: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}

export default orderReducer;
