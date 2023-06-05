import * as Actions from "../../actions/app";
const initialState = {
  list_exit_vehicles: null,
  list_exit_report_vehicles: null,
  crud_exit_vehicles: null,
};
const exitVehicles = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_LIST_EXIT_VEHICLES: {
      return {
        ...state,
        list_exit_vehicles: action.payload,
      };
    }
    case Actions.CRUD_EXIT_VEHICLES: {
      return {
        ...state,
        crud_exit_vehicles: action.payload,
      };
    }
    case Actions.GET_LIST_REPORT_EXIT_VEHICLES: {
      return {
        ...state,
        list_exit_report_vehicles: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default exitVehicles;
