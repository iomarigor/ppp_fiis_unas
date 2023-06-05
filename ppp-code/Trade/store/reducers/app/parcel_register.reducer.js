import * as Actions from "../../actions/app";
const initialState = {
  list_parcel_register: null,
  list_parcel_register_detail: null,
  crud_parcel_register: null,
  parsel_search: null,
  loader_parsel_search: false,
};
const parcelRegister = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_LIST_PARCEL_REGISTER: {
      return {
        ...state,
        list_parcel_register: action.payload,
      };
    }
    case Actions.GET_LIST_PARCEL_REGISTER_DETAIL: {
      return {
        ...state,
        list_parcel_register_detail: action.payload,
      };
    }
    case Actions.CRUD_PARCEL_REGISTER: {
      return {
        ...state,
        crud_parcel_register: action.payload,
        list_parcel_register_detail: null,
      };
    }
    case Actions.PARCEL_SEARCH: {
      return {
        ...state,
        parsel_search: action.payload,
      };
    }
    case Actions.PARCEL_SEARCH_LOADER: {
      return {
        ...state,
        loader_parsel_search: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default parcelRegister;
