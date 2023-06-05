import * as Actions from "../../actions/app";
const initialState = {
    vouchers:[],
    series:null,
    set_crud_series:null
};
const seriesReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_ALL_VOUCHERS: {                   
            return {
                ...state,
                vouchers: [...action.payload]               
            };
        }
        case Actions.GET_ALL_SERIES: {                   
            return {
                ...state,
                series: [...action.payload]               
            };
        }
        case Actions.CRUD_SERIES: {     
            if(state.set_crud_series){
                return {
                    ...state,
                    set_crud_series: null            
                };
            }              
            return {
                ...state,
                set_crud_series: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}
export default seriesReducer;
