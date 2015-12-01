import { Map } from 'immutable'
import { startTimer, stopTimer, setEntries, addEntry, addPlayer, next, buzz, rightResponse, wrongResponse, toggleResponse } from './core'

export default function reducer(state = Map(), action) {
    switch (action.type) {
        case 'SET_ENTRIES':
        return setEntries(state, action.entries);

        case 'ADD_ENTRY':
        return addEntry(state, action.entry);

        case 'ADD_PLAYER':
        return addPlayer(state, action.player, action.id);

        case 'NEXT':
        return stopTimer(next(state));

        case 'BUZZ':
        return startTimer(buzz(state, action.playerId));

        case 'RIGHT_RESPONSE':
        return stopTimer(rightResponse(state));

        case 'WRONG_RESPONSE':
        return stopTimer(wrongResponse(state));

        case 'TOGGLE_RESPONSE':
        return stopTimer(toggleResponse(state));

        default:
        return state;
    }
}
