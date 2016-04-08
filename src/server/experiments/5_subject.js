import Rx from 'rx';

const subject = new Rx.Subject();

subject.subscribe(
  data => {},
  error => {},
  () => {}
);


subject.subscribe(
  data => {console.log('next: ', data);},
  error => {console.log('error: ', error);},
  () => {console.log('completed');}
);

subject.onNext('hello');
// subject.onError('wrong');
subject.onCompleted();