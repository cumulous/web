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

import { Store } from './models';
import * as selectors from './selectors';

import { EffectsService } from './effects.service';

interface Item {
  id: string;
  name: string;
  project_id?: string;
}

const fakeType = 'items';

const fakeName = (i: number) => 'Fake item ' + i;

const fakeProjectId = (i: number) => 'fake-project-' + i;

const fakeItem = (i: number, project = true) => ({
  id: String(i),
  name: fakeName(i),
  project_id: project ? fakeProjectId(Math.ceil(i / 2)) : undefined,
});

const fakeItems = (limit: number, project = true) =>
  Array.from({ length: limit }, (d, i) => fakeItem(i + 1, project));

const fakeProjects = () => ({
  [fakeProjectId(1)]: {},
  [fakeProjectId(2)]: {},
});

@Injectable()
class TestEffectsService extends EffectsService<Item> {

  constructor(actions$: Actions, api: ApiService, store: Store) {
    super(fakeType, actions$, api, store);
  }
}

describe('EffectsService', () => {

  const otherAction = () => ({
    type: 'OTHER',
  });

  let effects: TestEffectsService;
  let actions: Observable<any>;
  let api: jasmine.SpyObj<ApiService>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    api = jasmine.createSpyObj('ApiService', ['get', 'post', 'patch']);

    store = jasmine.createSpyObj('Store', ['select']);
    spyOn(selectors, 'createSelectors').and.callFake(type => {
      if (type === 'projects') {
        return { itemMap: Observable.of(fakeProjects()) };
      }
    });
    store.select.and.callFake(selected => selected);

    TestBed.configureTestingModule({
      providers: [
        TestEffectsService,
        provideMockActions(() => actions),
        { provide: ApiService, useValue: api },
        { provide: Store, useValue: store },
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
      items: fakeItems(2),
    });

    const values = () => ({
      a: list(fakeType)(fakeRequest()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: listSuccess<Item>(fakeType)(fakeItems(2)),
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

  describe('listSuccess$', () => {

    const values = () => ({
      a: listSuccess<Item>(fakeType)(fakeItems(8)),
      b: get('projects')(fakeProjectId(3)),
      c: get('projects')(fakeProjectId(4)),
      d: listSuccess<Item>(fakeType)(fakeItems(8, false)),
      g: listSuccess<Item>(fakeType)(fakeItems(4)),
      o: otherAction(),
    });

    it('outputs GET actions for all project IDs not in the store in response to LIST_SUCCESS action', () => {
      actions = hot('a---|', values());

      expect(effects.listSuccess$).toBeObservable(hot('(bc)|', values()));
    });

    describe('does not output any actions if', () => {
      let action: string;

      it('input action is not LIST_SUCCESS', () => action = 'o');

      it('input list does not contain project IDs', () => action = 'd');

      it('all of project IDs are in the store', () => action = 'g');

      afterEach(() => {
        actions = hot(action + '|', values());

        expect(effects.listSuccess$).toBeObservable(hot('-|', values()));
      });
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
