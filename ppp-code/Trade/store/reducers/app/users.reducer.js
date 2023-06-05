import * as Actions from "../../actions/app";
const initialState = {
    users:null,
    set_crud_users:null,
    list_establishmen:[],
    serie_users:null,
    set_crud_series_users:null
};
const usersReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_DATA_SERIE_USER: {                   
            return {
                ...state,
                serie_users: [...action.payload]               
            };
        }
        case Actions.GET_ALL_USERS: {                   
            return {
                ...state,
                users: [...action.payload]               
            };
        }
        case Actions.GET_DATA_ESTABLISHMENT_USER: {                   
            return {
                ...state,
                list_establishmen: [...action.payload]               
            };
        }
        case Actions.CRUD_SERIES_USERS: {     
            if(state.set_crud_series_users){
                return {
                    ...state,
                    set_crud_series_users: null            
                };
            }              
            return {
                ...state,
                set_crud_series_users: action.payload             
            };
        }
        case Actions.CRUD_USERS: {     
            if(state.set_crud_users){
                return {
                    ...state,
                    set_crud_users: null            
                };
            }              
            return {
                ...state,
                set_crud_users: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}
export default usersReducer;
