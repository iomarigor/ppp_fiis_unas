import * as Actions from "../../actions/app";
const initialState = {
    openings:null,
    set_crud_openings:null,
    price_dollar:0
};
const manageCashReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_PRICE_DOLLAR:{
            return {
                ...state,
                price_dollar: [...action.payload]               
            };
        }
        case Actions.GET_ALL_OPENINGS: {                   
            return {
                ...state,
                openings: [...action.payload]               
            };
        }
        case Actions.CRUD_OPENINGS: {     
            if(state.set_crud_openings){
                return {
                    ...state,
                    set_crud_openings: null            
                };
            }              
            return {
                ...state,
                set_crud_openings: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}
export default manageCashReducer;
