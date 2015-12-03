import { List, Set } from 'immutable'

export function keyIn(/*...keys*/) {
  var keySet = Set(arguments);
  return function (v, k) {
    return keySet.has(k);
  }
}

export function findPlayerIndexBy(state, attribute, criteria) {
    return state.get('players', List()).findIndex(player => player.get(attribute) === criteria);
}

export function findPlayerBy(state, attribute, criteria) {
    return state.get('players', List()).find(player => player.get(attribute) === criteria);
}
