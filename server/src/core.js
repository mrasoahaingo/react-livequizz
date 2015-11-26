import { List, Map, fromJS } from 'immutable'

export function setEntries(state, entries) {
    return state.set('entries', fromJS(entries));
}

export function addEntry(state, entry) {
    return state.update('entries', entries => entries.push(fromJS(entry)));
}

export function addPlayer(state, playerId) {
    if(state.get('players', List()).includes(playerId)) {
        return state;
    }
    return state
        .setIn([ 'scores', playerId ], 0)
        .update('players', players => players.push(playerId));
}

export function setPlayers(state, players) {
    const playerList = fromJS(players);
    const scores = playerList.reduce((scores, player) => scores.set(player, 0), Map());
    return state
        .set('scores', scores)
        .set('players', playerList);
}

function getWinnerOrTie(state) {
    const [
        [secondPlayer, secondScore],
        [firstPlayer, firstScore]
    ] = state.get('scores').sort().takeLast(2);

    if(firstScore === secondScore) {
        return addEntry(state, { question: 'Bonus' });
    }

    return state
        .set('entries', List())
        .set('winner', firstPlayer);
}

export function next(state) {
    const quizz = state.get('entries').first();

    if(!quizz) {
        return getWinnerOrTie(state);
    }

    const entries = state.get('entries').skip(1);

    return state
        .set('buzzer', null)
        .set('out', List())
        .merge({
            quizz,
            entries
        });
}

export function buzz(state, playerId) {
    if (state.get('buzzer') || state.get('out', List()).includes(playerId)) {
        return state;
    }
    return state.set('buzzer', playerId);
}

export function rightResponse(state) {
    const playerId = state.get('buzzer');
    if (!playerId) {
        return state;
    }
    const quizzToBeArchived = state.get('quizz').set('buzzer', playerId);
    return state
        .set('buzzer', null)
        .updateIn(
            ['scores', playerId],
            0,
            score => score + 1
        )
        .update('archive', List(), archive => archive.push(quizzToBeArchived));
}

export function wrongResponse(state) {
    const playerId = state.get('buzzer');
    if (!playerId) {
        return state;
    }
    return state
        .set('buzzer', null)
        .update('out', List(), out => out.push(playerId));
}
