import * as Actions from "../../actions/app";
const initialState = {
  list_advance_shift: null,
  crud_advance_shift: null,
};
const advanceShift = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_LIST_ADVANCE_SHIFT: {
      return {
        ...state,
        list_advance_shift: action.payload,
      };
    }
    case Actions.CRUD_ADVANCE_SHIFT: {
      return {
        ...state,
        crud_advance_shift: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default advanceShift;
