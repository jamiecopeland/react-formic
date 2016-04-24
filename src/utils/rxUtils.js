import { Observable } from 'rx';

export function createStreamFromSuperagentRequest(request, shouldAbortOnDispose = true) {
  return Observable.create(observer => {
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
