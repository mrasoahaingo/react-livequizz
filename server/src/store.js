import { createStore } from 'redux'
import { fromJS } from 'immutable'

import reducer from './reducer'

export const initialState = fromJS({
    buzzer: null,
    quizz: null,
    entries: [],
    players: [],
    archive: [],
    out: [],
    scores: [],
    showResponse: false
});

export default function makeStore() {
    return createStore(reducer, initialState);
}
