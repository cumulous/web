import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { list } from './actions';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;
  let spyOnStore: jasmine.SpyObj<Store<any>>;

  beforeEach(() => {
    spyOnStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    TestBed.configureTestingModule({
      providers: [
        StoreService,
        { provide: Store, useValue: spyOnStore },
      ],
    });

    service = TestBed.get(StoreService);
  });

  describe('select()', () => {
    let selector: jasmine.Spy;
    let result: any;
    let expected: jasmine.Spy;

    beforeEach(() => {
      selector = jasmine.createSpy('selector');
      expected = jasmine.createSpy('expected');
      spyOnStore.select.and.returnValue(expected);
      result = service.select(selector);
    });

    it('calls store.select() once with correct parameter', () => {
      expect(spyOnStore.select).toHaveBeenCalledTimes(1);
      expect(spyOnStore.select).toHaveBeenCalledWith(selector);
    });

    it('returs the value from store.select()', () => {
      expect(result).toBe(expected);
    });
  });

  it('list() calls store.dispatch() once with correct parameter', () => {
    const fakeType = 'fake-type';
    const fakePayload = () => ({
      limit: 4200,
    });

    service.list(fakeType, fakePayload());
    expect(spyOnStore.dispatch).toHaveBeenCalledTimes(1);
    expect(spyOnStore.dispatch).toHaveBeenCalledWith(
      list(fakeType)(fakePayload()),
    );
  });
});
