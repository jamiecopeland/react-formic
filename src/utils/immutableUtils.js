import { Iterable } from 'immutable';

import { mapObjectToObject } from './objectUtils';

/**
 * console.log but with toJS being called on iterable/immutable objects
 */
export function logImmutable(...rest) {
  console.log.apply( // eslint-disable-line
    console,
    Array.from(rest).map(item => Iterable.isIterable(item) ? item.toJS() : item) // eslint-disable-line
  );
}

/**
 * Converts objects of mixed mutability/immutability into mutable objects
 *
 * Example:
 * const action = {
 *   type: 'setField',
 *   payload: {
 *     fieldName: 'email'
 *     field: Map({
 *       value: 'darth@deathstar.',
 *       validity: 'INVALID',
 *     })
 *   }
 * }
 *
 * console.log(deepToJS(action))
 * // {
 * //   type: 'setField',
 * //   payload: {
 * //     fieldName: 'email'
 * //     field: {
 * //       value: 'darth@deathstar.',
 * //       validity: 'INVALID'
 * //     }
 * //   }
 * // }
 */
export function toJS(node) {
  let output;
  if (Iterable.isIterable(node)) {
    output = node.toJS();
  } else {
    switch (typeof node) {
      case 'object':
        output = node === null
          ? null
          : mapObjectToObject(node, childNode => toJS(childNode));
        break;
      case 'array':
        output = node.map(childNode => toJS(childNode));
        break;
      default:
        output = node;
    }
  }
  return output;
}
