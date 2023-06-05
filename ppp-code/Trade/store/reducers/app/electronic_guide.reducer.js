import * as Actions from "../../actions/app";
const initialState = {
    list_discrepancies:null,
    list_credit_note:null,
    save_credit_note_loading:false
};
const electronicGuide = function (state = initialState, action) {
    switch (action.type) {
        /* case Actions.GET_LIST_DISCREPANCIES: {                   
            return {
                ...state,
                list_discrepancies: action.payload             
            };
        } */
        
        default: {
            return state;
        }
    }
}

export default electronicGuide;
