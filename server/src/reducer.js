import { Map } from 'immutable'
import { setEntries, setPlayers, addEntry, addPlayer, next, buzz, rightResponse, wrongResponse } from './core'

export default function reducer(state = Map(), action) {
    switch (action.type) {
        case 'SET_ENTRIES':
        return setEntries(state, action.entries);

        case 'SET_PLAYERS':
        return setPlayers(state, action.players);

        case 'ADD_ENTRY':
        return addEntry(state, action.entry);

        case 'ADD_PLAYER':
        return addPlayer(state, action.player);

        case 'NEXT':
        return next(state);

        case 'BUZZ':
        return buzz(state, action.playerId);

        case 'RIGHT_RESPONSE':
        return rightResponse(state);

        case 'WRONG_RESPONSE':
        return wrongResponse(state);

        default:
        return state;
    }
}
