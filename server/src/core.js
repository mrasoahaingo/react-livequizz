import { List, Map, fromJS } from 'immutable'
import { findPlayerIndexBy, findPlayerBy } from './utils'

export function startTimer(state) {
    return state.set('startCountDown', true);
}

export function stopTimer(state) {
    return state.set('startCountDown', false);
}

export function setEntries(state, entries) {
    return state.set('entries', fromJS(entries));
}

export function addEntry(state, entry) {
    return state.update('entries', entries => entries.push(fromJS(entry)));
}

export function addPlayer(state, playerName, id = -1) {
    const playerIndex = findPlayerIndexBy(state, 'name', playerName);

    if(playerIndex > -1) {
        return state
        .updateIn(
            ['players', playerIndex, 'isConnected'],
            false,
            isConnected => true
        );
    }

    return state.update('players', List(), players => players.push(Map({
        id: id,
        name: playerName,
        score: 0,
        isConnected: true,
        isReady: false,
        isOut: state.get('quizz') !== null
    })));
}

export function isReady(state, playerName) {
    const playerIndex = findPlayerIndexBy(state, 'name', playerName);

    return state.updateIn(
        ['players', playerIndex, 'isReady'],
        false,
        isReady => true
    );
}

export function disconnectPlayer(state, playerId) {
    const playerIndex = findPlayerIndexBy(state, 'id', playerId);

    return state.updateIn(
        ['players', playerIndex, 'isConnected'],
        false,
        isConnected => false
    );
}

export function removePlayer(state, playerName) {
    const playerIndex = findPlayerIndexBy(state, 'name', playerName);
    return state.update('players', List(), players => players.remove(playerIndex));
}

function getWinnerOrTie(state) {
    const [first, second] = state
    .get('players')
    .sort((a, b) => (a.get('score') < b.get('score')))
    .take(2);

    if(first.get('score') === second.get('score')) {
        return addEntry(state, { question: 'Bonus' });
    }

    return state
    .set('entries', List())
    .set('winner', first.get('name'));
}

export function next(state) {
    const quizz = state.get('entries').first();

    if(!quizz) {
        return getWinnerOrTie(state);
    }

    const players = state.get('players', List()).map(player => player
        .update('isReady', false, isReady => false)
        .update('isOut', false, isOut => false)
    );
    const entries = state.get('entries').skip(1);

    return state
    .set('buzzer', null)
    .set('showResponse', false)
    .merge({
        players,
        quizz,
        entries
    });
}

export function buzz(state, playerName) {
    const player = findPlayerBy(state, 'name', playerName);

    if (state.get('buzzer') || player.get('isOut')) {
        return state;
    }

    return state.set('buzzer', playerName);
}

export function rightResponse(state) {
    const playerName = state.get('buzzer');

    if (!playerName) {
        return state;
    }

    const quizzToBeArchived = state.get('quizz').set('buzzer', playerName);
    const playerIndex = findPlayerIndexBy(state, 'name', playerName);

    return state
    .set('buzzer', null)
    .updateIn(
        ['players', playerIndex, 'score'],
        0,
        score => score + 1
    )
    .update('archive', List(), archive => archive.push(quizzToBeArchived));
}

export function wrongResponse(state) {
    const playerName = state.get('buzzer');
    const playerIndex = findPlayerIndexBy(state, 'name', playerName);

    if (playerIndex === -1) {
        return state;
    }

    return state
    .set('buzzer', null)
    .updateIn(
        ['players', playerIndex, 'isOut'],
        false,
        isOut => true
    );
}

export function toggleResponse (state) {
    return state.update('showResponse', false, value => !value);
}

export function toggleQuestion (state) {
    return state.update('showQuestion', false, value => !value);
}
