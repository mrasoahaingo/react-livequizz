import { List, Map } from 'immutable'

export function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

export function setPlayers(state, players) {
    return state.set('players', List(players));
}

function getWinnerOrTie(state) {
    const [
        [secondPlayer, secondScore],
        [firstPlayer, firstScore]
    ] = state.get('scores').sort().takeLast(2);

    if(firstScore === secondScore) {
        const bonus = Map({ question: 'Bonus' });
        return state
            .update('entries', entries => entries.push(bonus));
    }

    return state
        .remove('entries')
        .set('winner', firstPlayer);
}

export function next(state) {
    const quizz = state.get('entries').first();

    if(!quizz) {
        return getWinnerOrTie(state);
    }

    const entries = state.get('entries').skip(1);

    return state
        .remove('out')
        .merge({
            quizz,
            entries
        });
}

export function buzz(state, playerId) {
    if (state.get('out', List()).find(player => player === playerId)) {
        return state;
    }
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
