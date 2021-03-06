import { List, Map } from 'immutable'

function setState(state, newState) {
    return state.merge(newState);
}

function clearBuzzer (state, socket) {
    return state.set('buzzer', null);
}

function addPlayer(state, playerName) {

    return state
        .remove('isAdmin')
        .remove('isGuest')
        .set('playerName', playerName);
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

function sendReady(state) {
    return state.set('hasSendReady', true);
}

export default function reducer(state = Map(), action) {
    switch(action.type) {
        case 'SET_STATE':
        return setState(state, action.state);

        case 'CLEAR_BUZZER':
        return clearBuzzer(action.socket);

        case 'ADD_PLAYER':
        return addPlayer(state, action.name);

        case 'WELCOME_ADMIN':
        return welcomeAdmin(state);

        case 'WELCOME_GUEST':
        return welcomeGuest(state);

        case 'SEND_READY':
        return sendReady(state);

        default:
        return state;
    }
}
