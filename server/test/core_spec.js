import { List, Map } from 'immutable'
import { expect } from 'chai'

import { setEntries, setPlayers, next, buzz, rightResponse, wrongResponse } from '../src/core'

describe('application initialization', () => {

    it('set quizz entries', () => {
        const state = Map();
        const entries = List.of(
            Map({ question: 'Where is Bryan', response: 'In the kitchen' }),
            Map({ question: 'What is Sandy lastname', response: 'Kilo' })
        );
        const nextState = setEntries(state, entries);
        expect(nextState).to.equal(Map({
            entries: List.of(
                Map({ question: 'Where is Bryan', response: 'In the kitchen' }),
                Map({ question: 'What is Sandy lastname', response: 'Kilo' })
            )
        }));
    });

    it('set players', () => {
        const state = Map();
        const players = List.of( 'Bryan', 'Sandy' )
        const nextState = setPlayers(state, players);
        expect(nextState).to.equal(Map({
            players: List.of( 'Bryan', 'Sandy' )
        }));
    });

});

describe('application logic', () => {
    describe('next', () => {
        it('pick the next question', () => {
            const state = Map({
                entries: List.of(
                    Map({ question: 'Where is Bryan', response: 'In the kitchen' }),
                    Map({ question: 'What is Sandy lastname', response: 'Kilo' })
                )
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                quizz: Map({ question: 'Where is Bryan', response: 'In the kitchen' }),
                entries : List.of(
                    Map({ question: 'What is Sandy lastname', response: 'Kilo' })
                )
            }));
        });
    });

    describe('buzz', () => {
        it('set the player to buzzer', () => {
            const state = Map({
                quizz: Map({ question: 'Where is Bryan', response: 'In the kitchen' }),
                entries : List.of(
                    Map({ question: 'What is Sandy lastname', response: 'Kilo' })
                )
            });
            const nextState = buzz(state, 'Bryan');
            expect(nextState).to.equal(Map({
                buzzer: 'Bryan',
                quizz: Map({ question: 'Where is Bryan', response: 'In the kitchen' }),
                entries : List.of(
                    Map({ question: 'What is Sandy lastname', response: 'Kilo' })
                )
            }));
        });
    });

    describe('responding', () => {
        it('give the right response', () => {
            const state = Map({
                buzzer: 'Bryan',
                quizz: Map({ question: 'Where is Bryan', response: 'In the kitchen' })
            });
            const nextState = rightResponse(state);
            expect(nextState).to.equal(Map({
                scores: Map({ 'Bryan': 1 }),
                archive: List.of(
                    Map({ question: 'Where is Bryan', response: 'In the kitchen', buzzer: 'Bryan' })
                )
            }));
        });

        it('give the wrong response', () => {
            const state = Map({
                buzzer: 'Bryan',
                quizz: Map({ question: 'Where is Bryan', response: 'In the kitchen' })
            });
            const nextState = wrongResponse(state);
            expect(nextState).to.equal(Map({
                out: List.of('Bryan'),
                quizz: Map({ question: 'Where is Bryan', response: 'In the kitchen' })
            }));
        });
    });
});
