import * as Actions from "../../actions/app";
const initialState = {
  get_establishment: null,
  set_crud_establishment: null,
  list_branchs: null,
  set_crud_brands: null,
  get_branch_options: null,
  set_crud_brands_option: null,
};
const establishment = function (state = initialState, action) {
  switch (action.type) {
    case Actions.RESET_DATA_BRANCH_OPTIONS: {
      return {
        ...state,
        get_branch_options: action.payload,
      };
    }
    case Actions.GET_DATA_ESTABLISHMENT: {
      return {
        ...state,
        get_establishment: action.payload === null ? {} : action.payload[0],
      };
    }
    case Actions.GET_DATA_BRANCH_OPTIONS: {
      return {
        ...state,
        get_branch_options:
          action.payload.length === 0 ? {} : action.payload[0],
      };
    }
    case Actions.GET_DATA_BRANCHS: {
      return {
        ...state,
        list_branchs: [...action.payload],
      };
    }
    case Actions.CRUD_ESTABLISHMENT: {
      if (state.set_crud_establishment) {
        return {
          ...state,
          set_crud_establishment: null,
        };
      }
      return {
        ...state,
        set_crud_establishment: action.payload,
      };
    }
    case Actions.CRUD_BRANCHS: {
      if (state.set_crud_brands) {
        return {
          ...state,
          set_crud_brands: null,
        };
      }
      return {
        ...state,
        set_crud_brands: action.payload,
      };
    }
    case Actions.CRUD_BRANCHS_OPTIONS: {
      if (state.set_crud_brands_option) {
        return {
          ...state,
          set_crud_brands_option: null,
        };
      }
      return {
        ...state,
        set_crud_brands_option: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
export default establishment;
