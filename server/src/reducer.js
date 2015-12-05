import { Map } from 'immutable'
import * as Core from './core'

export default function reducer(state = Map(), action) {
    switch (action.type) {
        case 'SET_ENTRIES':
        return Core.setEntries(state, action.entries);

        case 'ADD_ENTRY':
        return Core.addEntry(state, action.entry);

        case 'ADD_PLAYER':
        return Core.addPlayer(state, action.name, action.id);

        case 'NEXT':
        return Core.stopTimer(Core.next(state));

        case 'BUZZ':
        if (state.get('players').count(player => player.get('isReady')) !== state.get('players').size) {
            return state;
        }
        return Core.startTimer(Core.buzz(state, action.playerId));

        case 'RIGHT_RESPONSE':
        return Core.stopTimer(Core.rightResponse(state));

        case 'WRONG_RESPONSE':
        return Core.stopTimer(Core.wrongResponse(state));

        case 'TOGGLE_RESPONSE':
        return Core.stopTimer(Core.toggleResponse(state));

        case 'TOGGLE_QUESTION':
        return Core.stopTimer(Core.toggleQuestion(state));

        case 'IS_READY':
        return Core.isReady(state, action.playerId);

        case 'DISCONNECTED':
        return Core.disconnectPlayer(state, action.playerId);

        default:
        return state;
    }
}
