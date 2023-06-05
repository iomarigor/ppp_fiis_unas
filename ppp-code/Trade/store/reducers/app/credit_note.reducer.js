import * as Actions from "../../actions/app";
const initialState = {
    list_discrepancies:null,
    list_credit_note:null,
    save_credit_note_loading:false
};
const creditNote = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_LIST_DISCREPANCIES: {                   
            return {
                ...state,
                list_discrepancies: action.payload             
            };
        }
        case Actions.GET_LIST_CREDIT_NOTE:{
            return{
                ...state,
                list_credit_note:action.payload
            }
        }
        case Actions.SAVE_CREDIT_NOTE_LOADING:{
            return{
                ...state,
                save_credit_note_loading:action.payload
            }
        }
        default: {
            return state;
        }
    }
}

export default creditNote;
