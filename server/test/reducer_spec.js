import {Map, fromJS} from 'immutable'
import { expect } from 'chai'

import reducer from '../src/reducer'

describe('reducer', () => {
    it('handle set entries', () => {
        const entries = [
            { question: 'Where is Bryan', response: 'In the kitchen' },
            { question: 'What is Sandy lastname', response: 'Kilo' }
        ];
        const action = { type: 'SET_ENTRIES', entries };
        const nextState = reducer(undefined, action);
        expect(nextState).to.equal(fromJS({
            entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        }))
    });

    it('handle set players', () => {
        const initialState = Map();
        const players = [ 'Bryan', 'Sandy' ];
        const action = { type: 'SET_PLAYERS', players };
        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
            scores: {
                Bryan: 0,
                Sandy: 0
            },
            players: [ 'Bryan', 'Sandy' ]
        }))
    });

    it('handle next step', () => {
        const initialState = fromJS({
            entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'NEXT' };
        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
            quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        }))
    });

    it('handle buzzer', () => {
        const initialState = fromJS({
            quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'BUZZ', playerId: 'Bryan' };
        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
            buzzer: 'Bryan',
            quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        }))
    });

    it('handle right response', () => {
        const initialState = fromJS({
            buzzer: 'Bryan',
            quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'RIGHT_RESPONSE' };
        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
            scores: {
                'Bryan': 1
            },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ],
            archive: [
                { question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Bryan' }
            ]
        }))
    });

    it('handle wrong response', () => {
        const initialState = fromJS({
            buzzer: 'Bryan',
            quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'WRONG_RESPONSE' };
        const nextState = reducer(initialState, action);
        expect(nextState).to.equal(fromJS({
            out: [ 'Bryan' ],
            quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        }))
    });

    it('handle sequencial actions with a winner', () => {
        const actions = [
            { type: 'SET_ENTRIES', entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ] },
            { type: 'SET_PLAYERS', players: [ 'Mic', 'Fran' ] },
            { type: 'ADD_PLAYER', player: 'Eva' },
            { type: 'ADD_PLAYER', player: 'Lana' },

            { type: 'NEXT' },

            { type: 'BUZZ', playerId: 'Eva' },
            { type: 'BUZZ', playerId: 'Lana' },
            { type: 'WRONG_RESPONSE' },

            { type: 'BUZZ', playerId: 'Eva' },
            { type: 'BUZZ', playerId: 'Eva' },

            { type: 'BUZZ', playerId: 'Mic' },
            { type: 'BUZZ', playerId: 'Lana' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' },

            { type: 'BUZZ', playerId: 'Mic' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' }
        ];
        const nextState = actions.reduce(reducer, Map());
        expect(nextState).to.equal(fromJS({
            players: [ 'Mic', 'Fran', 'Eva', 'Lana' ],
            scores: {
                Mic: 2,
                Fran: 0,
                Eva: 0,
                Lana: 0
            },
            winner: 'Mic',
            archive: [
                { question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Mic' },
                { question: 'What is Sandy lastname', response: 'Kilo', buzzer: 'Mic' }
            ]
        }))
    });

    it('handle sequencial actions and ending on tied scores', () => {
        const actions = [
            { type: 'SET_ENTRIES', entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ] },
            { type: 'SET_PLAYERS', players: [ 'Mic', 'Fran', 'Eva', 'Lana' ] },
            { type: 'NEXT' },
            { type: 'BUZZ', playerId: 'Mic' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' },
            { type: 'BUZZ', playerId: 'Fran' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' }
        ];
        const nextState = actions.reduce(reducer, Map());
        expect(nextState).to.equal(fromJS({
            players: [ 'Mic', 'Fran', 'Eva', 'Lana' ],
            scores: {
                Mic: 1,
                Fran: 1,
                Eva: 0,
                Lana: 0
            },
            entries: [
                { question: 'Bonus' }
            ],
            archive: [
                { question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Mic' },
                { question: 'What is Sandy lastname', response: 'Kilo', buzzer: 'Fran' }
            ]
        }))
    });

    it('handle sequencial actions with tie break time', () => {
        const tieBreakState = fromJS({
            players: [ 'Mic', 'Fran', 'Eva', 'Lana' ],
            scores: {
                Mic: 1,
                Fran: 1,
                Eva: 0,
                Lana: 0
            },
            entries: [
                { question: 'Bonus' }
            ],
            archive: [
                { question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Mic' },
                { question: 'What is Sandy lastname', response: 'Kilo', buzzer: 'Fran' }
            ]
        })
        const actions = [
            { type: 'NEXT' },
            { type: 'BUZZ', playerId: 'Fran'},
            { type: 'RIGHT_RESPONSE'},
            { type: 'NEXT'}
        ];
        const nextState = actions.reduce(reducer, tieBreakState);
        expect(nextState).to.equal(fromJS({
            players: [ 'Mic', 'Fran', 'Eva', 'Lana' ],
            scores: {
                Mic: 1,
                Fran: 2,
                Eva: 0,
                Lana: 0
            },
            winner: 'Fran',
            archive: [
                { question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Mic' },
                { question: 'What is Sandy lastname', response: 'Kilo', buzzer: 'Fran' },
                { question: 'Bonus', buzzer: 'Fran' }
            ]
        }))
    });

});
