/*
    Reducer: Chart
    Descripción: Reductores del action Chart, aquí es donde Redux cambia los estados de los componentes, 
    siempre y cuando el componente use los estados definidos
                 en este reductor
*/

import * as Actions from "../../actions/app";

const initialState = {
    graphMonth: [],
    graphType: [],
    graphChannel: [],
    graphCustomer: [],
    graphPackage: []
};

const chartReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_CHART_SALES_BY_MONTH: {
            return {
                ...state,
                graphMonth: [...action.payload]
            };
        }
        case Actions.GET_CHART_SALES_BY_TYPE: {
            return {
                ...state,
                graphType: [...action.payload]
            }
        }
        case Actions.GET_CHART_SALES_BY_CHANNEL: {
            return {
                ...state,
                graphChannel: [...action.payload]
            }
        }
        case Actions.GET_CHART_SALES_BY_CUSTOMER: {
            return {
                ...state,
                graphCustomer: [...action.payload]
            }
        }
        case Actions.GET_CHART_SALES_BY_PACKAGE: {
            return {
                ...state,
                graphPackage: [...action.payload]
            }
        }
        default: {
            return state;
        }
    }
};

export default chartReducer;