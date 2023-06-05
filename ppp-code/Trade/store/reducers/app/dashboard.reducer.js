import * as Actions from "../../actions/app";
const initialState = {
    init:null,

};
const dashboardReducer = function (state = initialState, action) {
    switch (action.type) {
       case Actions.GET_ALL_DASHBOARD: {                   
            return {
                ...state,
                init: action.payload      
            };
        }
        default: {
            return state;
        }
    }
}
export default dashboardReducer;
