import { fromJS } from 'immutable'
import { expect } from 'chai'

import { keyIn } from '../src/utils'
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

    it('handle next step', () => {
        const initialState = fromJS({
            entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'NEXT' };
        const nextState = reducer(initialState, action);
        expect(nextState.filter(keyIn('quizz', 'entries'))).to.equal(fromJS({
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
        expect(nextState.filter(keyIn('buzzer', 'quizz', 'entries'))).to.equal(fromJS({
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
            players: [
                { id: 1, player: 'Bryan', score: 0 }
            ],
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'RIGHT_RESPONSE' };
        const nextState = reducer(initialState, action);
        expect(nextState.filter(keyIn('players', 'entries', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, player: 'Bryan', score: 1 }
            ],
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
        expect(nextState.filter(keyIn('out', 'quizz', 'entries'))).to.equal(fromJS({
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
            { type: 'ADD_PLAYER', player: 'Mic', id: 1 },
            { type: 'ADD_PLAYER', player: 'Fran', id: 2 },
            { type: 'ADD_PLAYER', player: 'Eva', id: 3 },
            { type: 'ADD_PLAYER', player: 'Lana', id: 4 },

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
        const nextState = actions.reduce(reducer, fromJS({}));
        expect(nextState.filter(keyIn('players', 'scores', 'winner', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, player: 'Mic', score: 2 },
                { id: 2, player: 'Fran', score: 0 },
                { id: 3, player: 'Eva', score: 0 },
                { id: 4, player: 'Lana', score: 0 }
            ],
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
            { type: 'ADD_PLAYER', player: 'Mic', id: 1 },
            { type: 'ADD_PLAYER', player: 'Fran', id: 2 },
            { type: 'NEXT' },
            { type: 'BUZZ', playerId: 'Mic' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' },
            { type: 'BUZZ', playerId: 'Fran' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' }
        ];
        const nextState = actions.reduce(reducer, fromJS({}));
        expect(nextState.filter(keyIn('players', 'scores', 'entries', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, player: 'Mic', score: 1 },
                { id: 2, player: 'Fran', score: 1 }
            ],
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
            players: [
                { id: 1, player: 'Mic', score: 1 },
                { id: 2, player: 'Fran', score: 1 }
            ],
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
        expect(nextState.filter(keyIn('players', 'scores', 'winner', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, player: 'Mic', score: 1 },
                { id: 2, player: 'Fran', score: 2 }
            ],
            winner: 'Fran',
            archive: [
                { question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Mic' },
                { question: 'What is Sandy lastname', response: 'Kilo', buzzer: 'Fran' },
                { question: 'Bonus', buzzer: 'Fran' }
            ]
        }))
    });

});
