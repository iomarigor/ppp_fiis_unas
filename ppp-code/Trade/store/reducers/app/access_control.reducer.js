import * as Actions from "../../actions/app";
const initialState = {
    list_access:null,
    crud_Access:null
};
const accessControlReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_LIST_ACCESS_CONTROL: {                   
            return {
                ...state,
                list_access: action.payload             
            };
        }
        case Actions.CRUD_ACCESS_CONTROL: {                   
            return {
                ...state,
                crud_Access: action.payload             
            };
        }
        
        default: {
            return state;
        }
    }
}

export default accessControlReducer;
