import * as Actions from "../../actions/app";
const initialState = {
  vouchers: null,
  set_vouchers: null,
  vouchers_serie_comprobante: null,
};
const voucherReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_ALL_VOUCHERS: {
      return {
        ...state,
        vouchers: [...action.payload],
      };
    }
    case Actions.CRUD_VOUCHERS: {
      if (state.set_vouchers) {
        return {
          ...state,
          set_vouchers: null,
        };
      }
      return {
        ...state,
        set_vouchers: action.payload,
      };
    }
    case Actions.VOUCHERS_SERIE_COMPROBANTE: {
      return {
        ...state,
        vouchers_serie_comprobante: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
export default voucherReducer;
