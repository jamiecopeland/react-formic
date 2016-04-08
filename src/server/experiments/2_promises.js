import Rx from 'rx';

var promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('hi jamie');
    // reject(new Error('You did a bad!'));
  }, 300);
})

const responseStream = Rx.Observable.fromPromise(promise);

responseStream.subscribe(
  response => console.log('success',  response),
  error => console.log('error',  error)
);
