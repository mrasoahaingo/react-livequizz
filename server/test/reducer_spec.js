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

});
