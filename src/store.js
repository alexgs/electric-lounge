import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducers from './reducers';

// Source: http://jamiecopeland.com/using-redux-logger-with-immutable/
const loggerOptions = {
    collapsed: true,
    stateTransformer: state => state.toJS()
};

const logger = createLogger( loggerOptions );
const store = createStore(
    reducers,
    applyMiddleware(thunk, logger)
);

export default store;
