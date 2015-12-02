import { fromJS } from 'immutable'
import { expect } from 'chai'

import { keyIn } from '../src/utils'
import * as Core from '../src/core'

describe('application initialization', () => {
    it('set quizz entries', () => {
        const state = fromJS({});
        const entries = [
            { question: 'Where is Bryan', response: 'In the kitchen' },
            { question: 'What is Sandy lastname', response: 'Kilo' }
        ];
        const nextState = Core.setEntries(state, entries);
        expect(nextState).to.equal(fromJS({
            entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        }));
    });
});

describe('application logic', () => {
    describe('player', () => {
        it('add new player', () => {
            const state = fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 0, isConnected: true, isReady: false }
                ]
            });
            const nextState = Core.addPlayer(state, 'Sandy', 2);
            expect(nextState).to.equal(fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 0, isConnected: true, isReady: false },
                    { id: 2, player: 'Sandy', score: 0, isConnected: true, isReady: false }
                ]
            }));
        });

        it('add existing player', () => {
            const state = fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 0, isConnected: true },
                    { id: 2, player: 'Sandy', score: 0, isConnected: false }
                ]
            });
            const nextState = Core.addPlayer(state, 'Sandy', 2);
            expect(nextState).to.equal(fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 0, isConnected: true },
                    { id: 2, player: 'Sandy', score: 0, isConnected: true }
                ]
            }));
        });

        it('remove player', () => {
            const state = fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 0 },
                    { id: 2, player: 'Sandy', score: 0 }
                ]
            });
            const nextState = Core.removePlayer(state, 'Bryan');
            expect(nextState).to.equal(fromJS({
                players: [
                    { id: 2, player: 'Sandy', score: 0 }
                ]
            }));
        });

        it('disconnectPlayer', () => {
            const state = fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 0, isConnected: true },
                    { id: 2, player: 'Sandy', score: 0, isConnected: true }
                ]
            });
            const nextState = Core.disconnectPlayer(state, 1);
            expect(nextState).to.equal(fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 0, isConnected: false },
                    { id: 2, player: 'Sandy', score: 0, isConnected: true }
                ]
            }));
        });
    });

    describe('next', () => {
        it('pick the next question and clear outted player', () => {
            const state = fromJS({
                out: ['Sandy', 'Bryan'],
                entries: [
                    { question: 'Where is Bryan', response: 'In the kitchen' },
                    { question: 'What is Sandy lastname', response: 'Kilo' }
                ]
            });
            const nextState = Core.next(state);
            expect(nextState.filter(keyIn('quizz', 'entries'))).to.equal(fromJS({
                quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
                entries : [
                    { question: 'What is Sandy lastname', response: 'Kilo' }
                ]
            }));
        });

        it('have a winner', () => {
            const state = fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 3 },
                    { id: 2, player: 'Sandy', score: 1 }
                ],
                entries: []
            });
            const nextState = Core.next(state);
            expect(nextState.filter(keyIn('players', 'winner'))).to.equal(fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 3 },
                    { id: 2, player: 'Sandy', score: 1 }
                ],
                winner: 'Bryan'
            }));
        });

        it('tied winner', () => {
            const state = fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 3 },
                    { id: 2, player: 'Sandy', score: 3 }
                ],
                entries: []
            });
            const nextState = Core.next(state);
            expect(nextState).to.equal(fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 3 },
                    { id: 2, player: 'Sandy', score: 3 }
                ],
                entries: [
                    { question: 'Bonus' }
                ]
            }));
        });
    });

    describe('buzz', () => {
        it('set the player to buzzer', () => {
            const state = fromJS({
                quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
                entries : [
                    { question: 'What is Sandy lastname', response: 'Kilo' }
                ]
            });
            const nextState = Core.buzz(state, 'Bryan');
            expect(nextState.filter(keyIn('buzzer', 'quizz', 'entries'))).to.equal(fromJS({
                buzzer: 'Bryan',
                quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
                entries : [
                    { question: 'What is Sandy lastname', response: 'Kilo' }
                ]
            }));
        });
        it('cannot buzz when player is out', () => {
            const state = fromJS({
                out: ['Sandy'],
                quizz: { question: 'Where is Bryan', response: 'In the kitchen' },
                entries : [
                    { question: 'What is Sandy lastname', response: 'Kilo' }
                ]
            });
            const nextState = Core.buzz(state, 'Sandy');
            expect(nextState).to.equal(state);
        });
    });

    describe('responding', () => {
        it('give the right response', () => {
            const state = fromJS({
                buzzer: 'Bryan',
                players: [
                    { id: 1, player: 'Bryan', score: 0 }
                ],
                quizz: { question: 'Where is Bryan', response: 'In the kitchen' }
            });
            const nextState = Core.rightResponse(state);
            expect(nextState.filter(keyIn('players', 'archive'))).to.equal(fromJS({
                players: [
                    { id: 1, player: 'Bryan', score: 1 }
                ],
                archive: [
                    { question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Bryan' }
                ]
            }));
        });

        it('give the wrong response', () => {
            const state = fromJS({
                buzzer: 'Bryan',
                quizz: { question: 'Where is Bryan', response: 'In the kitchen' }
            });
            const nextState = Core.wrongResponse(state);
            expect(nextState.filter(keyIn('out', 'quizz'))).to.equal(fromJS({
                out: ['Bryan'],
                quizz: { question: 'Where is Bryan', response: 'In the kitchen' }
            }));
        });
    });
});
