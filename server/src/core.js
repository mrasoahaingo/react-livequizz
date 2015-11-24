import { List, Map } from 'immutable'

export function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

export function setPlayers(state, players) {
    return state.set('players', List(players));
}

export function next(state) {
    const quizz = state.get('entries').first();
    const entries = state.get('entries').skip(1);

    return state.merge({
        quizz,
        entries
    });
}

export function buzz(state, playerId) {
    return state.set('buzzer', playerId);
}

export function rightResponse(state) {
    const playerId = state.get('buzzer');
    const quizzToBeArchived = state.get('quizz').set('buzzer', playerId);
    return state
        .remove('buzzer')
        .remove('quizz')
        .updateIn(
            ['scores', playerId],
            0,
            score => score + 1
        )
        .update('archive', List(), archive => archive.push(quizzToBeArchived));
}

export function wrongResponse(state) {
    const playerId = state.get('buzzer');
    return state
        .remove('buzzer')
        .update('out', List(), out => out.push(playerId));
}
