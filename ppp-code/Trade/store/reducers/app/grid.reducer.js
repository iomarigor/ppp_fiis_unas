/*
    Reducer: Grid
    Descripción: Reductores del action Grid, aquí es donde Redux cambia los estados de los componentes, 
    siempre y cuando el componente use los estados definidos
                 en este reductor
*/

import * as Actions from "../../actions/app";

const initialState = {
    rooms: null,
    airlines: [],
    room_class: [],
    search_people: [],
    bookings: null,
    packages: [],
    flights_by_booking: [],
    guests_by_booking: [],
    payments_by_booking: [],
    origins_destinations: [],
    occupations: [],
    extras: [],
    banks: [],
    channels: [],
    employees:[],
    consume: [],
    search_product: [],
    details: [],
    resume: null,
    search_product_loading: false,
    search_customer_loading: false,
    search_guest_loading: false,
    customer_saved: null,
    guest_saved: null,
    set_saved_customer: null,
    set_saved_guest: null,
    close_booking_form: false,
    set_saved_payment: null,
    set_saved_consume: null,
    daily_report:[],
    crud_stay:null,
    search_select:null
};

const gridReducer = function (state = initialState, action) {
    switch (action.type) {
      case Actions.SEARCH_SELECT: {
        return {
          ...state,
          search_select: action.payload,
        };
      }
      case Actions.CRUD_STAY: {
        return {
          ...state,
          crud_stay: action.payload,
        };
      }
      case Actions.GET_DAILY_REPORT: {
        return {
          ...state,
          daily_report: [...action.payload],
        };
      }
      case Actions.GET_ALL_ROOMS: {
        return {
          ...state,
          rooms: [...action.payload],
        };
      }
      case Actions.RESET_ROOMS_BOOKING: {
        return {
          ...state,
          rooms: null,
          bookings: null,
        };
      }
      case Actions.GET_ALL_AIRLINE: {
        return {
          ...state,
          airlines: [...action.payload],
        };
      }
      case Actions.GET_ALL_ROOM_CLASS: {
        return {
          ...state,
          /* room_class: [...action.payload], */
          room_class: action.payload,
        };
      }
      case Actions.SEARCH_PERSON: {
        return {
          ...state,
          search_people: [...action.payload],
        };
      }
      case Actions.SEARCH_CUSTOMER_LOADING: {
        return {
          ...state,
          search_customer_loading: action.payload,
        };
      }
      case Actions.SEARCH_GUEST_LOADING: {
        return {
          ...state,
          search_guest_loading: action.payload,
        };
      }
      case Actions.SAVE_CUSTOMER: {
        return {
          ...state,
          customer_saved: action.payload,
          set_saved_customer: action.payload === null ? false : true,
        };
      }
      case Actions.SAVE_GUEST: {
        return {
          ...state,
          guest_saved: action.payload,
          set_saved_guest: action.payload === null ? false : true,
        };
      }
      case Actions.SET_SAVED_CUSTOMER: {
        return {
          ...state,
          set_saved_customer: action.payload,
        };
      }
      case Actions.SET_SAVED_GUEST: {
        return {
          ...state,
          set_saved_guest: action.payload,
        };
      }
      case Actions.SAVE_BOOKING: {
        return {
          ...state,
        };
      }
      case Actions.GET_ALL_BOOKINGS: {
        return {
          ...state,
          bookings: [...action.payload],
        };
      }
      case Actions.MOVE_BOOKING: {
        return {
          ...state,
        };
      }
      case Actions.GET_ALL_PACKAGES: {
        return {
          ...state,
          packages: [...action.payload],
        };
      }
      case Actions.CLOSE_BOOKING_FORM: {
        return {
          ...state,
          close_booking_form: action.payload,
        };
      }
      case Actions.GET_FLIGHTS_BY_BOOKING: {
        return {
          ...state,
          flights_by_booking: [...action.payload],
        };
      }
      case Actions.GET_GUESTS_BY_BOOKING: {
        return {
          ...state,
          guests_by_booking: [...action.payload],
        };
      }
      case Actions.GET_ORIGIN_DESTINATION: {
        return {
          ...state,
          origins_destinations: [...action.payload],
        };
      }
      case Actions.GET_ALL_OCCUPATION: {
        return {
          ...state,
          occupations: [...action.payload],
        };
      }
      case Actions.GET_EXTRA: {
        return {
          ...state,
          extras: [...action.payload],
        };
      }
      case Actions.GET_PAYMENTS_BY_BOOKING: {
        return {
          ...state,
          payments_by_booking: [...action.payload],
        };
      }
      case Actions.GET_ALL_BANKS: {
        return {
          ...state,
          banks: [...action.payload],
        };
      }
      case Actions.SET_SAVED_PAYMENT: {
        return {
          ...state,
          set_saved_payment: action.payload,
        };
      }
      case Actions.GET_SALE_CHANNEL: {
        return {
          ...state,
          channels: [...action.payload],
        };
      }
      case Actions.GET_ALL_EMPLOYEES: {
        return {
          ...state,
          employees: [...action.payload],
        };
      }
      case Actions.GET_ALL_CONSUME_BY_ROOM: {
        return {
          ...state,
          consume: [...action.payload],
        };
      }
      case Actions.SEARCH_PRODUCT: {
        return {
          ...state,
          search_product: [...action.payload],
        };
      }
      case Actions.SEARCH_PRODUCT_LOADING: {
        return {
          ...state,
          search_product_loading: action.payload,
        };
      }
      case Actions.SAVE_CONSUME_BY_BOOKING: {
        return {
          ...state,
          guest_saved: action.payload,
          set_saved_consume: action.payload === null ? false : true,
        };
      }
      case Actions.SET_SAVED_CONSUME: {
        return {
          ...state,
          set_saved_consume: action.payload,
        };
      }
      case Actions.GET_DETAIL_BY_BOOKING: {
        return {
          ...state,
          details: [...action.payload],
        };
      }
      case Actions.GET_RESUME_BY_BOOKING: {
        return {
          ...state,
          resume: action.payload,
        };
      }
      default: {
        return state;
      }
    }
};

export default gridReducer;