import Rx from 'rx';

const arr = ['a', '1', 'b', '2', '3', 'c', 'd', '4', '5', 'e', 'f'];

var source = Rx.Observable
  .interval(100)
  .take(7)
  .map(i => arr[i]);
  // .of('a', '1', 'b', '2', '3', 'c', 'd', '4', '5', 'e', 'f')
  // .take(7)

var resultString = source
  .map(x => x)
  .filter(x => isNaN(x))

var resultNumber = source
  .map(x => parseInt(x))
  .filter(x => !isNaN(x))
  // .debounce(1000)

const resultAny = source;

resultNumber.subscribe(x => console.log(x));
