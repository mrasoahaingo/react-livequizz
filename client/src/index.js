import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
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

const createStoreWithMiddleware = applyMiddleware(middleware(socket))(createStore);
const store = createStoreWithMiddleware(reducer);

render(
    <Provider store={store}>
        <AppContainer/>
    </Provider>
    , document.getElementById('app')
);
