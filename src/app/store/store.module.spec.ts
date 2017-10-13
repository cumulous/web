import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterStateSerializer } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';

import { Project, Dataset, Analysis } from '../api';
import { createSuccess, storage } from './actions';
import { reducers } from './reducers';
import { State } from './state';
import { StoreModule } from './store.module';

describe('StoreModule', () => {
  const fakeUrl = '/fake/url;fake=param';

  const fakeQueryParams = () => ({
    fake: 'param',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule,
      ],
    });
  });

  it('configures custom RouterStateSerializer', () => {
    const serializer = TestBed.get(RouterStateSerializer);
    const routerState = {
      url: fakeUrl,
      root: {
        firstChild: {
          params: fakeQueryParams(),
        },
      },
    };
    const state = serializer.serialize(routerState);
    expect(state).toEqual({
      url: fakeUrl,
      params: fakeQueryParams(),
    });
  });

  describe('configures a meta reducer that', () => {
    const fakeProject = () => ({
      id: 'Fake id',
      name: 'Fake project',
      created_at: 1234,
      created_by: 'Fake author',
      status: 'active' as any,
    });

    const fakeDataset = () => ({
      id: 'Fake id',
      project_id: 'Fake project id',
      created_at: 1234,
      created_by: 'Fake author',
      status: 'active' as any,
    });

    const fakeAnalysis = () => ({
      id: 'Fake id',
      project_id: 'Fake project id',
      created_at: 1234,
      created_by: 'Fake author',
      status: 'active' as any,
    });

    let store: Store<State>;
    let action: Action;
    let type: string;

    beforeEach(() => {
      Object.keys(reducers).forEach(key => localStorage.removeItem(key));

      store = TestBed.get(Store);
    });

    describe('stores part of state to localStorage for', () => {

      const jsonCopy = (obj: any) =>
        JSON.parse(JSON.stringify(obj));

      it('projects', () => {
        type = 'projects';
        action = createSuccess<Project>(type)(fakeProject());
      });

      it('datasets', () => {
        type = 'datasets';
        action = createSuccess<Dataset>(type)(fakeDataset());
      });

      it('analyses', () => {
        type = 'analyses';
        action = createSuccess<Analysis>(type)(fakeAnalysis());
      });

      afterEach(done => {
        store.dispatch(action);

        const stored = JSON.parse(localStorage.getItem(type));

        store.select(state => state[type]).subscribe(reduced => {
          expect(stored).toEqual(jsonCopy(reduced));
          done();
        });
      });
    });

    it('does not store router state to localStorage', () => {
      const stored = localStorage.getItem('router');
      expect(stored).toBeNull();
    });

    describe('rehydrates part of state to memory on STORAGE action for', () => {

      it('projects', () => {
        type = 'projects';
        action = createSuccess<Project>(type)(fakeProject());
      });

      it('datasets', () => {
        type = 'datasets';
        action = createSuccess<Dataset>(type)(fakeDataset());
      });

      it('analyses', () => {
        type = 'analyses';
        action = createSuccess<Analysis>(type)(fakeAnalysis());
      });

      afterEach(done => {
        const stored = JSON.stringify(reducers[type](undefined, action));
        localStorage.setItem(type, stored);

        spyOn(localStorage, 'setItem');

        store.dispatch(storage(type));

        store.select(state => state[type]).subscribe(rehydrated => {
          expect(rehydrated).toEqual(JSON.parse(stored));
          expect(localStorage.setItem).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe('does not rehydrate', () => {

      it('keys that are not in the state', () => type = 'test');
      it('router state', () => type = 'router');

      afterEach(done => {
        localStorage.setItem(type, '{ state not to be parsed');
        store.dispatch(storage(type));

        store.subscribe(state => {
          expect(state[type]).toBeUndefined();
          done();
        });
      });
    });
  });
});
