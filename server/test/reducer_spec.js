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
            players: [
                { id: 1, name: 'Bryan', isReady: true }
            ],
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
                { id: 1, name: 'Bryan', score: 0 }
            ],
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'RIGHT_RESPONSE' };
        const nextState = reducer(initialState, action);
        expect(nextState.filter(keyIn('players', 'entries', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, name: 'Bryan', score: 1 }
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
            players: [
                { id: 1, name: 'Bryan', isOut: false }
            ],
            buzzer: 'Bryan',
            quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
            entries: [
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        const action = { type: 'WRONG_RESPONSE' };
        const nextState = reducer(initialState, action);
        expect(nextState.filter(keyIn('players', 'quizz', 'entries'))).to.equal(fromJS({
            players: [
                { id: 1, name: 'Bryan', isOut: true }
            ],
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
            { type: 'ADD_PLAYER', name: 'Mic', id: 1, isReady: true, isReady: true, isReady: true },
            { type: 'ADD_PLAYER', name: 'Fran', id: 2, isReady: true, isReady: true, isReady: true },
            { type: 'ADD_PLAYER', name: 'Eva', id: 3, isReady: true, isReady: true, isReady: true },
            { type: 'ADD_PLAYER', name: 'Lana', id: 4, isReady: true, isReady: true, isReady: true },

            { type: 'NEXT' },

            { type: 'IS_READY', playerId: 'Mic' },
            { type: 'IS_READY', playerId: 'Fran' },
            { type: 'IS_READY', playerId: 'Eva' },
            { type: 'IS_READY', playerId: 'Lana' },

            { type: 'BUZZ', playerId: 'Eva' },
            { type: 'BUZZ', playerId: 'Lana' },
            { type: 'WRONG_RESPONSE' },

            { type: 'BUZZ', playerId: 'Eva' },
            { type: 'BUZZ', playerId: 'Eva' },

            { type: 'BUZZ', playerId: 'Mic' },
            { type: 'BUZZ', playerId: 'Lana' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' },

            { type: 'IS_READY', playerId: 'Mic' },
            { type: 'IS_READY', playerId: 'Fran' },
            { type: 'IS_READY', playerId: 'Eva' },
            { type: 'IS_READY', playerId: 'Lana' },

            { type: 'BUZZ', playerId: 'Mic' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' }
        ];
        const nextState = actions.reduce(reducer, fromJS({}));
        expect(nextState.filter(keyIn('players', 'scores', 'winner', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, name: 'Mic', score: 2, isConnected: true, isReady: true, isOut: false },
                { id: 2, name: 'Fran', score: 0, isConnected: true, isReady: true, isOut: false },
                { id: 3, name: 'Eva', score: 0, isConnected: true, isReady: true, isOut: false },
                { id: 4, name: 'Lana', score: 0, isConnected: true, isReady: true, isOut: false }
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
            { type: 'ADD_PLAYER', name: 'Mic', id: 1, isReady: true, isReady: true },
            { type: 'ADD_PLAYER', name: 'Fran', id: 2, isReady: true, isReady: true },
            { type: 'NEXT' },

            { type: 'IS_READY', playerId: 'Mic' },
            { type: 'IS_READY', playerId: 'Fran' },

            { type: 'BUZZ', playerId: 'Mic' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' },

            { type: 'IS_READY', playerId: 'Mic' },
            { type: 'IS_READY', playerId: 'Fran' },

            { type: 'BUZZ', playerId: 'Fran' },
            { type: 'RIGHT_RESPONSE' },
            { type: 'NEXT' }
        ];
        const nextState = actions.reduce(reducer, fromJS({}));
        expect(nextState.filter(keyIn('players', 'scores', 'entries', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, name: 'Mic', score: 1, isConnected: true, isReady: true, isOut: false },
                { id: 2, name: 'Fran', score: 1, isConnected: true, isReady: true, isOut: false }
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
                { id: 1, name: 'Mic', score: 1, isReady: true },
                { id: 2, name: 'Fran', score: 1, isReady: true }
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

            { type: 'IS_READY', playerId: 'Mic' },
            { type: 'IS_READY', playerId: 'Fran' },

            { type: 'BUZZ', playerId: 'Fran'},
            { type: 'RIGHT_RESPONSE'},
            { type: 'NEXT'}
        ];
        const nextState = actions.reduce(reducer, tieBreakState);
        expect(nextState.filter(keyIn('players', 'scores', 'winner', 'archive'))).to.equal(fromJS({
            players: [
                { id: 1, name: 'Mic', score: 1, isReady: true },
                { id: 2, name: 'Fran', score: 2, isReady: true }
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
