import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../api';
import { routerNavigation } from './testing';

import {
  create, createSuccess,
  update, updateSuccess,
  get, getSuccess,
  list, listSuccess,
} from './actions';

import { EffectsService } from './effects.service';

interface Item {
  id: string;
  name: string;
}

const fakeType = 'items';

const fakeName = (i: number) => 'Fake item ' + i;

const fakeItem = (i: number) => ({
  id: String(i),
  name: fakeName(i),
});

const fakeItems = () => [
  fakeItem(1),
  fakeItem(2),
];

@Injectable()
class TestEffectsService extends EffectsService<Item> {

  constructor(actions$: Actions, api: ApiService) {
    super(fakeType, actions$, api);
  }
}

describe('EffectsService', () => {

  const otherAction = () => ({
    type: 'OTHER',
  });

  let effects: TestEffectsService;
  let actions: Observable<any>;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj('ApiService', ['get', 'post', 'patch']);

    TestBed.configureTestingModule({
      providers: [
        TestEffectsService,
        provideMockActions(() => actions),
        { provide: ApiService, useValue: api },
      ],
    });

    effects = TestBed.get(TestEffectsService);
  });

  describe('create$', () => {

    const fakeRequest = () => ({
      name: fakeName(1),
    });

    const fakeResponse = () => fakeItem(1);

    const values = () => ({
      a: create<Item>(fakeType)(fakeRequest()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: createSuccess<Item>(fakeType)(fakeResponse()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      api.post.and.returnValue(hot('b|', values()));
    });

    it('calls api.post() once with correct parameters in response to CREATE action', () => {
      expect(effects.create$).toBeObservable(hot('c|', values()));

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith([fakeType], fakeRequest());
    });

    it('outputs CREATE_SUCCESS action with result of api.post() in response to CREATE action', () => {
      expect(effects.create$).toBeObservable(hot('d|', values()));
    });

    it('restricts input action to CREATE', () => {
      actions = hot('o|', values());

      expect(effects.create$).toBeObservable(hot('-|', values()));
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  describe('update$', () => {

    const fakeRequest = () => ({
      id: '1',
      changes: {
        name: fakeName(1),
      },
    });

    const fakeResponse = () => fakeRequest();

    const values = () => ({
      a: update<Item>(fakeType)(fakeRequest()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: updateSuccess<Item>(fakeType)(fakeResponse()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      api.patch.and.returnValue(hot('b|', values()));
    });

    it('calls api.patch() once with correct parameters in response to UPDATE action', () => {
      expect(effects.update$).toBeObservable(hot('c|', values()));

      expect(api.patch).toHaveBeenCalledTimes(1);
      expect(api.patch).toHaveBeenCalledWith(
        [fakeType, fakeRequest().id], fakeRequest().changes,
      );
    });

    it('outputs UPDATE_SUCCESS action with result of api.patch() in response to UPDATE action', () => {
      expect(effects.update$).toBeObservable(hot('d|', values()));
    });

    it('restricts input action to UPDATE', () => {
      actions = hot('o|', values());

      expect(effects.update$).toBeObservable(hot('-|', values()));
      expect(api.patch).not.toHaveBeenCalled();
    });
  });

  describe('get$', () => {

    const fakeRequest = () => '1';

    const fakeResponse = () => fakeItem(1);

    const values = () => ({
      a: get(fakeType)(fakeRequest()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: getSuccess<Item>(fakeType)(fakeResponse()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      api.get.and.returnValue(hot('b|', values()));
    });

    it('calls api.get() once with correct parameters in response to GET action', () => {
      expect(effects.get$).toBeObservable(hot('c|', values()));

      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith([fakeType, fakeRequest()]);
    });

    it('outputs GET_SUCCESS action with result of api.get() in response to GET action', () => {
      expect(effects.get$).toBeObservable(hot('d|', values()));
    });

    it('restricts input action to GET', () => {
      actions = hot('o|', values());

      expect(effects.get$).toBeObservable(hot('-|', values()));
      expect(api.get).not.toHaveBeenCalled();
    });
  });

  describe('list$', () => {

    const fakeRequest = () => ({
      limit: 42,
    });

    const fakeResponse = () => ({
      items: fakeItems(),
    });

    const values = () => ({
      a: list(fakeType)(fakeRequest()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: listSuccess<Item>(fakeType)(fakeItems()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      api.get.and.returnValue(hot('b|', values()));
    });

    it('calls api.get() once with correct parameters in response to LIST action', () => {
      expect(effects.list$).toBeObservable(hot('c|', values()));

      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith([fakeType], fakeRequest());
    });

    it('outputs LIST_SUCCESS action with result of api.get() in response to LIST action', () => {
      expect(effects.list$).toBeObservable(hot('d|', values()));
    });

    it('cancels in-flight request due to an earlier response', () => {
      actions = hot('aa--|', values());
      api.get.and.returnValues(hot('---b|', values()), hot('--b-|', values()));
      expect(effects.list$).toBeObservable(hot('--c-|', values()));
    });

    it('restricts input action to LIST', () => {
      actions = hot('o|', values());

      expect(effects.list$).toBeObservable(hot('-|', values()));
      expect(api.get).not.toHaveBeenCalled();
    });
  });

  describe('routeList$', () => {
    const fakeLimit = 75;

    const fakeParams = () => ({
      limit: fakeLimit,
    });

    it('outputs LIST action once for routerState url of matching item type with defined "limit"', () => {

      const values = () => ({
        a: routerNavigation({
          url: '/items;param=...;limit=' + fakeLimit + ';param2=...',
          params: fakeParams(),
        }),
        b: list(fakeType)(fakeParams()),
      });

      actions = hot('a|', values());

      expect(effects.routeList$).toBeObservable(hot('b|', values()));
    });

    describe('does not output LIST action if routerState url', () => {
      let url: string;
      let params: any;

      it('does not start with matching item type', () => {
        url = '/other_items';
        params = {};
      });

      it('does not start with matching item type, but does define "limit" param', () => {
        url = '/other_items;limit=' + fakeLimit + ';param=...';
        params = fakeParams();
      });

      it('starts with matching item type, but param "limit" is not defined', () => {
        url = '/items;param=...';
        params = {};
      });

      afterEach(() => {
        const values = () => ({
          a: routerNavigation({ url, params }),
        });

        actions = hot('a|', values());

        expect(effects.routeList$).toBeObservable(hot('-|', values()));
      });
    });
  });
});
