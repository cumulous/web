import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';

import { fakeUUIDs } from '../../testing';
import { routerNavigation } from './testing';

import {
  create, createSuccess, createFailure,
  update, updateSuccess, updateFailure,
  get, getSuccess, getFailure,
  list, listSuccess, listFailure,
} from './actions';

import { Store } from './models';
import * as selectors from './selectors';
import { RouterState } from './state';

import { EffectsService } from './effects.service';

interface Item {
  id: string;
  name: string;
  project_id?: string;
  created_by?: string;
}

const fakeType = 'items';

const fakeName = (i: number) => 'Fake item ' + i;

const fakeProjectId = (i: number) => 'fake-project-' + i;

const user_ids = fakeUUIDs(10);

const fakeClientId = (i: number) => 'fake-client-' + i;

const fakeMemberId = (i: number) =>
  i % 2 ? user_ids[Math.ceil(i / 2)] : fakeClientId(Math.ceil(i / 2));

const fakeItemId = (i: number) => 'fake-item-' + i;

const fakeItem = (i: number, project = true, member = true) => ({
  id: fakeItemId(i),
  name: fakeName(i),
  project_id: project ? fakeProjectId(Math.ceil(i / 2)) : undefined,
  created_by: member ? fakeMemberId(i) : undefined,
});

const fakeItems = (limit: number, project = true, member = true) =>
  Array.from({ length: limit }, (_d, i) => fakeItem(i + 1, project, member));

const fakeProjects = () => ({
  [fakeProjectId(1)]: {},
  [fakeProjectId(2)]: {},
});

const fakeUsers = () => ({
  [user_ids[1]]: {},
  [user_ids[2]]: {},
});

const fakeClients = () => ({
  [fakeClientId(1)]: {},
  [fakeClientId(2)]: {},
});

@Injectable()
class TestEffectsService extends EffectsService<Item> {
  constructor(actions$: Actions, http: HttpClient, store: Store) {
    super(fakeType, actions$, http, store);
  }
}

describe('EffectsService', () => {

  const otherAction = () => ({
    type: 'OTHER',
  });

  let effects: TestEffectsService;
  let actions: Observable<Action>;
  let http: jasmine.SpyObj<HttpClient>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch']);

    store = jasmine.createSpyObj('Store', ['select']);
    spyOn(selectors, 'createSelectors').and.callFake(type => {
      switch (type) {
        case 'projects': return {
          itemMap: Observable.of(fakeProjects()),
        };
        case 'users': return {
          itemMap: Observable.of(fakeUsers()),
        };
        case 'clients': return {
          itemMap: Observable.of(fakeClients()),
        };
      }
    });
    store.select.and.callFake(selected => selected);

    TestBed.configureTestingModule({
      providers: [
        TestEffectsService,
        provideMockActions(() => actions),
        { provide: HttpClient, useValue: http },
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

    const fakeError = () => Error('CREATE error');

    const values = () => ({
      a: create<Item>(fakeType)(fakeRequest()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: createSuccess<Item>(fakeType)(fakeResponse()),
      e: createFailure(fakeType)(fakeError()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      http.post.and.returnValue(hot('b|', values()));
    });

    it('calls http.post() once with correct parameters in response to CREATE action', () => {
      expect(effects.create$).toBeObservable(hot('c|', values()));

      expect(http.post).toHaveBeenCalledTimes(1);
      expect(http.post).toHaveBeenCalledWith(fakeType, fakeRequest());
    });

    it('outputs CREATE_SUCCESS action with result of http.post() in response to CREATE action', () => {
      expect(effects.create$).toBeObservable(hot('d|', values()));
    });

    it('outputs CREATE_FAILURE action with an error from http.post() in response to CREATE action', () => {
      http.post.and.returnValue(hot('#|', values(), fakeError()));

      expect(effects.create$).toBeObservable(hot('e|', values()));
    });

    it('restricts input action to CREATE', () => {
      actions = hot('o|', values());

      expect(effects.create$).toBeObservable(hot('-|', values()));
      expect(http.post).not.toHaveBeenCalled();
    });
  });

  describe('update$', () => {

    const fakeRequest = () => ({
      id: '1',
      changes: {
        name: fakeName(1),
      },
    });

    const fakeResponse = () => ({
      id: '1',
      changes: fakeItem(1),
    });

    const fakeError = () => Error('UPDATE error');

    const values = () => ({
      a: update<Item>(fakeType)(fakeRequest()),
      b: fakeItem(1),
      c: jasmine.anything(),
      d: updateSuccess<Item>(fakeType)(fakeResponse()),
      e: updateFailure(fakeType)(fakeError()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      http.patch.and.returnValue(hot('b|', values()));
    });

    it('calls http.patch() once with correct parameters in response to UPDATE action', () => {
      expect(effects.update$).toBeObservable(hot('c|', values()));

      expect(http.patch).toHaveBeenCalledTimes(1);
      expect(http.patch).toHaveBeenCalledWith(
        fakeType + '/' + fakeRequest().id,
        fakeRequest().changes,
      );
    });

    it('outputs UPDATE_SUCCESS action with result of http.patch() in response to UPDATE action', () => {
      expect(effects.update$).toBeObservable(hot('d|', values()));
    });

    it('outputs UPDATE_FAILURE action with an error from http.patch() in response to UPDATE action', () => {
      http.patch.and.returnValue(hot('#|', values(), fakeError()));

      expect(effects.update$).toBeObservable(hot('e|', values()));
    });

    it('restricts input action to UPDATE', () => {
      actions = hot('o|', values());

      expect(effects.update$).toBeObservable(hot('-|', values()));
      expect(http.patch).not.toHaveBeenCalled();
    });
  });

  describe('get$', () => {

    const fakeRequest = () => fakeItemId(1);

    const fakeResponse = () => fakeItem(1);

    const fakeError = () => Error('GET error');

    const fakeFailure = () => Object.assign(fakeError(), {
      id: fakeRequest(),
    });

    const values = () => ({
      a: get(fakeType)(fakeRequest()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: getSuccess<Item>(fakeType)(fakeResponse()),
      e: getFailure(fakeType)(fakeFailure()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      http.get.and.returnValue(hot('b|', values()));
    });

    it('calls http.get() once with correct parameters in response to GET action', () => {
      expect(effects.get$).toBeObservable(hot('c|', values()));

      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith(fakeType + '/' + fakeRequest());
    });

    it('outputs GET_SUCCESS action with result of http.get() in response to GET action', () => {
      expect(effects.get$).toBeObservable(hot('d|', values()));
    });

    it('outputs GET_FAILURE action with an error from http.get() in response to GET action', () => {
      http.get.and.returnValue(hot('#|', values(), fakeError()));

      expect(effects.get$).toBeObservable(hot('e|', values()));
    });

    it('restricts input action to GET', () => {
      actions = hot('o|', values());

      expect(effects.get$).toBeObservable(hot('-|', values()));
      expect(http.get).not.toHaveBeenCalled();
    });
  });

  describe('list$', () => {

    const fakeInput = () => ({
      limit: 42,
    });

    const fakeRequest = () => ({
      limit: '42',
    });

    const fakeResponse = () => ({
      items: fakeItems(2),
    });

    const fakeError = () => Error('LIST error');

    const values = () => ({
      a: list(fakeType)(fakeInput()),
      b: fakeResponse(),
      c: jasmine.anything(),
      d: listSuccess<Item>(fakeType)(fakeItems(2)),
      e: listFailure(fakeType)(fakeError()),
      o: otherAction(),
    });

    beforeEach(() => {
      actions = hot('a|', values());

      http.get.and.returnValue(hot('b|', values()));
    });

    it('calls http.get() once with correct parameters in response to LIST action', () => {
      expect(effects.list$).toBeObservable(hot('c|', values()));

      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.get).toHaveBeenCalledWith(fakeType, { params: fakeRequest() });
    });

    it('outputs LIST_SUCCESS action with result of http.get() in response to LIST action', () => {
      expect(effects.list$).toBeObservable(hot('d|', values()));
    });

    it('outputs LIST_FAILURE action with an error from http.get() in response to LIST action', () => {
      http.get.and.returnValue(hot('#|', values(), fakeError()));

      expect(effects.list$).toBeObservable(hot('e|', values()));
    });

    it('cancels in-flight request due to an earlier response', () => {
      actions = hot('aa--|', values());
      http.get.and.returnValues(hot('---b|', values()), hot('--b-|', values()));
      expect(effects.list$).toBeObservable(hot('--c-|', values()));
    });

    it('restricts input action to LIST', () => {
      actions = hot('o|', values());

      expect(effects.list$).toBeObservable(hot('-|', values()));
      expect(http.get).not.toHaveBeenCalled();
    });
  });

  describe('listSuccess$', () => {

    const values = () => ({
      a: listSuccess<Item>(fakeType)(fakeItems(8)),
      b: get('projects')(fakeProjectId(3)),
      c: get('projects')(fakeProjectId(4)),
      d: get('users')(user_ids[3]),
      g: get('users')(user_ids[4]),
      h: get('clients')(fakeClientId(3)),
      k: get('clients')(fakeClientId(4)),
      n: listSuccess<Item>(fakeType)(fakeItems(8, false, false)),
      p: listSuccess<Item>(fakeType)(fakeItems(4)),
      o: otherAction(),
    });

    it('outputs GET actions for all project, user and client IDs not in the store ' +
       'in response to LIST_SUCCESS action', () => {
      actions = hot('a-------|', values());

      expect(effects.listSuccess$).toBeObservable(hot('(bcdghk)|', values()));
    });

    describe('does not output any actions if', () => {
      let action: string;

      it('input action is not LIST_SUCCESS', () => action = 'o');

      it('input list does not contain project or member IDs', () => action = 'n');

      it('all of project and member IDs are in the store', () => action = 'p');

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
          params: {
            primary: fakeParams(),
          },
        }),
        b: list(fakeType)(fakeParams()),
      });

      actions = hot('a|', values());

      expect(effects.routeList$).toBeObservable(hot('b|', values()));
    });

    describe('does not output LIST action if routerState url', () => {
      let payload: RouterState;

      it('does not start with matching item type', () => {
        payload = {
          url: '/other_items',
          params: {},
        };
      });

      it('does not start with matching item type, but does define "limit" param', () => {
        payload = {
          url: '/other_items;limit=' + fakeLimit + ';param=...',
          params: {
            primary: fakeParams(),
          },
        };
      });

      it('starts with matching item type, but "limit" parameter is not defined in the primary outlet', () => {
        payload = {
          url: '/items;param=...',
          params: {
            primary: {},
          },
        };
      });

      afterEach(() => {
        const values = () => ({
          a: routerNavigation(payload),
        });

        actions = hot('a|', values());

        expect(effects.routeList$).toBeObservable(hot('-|', values()));
      });
    });
  });
});
