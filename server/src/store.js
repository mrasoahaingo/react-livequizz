import { createStore } from 'redux'
import { fromJS } from 'immutable'

import reducer from './reducer'

const initialState = fromJS({
    buzzer: null,
    quizz: null,
    response: null,
    entries: [],
    players: [],
    archive: [],
    out: []
});

export default function makeStore() {
    return createStore(reducer, initialState);
}
