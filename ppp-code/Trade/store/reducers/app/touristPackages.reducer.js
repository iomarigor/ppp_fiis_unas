import * as Actions from "../../actions/app";
const initialState = {
    touristPackages: null,
    typeRooms:[],
    set_crud_tourist_packages: null,
};
const touristPackagesReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_ALL_TOURIST_PACKAGES: {                   
            return {
                ...state,
                touristPackages: [...action.payload]               
            };
        }
        case Actions.GET_ALL_TYPE_ROOM: {                   
            return {
                ...state,
                typeRooms: [...action.payload]               
            };
        }
        case Actions.CRUD_TOURIST_PACKAGES: {     
            if(state.set_crud_tourist_packages){
                return {
                    ...state,
                    set_crud_tourist_packages: null            
                };
            }              
            return {
                ...state,
                set_crud_tourist_packages: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}
export default touristPackagesReducer;
