import Rx from 'rx';

export function createStreamFromSuperagentRequest(request, shouldAbortOnDispose = true) {
  return Rx.Observable.create(observer => {
    const call = request
      .end((err, response) => {
        if (err) {
          observer.onError(err);
        } else {
          observer.onNext(response);
        }
        observer.onCompleted();
      });

    return () => {
      if (shouldAbortOnDispose) {
        call.abort();
      }
    };
  });
}
