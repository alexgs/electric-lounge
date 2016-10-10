import Immutable from 'immutable';

const tokensData = require( '../config/tokens.json' );
const initialState = Immutable.fromJS( tokensData );

const tokens = function( state = initialState, action ) {
    return state;
};

export default tokens;
