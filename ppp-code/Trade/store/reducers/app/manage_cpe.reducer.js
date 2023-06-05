import * as Actions from "../../actions/app";
const initialState = {
    generate_response:null
};
const manageCpeReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GENERATE_VOUCHER:{
            return {
                ...state,
                generate_response: action.payload     
            };
        }
        
        default: {
            return state;
        }
    }
}
export default manageCpeReducer;
