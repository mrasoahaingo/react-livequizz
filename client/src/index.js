import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux'
import io from 'socket.io-client'

import reducer from './reducer'
import middleware from './middleware'
import { setState } from './actions'

import { AppContainer } from './components/App'

const socket = io('http://localhost:8090');
socket.on('state', state =>
  store.dispatch(setState(state))
);

const createStoreWithMiddleware = compose(
    applyMiddleware(middleware(socket)),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);
const store = createStoreWithMiddleware(reducer);

render(
    <div>
        <Provider store={store}>
            <AppContainer/>
        </Provider>
        <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
        </DebugPanel>
    </div>
    , document.getElementById('app')
);
