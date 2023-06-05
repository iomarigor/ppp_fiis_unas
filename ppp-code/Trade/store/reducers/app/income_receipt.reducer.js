import * as Actions from "../../actions/app";
const initialState = {
    income_receipt:null,
    set_crud_income:null,

};
const incomeReceiptReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CRUD_INCOME: {     
            if(state.set_crud_income){
                return {
                    ...state,
                    set_crud_income: null            
                };
            }              
            return {
                ...state,
                set_crud_income: action.payload             
            };
        }
        case Actions.GET_ALL_INCOME_RECEIPT: {                   
            return {
                ...state,
                income_receipt: [...action.payload]               
            };
        }
        default: {
            return state;
        }
    }
}
export default incomeReceiptReducer;
