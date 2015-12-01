export function setState(state) {
    return {
        type: 'SET_STATE',
        state
    };
}

export function addPlayer(player) {
    return {
        meta: { remote: true },
        type: 'ADD_PLAYER',
        player
    };
}

export function welcomeAdmin() {
    return {
        type: 'WELCOME_ADMIN',
        isAdmin: true
    }
}

export function welcomeGuest() {
    return {
        type: 'WELCOME_GUEST',
        isGuest: true
    }
}

export function next () {
    return {
        meta: { remote: true },
        type: 'NEXT'
    }
}

export function buzz (playerId) {
    return {
        meta: { remote: true },
        type: 'BUZZ',
        playerId
    }
}

export function rightResponse () {
    return {
        meta: { remote: true },
        type: 'RIGHT_RESPONSE'
    }
}

export function wrongResponse () {
    return {
        meta: { remote: true },
        type: 'WRONG_RESPONSE'
    }
}

export function toggleResponse () {
    return {
        meta: { remote: true },
        type: 'TOGGLE_RESPONSE'
    }
}

export function resetTimer() {
    return {
        meta: { remote: true },
        type: 'RESET_TIMER'
    }
}
