import * as Actions from "../../actions/app";
const initialState = {
    list_proformas:null,
    set_crud_proformas:null,
    detail_proforma:{}
};
const proformaReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_LIST_PROFORMAS: {                   
            return {
                ...state,
                list_proformas: action.payload             
            };
        }
        case Actions.CRUD_PROFORMAS: {     
            if(state.set_crud_proformas){
                return {
                    ...state,
                    set_crud_proformas: null            
                };
            }              
            return {
                ...state,
                set_crud_proformas: action.payload             
            };
        }
        case Actions.GET_DETAIL_PROFORMAS: {                   
            return {
                ...state,
                detail_proforma: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}

export default proformaReducer;
