import { List, Map } from 'immutable'

function setState(state, newState) {
    return state.merge(newState);
}

function addPlayer(state, player) {

    return state
        .remove('isAdmin')
        .remove('isGuest')
        .set('player', player);
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

        default:
        return state;
    }
}
