import { actionCreatorFactory, ActionCreator } from 'typescript-fsa';

import {
  create, createSuccess, update, updateSuccess,
  get, getSuccess, list, listSuccess,
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
  let payload: () => any;
  let factory: ActionCreator<any>;

  beforeEach(() => {
    type = '';
    payload = () => undefined;
    factory = actionCreatorFactory()(type);
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

  afterEach(() => {
    const action = factory(payload());
    expect(action).toEqual({
      type: fakeFamily + '/' + type,
      payload: payload(),
    });
  });
});
