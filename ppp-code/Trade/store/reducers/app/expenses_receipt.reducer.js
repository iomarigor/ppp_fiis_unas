import * as Actions from "../../actions/app";
const initialState = {
    expenses_receipt:null,
    set_crud_expenses:null,
};
const expensesReceiptReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CRUD_EXPENSES: {     
            if(state.set_crud_expenses){
                return {
                    ...state,
                    set_crud_expenses: null            
                };
            }              
            return {
                ...state,
                set_crud_expenses: action.payload             
            };
        }
        case Actions.GET_ALL_EXPENSES_RECEIPT: {                   
            return {
                ...state,
                expenses_receipt: [...action.payload]               
            };
        }
        default: {
            return state;
        }
    }
}
export default expensesReceiptReducer;
