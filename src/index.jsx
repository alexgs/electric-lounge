import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import store from './store';

import ElectricLounge from './ElectricLounge';

const mapStateToProps = function( state ) {
    return {
        accessToken: state.tokens.get( 'access' ),
        refreshToken: state.tokens.get( 'refresh' )
    };
};

const mapDispatchToProps = function( dispatch ) {
    return { };
};

const ElectricContainer = connect( mapStateToProps, mapDispatchToProps )( ElectricLounge );

render(
    <Provider store={ store }>
        <ElectricContainer />
    </Provider>,
    document.getElementById( 'electric-lounge-root' )
);
