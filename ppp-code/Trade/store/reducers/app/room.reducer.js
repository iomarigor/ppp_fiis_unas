import * as Actions from "../../actions/app";
const initialState = {
    rooms: null,
    locations:[],
    beds:[],
    services:[],
    sorts:[],
    bedsRoom:[],
    sortsRoom:[],
    servicesRoom:[],
    set_crud_room: null,
    set_crud_bed_room: null,
    set_crud_service_room: null,
    set_crud_sort_room: null
};
const roomReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_ALL_ROOMS: {                   
            return {
                ...state,
                rooms: [...action.payload]               
            };
        }
        case Actions.GET_ALL_BEDS:{
            return {
                ...state,
                beds: [...action.payload]               
            };
        }
        case Actions.GET_ALL_SERVICES:{
            return {
                ...state,
                services: [...action.payload]               
            };
        }
        case Actions.GET_ALL_SORTS_ROOM:{
            return {
                ...state,
                sorts: [...action.payload]               
            };
        }
        case Actions.GET_ALL_LOCATIONS: {                   
            return {
                ...state,
                locations: [...action.payload]               
            };
        }
        case Actions.GET_ALL_BEDS_ROOM: {                   
            return {
                ...state,
                bedsRoom: [...action.payload]               
            };
        }
        case Actions.GET_ALL_SORTS_BY_ROOM:{
            return {
                ...state,
                sortsRoom: [...action.payload]               
            };
        }
        case Actions.GET_ALL_SERVICES_BY_ROOM:{
            return {
                ...state,
                servicesRoom: [...action.payload]               
            };
        }
        case Actions.CRUD_ROOM: {     
            if(state.set_crud_room){
                return {
                    ...state,
                    set_crud_room: null            
                };
            }              
            return {
                ...state,
                set_crud_room: action.payload             
            };
        }
        case Actions.CRUD_BED_ROOM: {     
            if(state.set_crud_bed_room){
                return {
                    ...state,
                    set_crud_bed_room: null            
                };
            }              
            return {
                ...state,
                set_crud_bed_room: action.payload             
            };
        }
        case Actions.CRUD_SORT_ROOM: {     
            if(state.set_crud_sort_room){
                return {
                    ...state,
                    set_crud_sort_room: null            
                };
            }              
            return {
                ...state,
                set_crud_sort_room: action.payload             
            };
        }
        case Actions.CRUD_SERVICE_ROOM: {     
            if(state.set_crud_service_room){
                return {
                    ...state,
                    set_crud_service_room: null            
                };
            }              
            return {
                ...state,
                set_crud_service_room: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}
export default roomReducer;
