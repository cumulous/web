import { create, createSuccess, update, updateSuccess, list, listSuccess } from './actions';
import { Property } from './models';
import { createReducer } from './reducer';

interface Action {
  type: string;
}

interface Item {
  id: any;
  name: string;
}

describe('reducer factory generates a reducer that', () => {
  const fakeFamily = 'fake-family';
  const fakePropName = 'prop';
  const fakeLimit = 7500;

  const fakeProperties = () => [
    new Property(fakePropName),
  ];

  const fakePropInitState = () => ({
    ids: [fakePropName],
    entities: {
      [fakePropName]: new Property(fakePropName),
    },
  });

  const fakeId = (i: number) => 'fake-id-' + i;
  const fakeName = (i: number) => 'Fake name ' + i;

  const fakeItem = (i: number) => ({
    id: fakeId(i),
    name: fakeName(i),
  });

  const fakePartialItem = (i: number) => ({
    name: fakeName(i),
  });

  const fakeInputState = () => ({
    requestCount: 1,
    properties: fakePropInitState(),
    ids: [
      fakeId(1),
    ],
    entities: {
      [fakeId(1)]: fakeItem(1),
    },
  });

  const inputState = fakeInputState();
  const initProperties = inputState.properties;
  const initPropertyIds = inputState.properties.ids;
  const initPropertyEntities = inputState.properties.entities;
  const initPropertyEntity0 = inputState.properties.entities[0];
  const initIds = inputState.ids;
  const initEntities = inputState.entities;
  const initEntity0 = inputState.entities[0];

  let reducer: (state: any, action: Action) => any;

  beforeEach(() => {
    reducer = createReducer<Item>(fakeFamily, fakeProperties());
  });

  it('corectly constructs the initial state', () => {
    const state = reducer(undefined, { type: 'INIT' });
    expect(state).toEqual({
      requestCount: 0,
      properties: fakePropInitState(),
      ids: [],
      entities: {},
    });
  });

  it('corectly reduces CREATE action', () => {
    const action = create<Item>(fakeFamily)(fakePartialItem(2));
    const state = reducer(inputState, action);
    expect(state.requestCount).toBe(2);
    expect(state.properties).toBe(initProperties);
    expect(state.ids).toBe(initIds);
    expect(state.entities).toBe(initEntities);
  });

  it('corectly reduces CREATE_SUCCESS action', () => {
    const action = createSuccess<Item>(fakeFamily)(fakeItem(2));
    const state = reducer(inputState, action);
    expect(state.requestCount).toBe(0);
    expect(state.properties).toBe(initProperties);
    expect(state.ids).toEqual([
      fakeId(1),
      fakeId(2),
    ]);
    expect(state.entities).toEqual({
      [fakeId(1)]: fakeItem(1),
      [fakeId(2)]: fakeItem(2),
    });
  });

  it('corectly reduces UPDATE action', () => {
    const action = update<Item>(fakeFamily)({
      id: fakeId(1),
      changes: fakePartialItem(2),
    });
    const state = reducer(inputState, action);
    expect(state.requestCount).toBe(2);
    expect(state.properties).toBe(initProperties);
    expect(state.ids).toBe(initIds);
    expect(state.entities).toBe(initEntities);
  });

  it('corectly reduces UPDATE_SUCCESS action', () => {
    const action = updateSuccess<Item>(fakeFamily)({
      id: fakeId(1),
      changes: fakePartialItem(2),
    });
    const state = reducer(inputState, action);
    expect(state.requestCount).toBe(0);
    expect(state.properties).toBe(initProperties);
    expect(state.ids).toEqual([
      fakeId(1),
    ]);
    expect(state.entities).toEqual({
      [fakeId(1)]: {
        id: fakeId(1),
        name: fakeName(2),
      },
    });
  });

  it('corectly reduces LIST action', () => {
    const action = list(fakeFamily)({
      limit: fakeLimit,
    });
    const state = reducer(inputState, action);
    expect(state.requestCount).toBe(2);
    expect(state.properties).toBe(initProperties);
    expect(state.ids).toBe(initIds);
    expect(state.entities).toBe(initEntities);
  });

  it('corectly reduces LIST_SUCCESS action', () => {
    const action = listSuccess<Item>(fakeFamily)([
      fakeItem(2),
      fakeItem(3),
    ]);
    const state = reducer(inputState, action);
    expect(state.requestCount).toBe(0);
    expect(state.properties).toBe(initProperties);
    expect(state.ids).toEqual([
      fakeId(2),
      fakeId(3),
    ]);
    expect(state.entities).toEqual({
      [fakeId(2)]: fakeItem(2),
      [fakeId(3)]: fakeItem(3),
    });
  });

  afterEach(() => {
    expect(inputState).toEqual(fakeInputState());
    expect(inputState.properties).toBe(initProperties);
    expect(inputState.properties.ids).toBe(initPropertyIds);
    expect(inputState.properties.entities).toBe(initPropertyEntities);
    expect(inputState.properties.entities[0]).toBe(initPropertyEntity0);
    expect(inputState.ids).toBe(initIds);
    expect(inputState.entities).toBe(initEntities);
    expect(inputState.entities[0]).toBe(initEntity0);
  });
});
