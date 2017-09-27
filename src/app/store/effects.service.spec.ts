import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Actions, Effect } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { CreatePayload, create, createSuccess,
         UpdatePayload, update, updateSuccess,
         ListPayload, list, listSuccess } from './actions';

import { EffectsService } from './effects.service';

interface Item {
  id: number;
  name: string;
}

const fakeType = 'items';

const fakeName = (i: number) => 'Fake item ' + i;

const fakeItem = (i: number) => ({
  id: i,
  name: fakeName(i),
});

const fakeItems = () => [
  fakeItem(1),
  fakeItem(2),
];

@Injectable()
class TestEffectsService extends EffectsService<Item> {

  @Effect() readonly create$: Observable<Action>;
  @Effect() readonly update$: Observable<Action>;
  @Effect() readonly list$: Observable<Action>;

  constructor(actions$: Actions) {
    super(fakeType, actions$);
  }

  create(payload: CreatePayload<Item>) {
    return Observable.of({
      id: 1,
      name: payload.name,
    });
  }

  update(payload: UpdatePayload<Item>) {
    return Observable.of({
      id: Number(payload.id),
      name: payload.changes.name,
    });
  }

  list(payload: ListPayload) {
    return Observable.of({
      items: fakeItems(),
    });
  }
}

describe('EffectsService', () => {
  let service: TestEffectsService;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestEffectsService,
        provideMockActions(() => actions)
      ],
    });

    service = TestBed.get(TestEffectsService);
  });

  describe('create$', () => {
    const fakePayload = () => ({
      name: fakeName(1),
    });

    let spyOnCreate: jasmine.Spy;

    beforeEach(() => {
      spyOnCreate = spyOn(service, 'create').and.callThrough();

      actions = new BehaviorSubject(
        create(fakeType)(fakePayload())
      );
    });

    it('calls list() method once with correct parameters', () => {
      service.create$.subscribe(() => {
        expect(spyOnCreate).toHaveBeenCalledTimes(1);
        expect(spyOnCreate).toHaveBeenCalledWith(fakePayload());
      });
    });

    it('proxies result from list() method to listSuccess() action', () => {
      service.create$.subscribe(result => {
        expect(result).toEqual(createSuccess(fakeType)(fakeItem(1)));
      });
    });
  });

  describe('update$', () => {
    const fakePayload = () => ({
      id: '1',
      changes: {
        name: fakeName(2),
      },
    });

    let spyOnUpdate: jasmine.Spy;

    beforeEach(() => {
      spyOnUpdate = spyOn(service, 'update').and.callThrough();

      actions = new BehaviorSubject(
        update(fakeType)(fakePayload())
      );
    });

    it('calls update() method once with correct parameters', () => {
      service.update$.subscribe(() => {
        expect(spyOnUpdate).toHaveBeenCalledTimes(1);
        expect(spyOnUpdate).toHaveBeenCalledWith(fakePayload());
      });
    });

    it('proxies result from list() method to listSuccess() action', () => {
      service.update$.subscribe(result => {
        expect(result).toEqual(updateSuccess(fakeType)(fakePayload()));
      });
    });
  });

  describe('list$', () => {
    const fakePayload = () => ({
      limit: 75,
    });

    let spyOnList: jasmine.Spy;

    beforeEach(() => {
      spyOnList = spyOn(service, 'list').and.callThrough();

      actions = new BehaviorSubject(
        list(fakeType)(fakePayload())
      );
    });

    it('calls list() method once with correct parameters', () => {
      service.list$.subscribe(() => {
        expect(spyOnList).toHaveBeenCalledTimes(1);
        expect(spyOnList).toHaveBeenCalledWith(fakePayload());
      });
    });

    it('proxies result from list() method to listSuccess() action', () => {
      service.list$.subscribe(result => {
        expect(result).toEqual(listSuccess(fakeType)(fakeItems()));
      });
    });
  });
});
