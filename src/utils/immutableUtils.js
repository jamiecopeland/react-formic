import { Iterable } from 'immutable';

export function logImmutable(...rest) {
  console.log.apply( // eslint-disable-line
    console,
    Array.from(rest).map(item => Iterable.isIterable(item) ? item.toJS() : item) // eslint-disable-line
  );
}
