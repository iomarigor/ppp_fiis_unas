import * as Actions from "../../actions/app";
const initialState = {
    list_menus:null,
    list_menus_padres:null,
    crud_menu:null,
    list_menus_hijos:null
};
const menuControlReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_LIST_MENUS: {                   
            return {
                ...state,
                list_menus: action.payload             
            };
        }
        case Actions.GET_LIST_MENUS_HIJOS: {                   
            return {
                ...state,
                list_menus_hijos: action.payload             
            };
        }
        case Actions.GET_LIST_MENUS_PADRES:{
            return{
                ...state,
                list_menus_padres: action.payload             
            };
        }
        case Actions.SAVE_MENU_CONTROL:{
            return{
                ...state,
                crud_menu: action.payload             
            };
        }
        case Actions.UPDATE_MENU_CONTROL:{
            return{
                ...state,
                crud_menu: action.payload             
            };
        }
        default: {
            return state;
        }
    }
}

export default menuControlReducer;
