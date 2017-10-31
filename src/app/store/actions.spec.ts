import { Action, ActionCreator, actionCreatorFactory } from 'typescript-fsa';

import {
  login, loginSuccess, loginFailure, loginRedirect, logout,
  create, createSuccess, createFailure,
  update, updateSuccess, updateFailure,
  get, getSuccess, getFailure,
  list, listSuccess, listFailure,
} from './actions';

interface Item {
  id: string;
  name: string;
}

describe('store creates action of correct type and shape using', () => {
  const fakeFamily = 'fake-family';
  const fakeId = '1234-abcd';
  const fakeName = 'fake-name';
  const fakeLimit = 42;

  let type: string;
  let family: string;
  let payload: () => any;
  let factory: ActionCreator<any>;

  beforeEach(() => {
    type = '';
    family = fakeFamily;
    payload = () => undefined;
    factory = actionCreatorFactory()(type);
  });

  it('login() factory', () => {
    type = 'LOGIN';
    family = 'auth';
    payload = () => 'fake-from-url';
    factory = login;
  });

  it('loginSuccess() factory', () => {
    type = 'LOGIN_SUCCESS';
    family = 'auth';
    payload = () => 'fake-token';
    factory = loginSuccess;
  });

  it('loginFailure() factory', () => {
    type = 'LOGIN_FAILURE';
    family = 'auth';
    payload = () => new Error('LOGIN error');
    factory = loginFailure;
  });

  it('loginRedirect() factory', () => {
    type = 'LOGIN_REDIRECT';
    family = 'auth';
    payload = () => 'fake-from-url';
    factory = loginRedirect;
  });

  it('logout() factory', () => {
    type = 'LOGOUT';
    family = 'auth';
    payload = () => undefined;
    factory = logout;
  });

  it('create() factory', () => {
    type = 'CREATE';
    payload = () => ({
      name: fakeName,
    });
    factory = create<Item>(fakeFamily);
  });

  it('createSuccess() factory', () => {
    type = 'CREATE_SUCCESS';
    payload = () => ({
      id: fakeId,
      name: fakeName,
    });
    factory = createSuccess<Item>(fakeFamily);
  });

  it('createFailure() factory', () => {
    type = 'CREATE_FAILURE';
    payload = () => new Error('CREATE error');
    factory = createFailure(fakeFamily);
  });

  it('update() factory', () => {
    type = 'UPDATE';
    payload = () => ({
      id: fakeId,
      changes: {
        name: fakeName,
      },
    });
    factory = update<Item>(fakeFamily);
  });

  it('updateSuccess() factory', () => {
    type = 'UPDATE_SUCCESS';
    payload = () => ({
      id: fakeId,
      changes: {
        name: fakeName,
      },
    });
    factory = updateSuccess<Item>(fakeFamily);
  });

  it('updateFailure() factory', () => {
    type = 'UPDATE_FAILURE';
    payload = () => new Error('UPDATE error');
    factory = updateFailure(fakeFamily);
  });

  it('get() factory', () => {
    type = 'GET';
    payload = () => fakeId;
    factory = get(fakeFamily);
  });

  it('getSuccess() factory', () => {
    type = 'GET_SUCCESS';
    payload = () => ({
      id: fakeId,
      name: fakeName,
    });
    factory = getSuccess<Item>(fakeFamily);
  });

  it('getFailure() factory', () => {
    type = 'GET_FAILURE';
    payload = () => Object.assign({
      id: fakeId,
    }, new Error('GET error'));
    factory = getFailure(fakeFamily);
  });

  it('list() factory', () => {
    type = 'LIST';
    payload = () => ({
      limit: fakeLimit,
    });
    factory = list(fakeFamily);
  });

  it('listSuccess() factory', () => {
    type = 'LIST_SUCCESS';
    payload = () => [{
      id: fakeId,
      name: fakeName,
    }];
    factory = listSuccess<Item>(fakeFamily);
  });

  it('listFailure() factory', () => {
    type = 'LIST_FAILURE';
    payload = () => new Error('LIST error');
    factory = listFailure(fakeFamily);
  });

  afterEach(() => {
    const action = factory(payload());
    const expected: Action<any> = {
      type: family + '/' + type,
      payload: payload(),
    };
    if (expected.payload instanceof Error) {
      expected.error = true;
    }
    expect(action).toEqual(expected);
  });
});
