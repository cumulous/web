import { TestBed } from '@angular/core/testing';
import { Action, Store, StoreModule } from '@ngrx/store';

import { Property } from './models';
import { createReducer } from './reducer';
import { createSelectors } from './selectors';
import { ItemsState } from './state';

interface Item {
  id: any;
  name: string;
}

interface State {
  items: ItemsState<Item>;
}

describe('createSelectors() returns correct', () => {
  const fakePropName = 'prop';

  const fakeProperties = () => [
    new Property(fakePropName),
  ];

  const fakePropState = () => ({
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

  const fakeInitState = () => ({
    isLoading: false,
    properties: fakePropState(),
    ids: [
      fakeId(1),
      fakeId(2),
    ],
    entities: {
      [fakeId(1)]: fakeItem(1),
      [fakeId(2)]: fakeItem(2),
    },
  });

  let store: Store<State>;
  let reducer: (state: ItemsState<Item>, action: Action) => any;
  let selectors: {
    [key: string]: (state: State) => any;
  };
  let selector: (state: State) => any;
  let expected: any;

  beforeEach(() => {
    reducer = createReducer<Item>('items', fakeProperties());

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          items: reducer,
        }, {
          initialState: {
            items: fakeInitState(),
          },
        }),
      ],
    });

    store = TestBed.get(Store);

    selectors = createSelectors<Item>('items');
  });

  it('isLoading selector', () => {
    selector = selectors.isLoading;
    expected = false;
  });

  it('itemList selector', () => {
    selector = selectors.itemList;
    expected = [
      fakeItem(1),
      fakeItem(2),
    ];
  });

  it('itemMap selector', () => {
    selector = selectors.itemMap;
    expected = {
      [fakeId(1)]: fakeItem(1),
      [fakeId(2)]: fakeItem(2),
    };
  });

  it('propertyList selector', () => {
    selector = selectors.propertyList;
    expected = [
      new Property(fakePropName),
    ];
  });

  it('propertyMap selector', () => {
    selector = selectors.propertyMap;
    expected = {
      [fakePropName]: new Property(fakePropName),
    };
  });

  afterEach(() => {
    store.select(selector).subscribe(value => {
      expect(value).toEqual(expected);
    });
  });
});
