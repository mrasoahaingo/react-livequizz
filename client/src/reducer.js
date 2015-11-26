import { List, Map } from 'immutable'

function setState(state, newState) {
    return state.merge(newState);
}

function addPlayer(state, player) {
    return state
        .remove('isAdmin')
        .remove('isGuest')
        .set('player', player)
        .update('players', List(), players => players.push(player));
}

function welcomeAdmin(state) {
    return state
        .remove('isGuest')
        .set('isAdmin', true);
}

function welcomeGuest(state) {
    return state
        .remove('isAdmin')
        .set('isGuest', true);
}

function hideResponse(state) {
    return state.set('showResponse', false);
}

function showResponse(state) {
    return state.set('showResponse', true);
}

export default function reducer(state = Map(), action) {
    switch(action.type) {
        case 'SET_STATE':
        return setState(state, action.state);

        case 'ADD_PLAYER':
        return addPlayer(state, action.player);

        case 'WELCOME_ADMIN':
        return welcomeAdmin(state);

        case 'WELCOME_GUEST':
        return welcomeGuest(state);

        case 'NEXT':
        return hideResponse(state);

        case 'RIGHT_RESPONSE':
        case 'SHOW_RESPONSE':
        return showResponse(state);

        default:
        return state;
    }
}
