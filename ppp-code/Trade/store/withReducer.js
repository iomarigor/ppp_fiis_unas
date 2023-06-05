/*
    Componente: withReducer
    Descripción: Este componente es el encargado de envolver la aplicación con Redux independientemente o de 
    manera global en los distintos componentes de la
                 aplicación
*/

import React from "react";
import { injectReducer } from 'store';

const withReducer = (key, reducer) => WrappedComponent =>
    class extends React.PureComponent {
        constructor(props) {
            super(props);
            injectReducer(key, reducer);
        };

        render() {
            return <WrappedComponent {...this.props} />;
        };
    };

export default withReducer;