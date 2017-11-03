import { Router } from '@angular/router';

import { notify } from './router';

describe('router notify() calls router.navigate() once with correct parameters if', () => {
  let router: jasmine.SpyObj<Router>;
  let data: Error | string;
  let text: string;
  let dataClass: string;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
  });

  it('data is an Error object', () => {
    text = 'Some error';
    data = Error(text);
    dataClass = 'error';
  });

  it('data is an Error object', () => {
    text = 'Some info';
    data = text;
    dataClass = 'info';
  });

  afterEach(() => {
    notify(router, data);

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith([{
      outlets: {
        notification: ['message', {
          text,
          class: dataClass,
        }],
      },
    }]);
  });
});
