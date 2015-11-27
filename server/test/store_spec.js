import { Map, fromJS } from 'immutable'
import { expect } from 'chai'

import { keyIn } from '../src/utils'
import makeStore, { initialState } from '../src/store'

describe('store', () => {
    it('is a Redux store configured with the correct reducer', () => {
        const store = makeStore();
        expect(store.getState()).to.equal(Map(initialState));

        store.dispatch({
            type: 'SET_ENTRIES',
            entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        });
        expect(store.getState().filter(keyIn('entries'))).to.equal(fromJS({
            entries: [
                { question: 'Where is Bryan', response: 'In the kitchen' },
                { question: 'What is Sandy lastname', response: 'Kilo' }
            ]
        }));
    });

});
