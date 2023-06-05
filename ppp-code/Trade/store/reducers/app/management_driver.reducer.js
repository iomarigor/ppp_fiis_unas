import * as Actions from "../../actions/app";
const initialState = {
    list_drivers:null,
    crud_driver:null,
};
const managementDriver = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_LIST_MANAGEMENT_DRIVER: {                   
            return {
                ...state,
                list_drivers: action.payload             
            };
        }
        case Actions.CRUD_MANAGEMENT_DRIVER:{
            return{
                ...state,
                crud_driver: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}

export default managementDriver;
