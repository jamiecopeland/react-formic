import Rx from 'rx';
import RxDOM from 'rx-dom';
import superagent from 'superagent';
import purdy from 'purdy';

const url = 'http://localhost:3000/api/things';

var requestStream = Rx.Observable.just(url);

function createResponseStream(request, shouldAbortOnDispose = true) {

  return Rx.Observable.create(observer => {
    const call = request
      .end((err, response) => {
        if(err) {
          observer.onError(err);
        } else {
          observer.onNext(response);
        }
        observer.onCompleted();
      });

    return () => {
      if(shouldAbortOnDispose) {
        call.abort();
      }
    }
  });
}

const responseStream1 = createResponseStream(
  superagent
    .get(url)
    .accept('json')
);

const responseStream2 = createResponseStream(
  superagent
    .get(url)
    .accept('json')
);

const responseStream3 = createResponseStream(
  superagent
    .get(url)
    .accept('json')
);

let mergedStreams = responseStream1
  .merge(responseStream2)
  .merge(responseStream3)
  .map(response => response.body.length)
  .subscribe(
    response => {
      console.log('response: ', response);
    },
    error => {
      console.log('error: ', error);
    },
    () => {
      console.log('complete');
    }
  );


// mergedStreams.dispose();


