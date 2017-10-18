import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterStateSerializer } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';

import { environment } from '../../environments/environment';
import { Project, Dataset, Analysis } from '../api';
import { AuthService } from '../auth/auth.service';
import { AuthEffects } from './auth/effects';

import {
  login, loginSuccess, loginRedirect, logout,
  createSuccess, storage,
} from './actions';

import { reducers } from './reducers';
import { State } from './state';
import { StoreModule } from './store.module';

describe('StoreModule', () => {
  const fakeUrl = '/fake/url;fake=param';
  const fakeToken = 'fake-token-1234';

  const fakeQueryParams = () => ({
    fake: 'param',
  });

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule,
      ],
      providers: [
        { provide: AuthEffects, useValue: {} },
      ],
    });

    Object.keys(reducers).forEach(key => localStorage.removeItem(key));

    store = TestBed.get(Store);
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

  describe('configures a reducer for auth state that', () => {
    let initState: State;

    beforeEach(done => {
      store.first().subscribe(state => {
        initState = state;
        done();
      });
    });

    it('sets "fromUrl" on LOGIN action', done => {
      store.dispatch(login(fakeUrl));

      store.first().subscribe(state => {
        expect(state.auth).toEqual({
          fromUrl: fakeUrl,
          config: environment.auth,
        });
        done();
      });
    });

    it('sets "token" on LOGIN_SUCCESS action', done => {
      store.dispatch(loginSuccess(fakeToken));

      store.first().subscribe(state => {
        expect(state.auth).toEqual({
          token: fakeToken,
          config: environment.auth,
        });
        done();
      });
    });

    it('unsets "fromUrl" on LOGIN_REDIRECT action', done => {
      store.dispatch(loginRedirect(fakeUrl));

      store.first().subscribe(state => {
        expect(state.auth).toEqual({
          fromUrl: undefined,
          config: environment.auth,
        });
        done();
      });
    });

    it('leaves the state intact on a non-matching action', done => {
      store.dispatch({ type: 'test' });

      store.first().subscribe(state => {
        expect(state.auth).toEqual({
          config: environment.auth,
        });
        done();
      });
    });

    afterEach(done => {
      store.first().subscribe(state => {
        expect(state.auth.config).toBe(initState.auth.config);
        done();
      });
    });
  });

  it('configures baseUrl for api state', done => {
    store.first().subscribe(initState => {
      expect(initState.api).toEqual({
        baseUrl: environment.apiRoot,
      });
      done();
    });
  });

  it('configures a meta reducer for LOGOUT action that resets store to init state', done => {
    store.first().subscribe(initState => {

      store.dispatch(login(fakeUrl));
      store.dispatch(createSuccess<Project>('projects')(fakeProject()));
      store.dispatch(createSuccess<Dataset>('datasets')(fakeDataset()));
      store.dispatch(createSuccess<Analysis>('analyses')(fakeAnalysis()));
      store.dispatch(logout());

      store.first().subscribe(state => {
        expect(state).toEqual(initState);
        done();
      });
    });
  });

  describe('configures a meta reducer that', () => {
    let action: Action;
    let type: string;

    describe('stores part of state to localStorage for', () => {

      const jsonCopy = (obj: any) =>
        JSON.parse(JSON.stringify(obj));

      it('auth', () => {
        type = 'auth';
        action = login(fakeUrl);
      });

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
      const stored = localStorage.getItem('routerReducer');
      expect(stored).toBeNull();
    });

    describe('rehydrates part of state to memory on STORAGE action for', () => {

      it('auth', () => {
        type = 'auth';
        action = login(fakeUrl);
      });

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
      it('router state', () => type = 'routerReducer');

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

describe('StoreModule', () => {
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule,
      ],
      providers: [
        { provide: AuthService, useValue: {} },
      ],
    });

    effects = TestBed.get(AuthEffects);
  });

  it('provides AuthEffects', () => {
    expect(effects).toBeDefined();
  });
});
