import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getEffectsMetadata } from '@ngrx/effects';
import { RouterStateSerializer } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';

import { environment } from '../../environments/environment';

import { Analysis, Client, Dataset, Project, User } from '../api';

import { AuthService } from '../auth/auth.service';
import { AuthEffects } from './auth/effects';

import { EffectsService } from './effects.service';
import { AnalysisEffects } from './analyses/effects';
import { ClientEffects } from './clients/effects';
import { DatasetEffects } from './datasets/effects';
import { ProjectEffects } from './projects/effects';
import { UserEffects } from './users/effects';

import {
  login, loginSuccess, loginRedirect, logout,
  createSuccess, storage,
} from './actions';

import { reducers } from './reducers';
import { Store as StoreModel, StoreItem } from './models';
import { State } from './state';
import { StoreModule } from './store.module';

describe('StoreModule', () => {
  const fakeUrl = '/fake/url;fake=param';
  const fakeToken = 'fake-token-1234';
  const fakeCreatedAt = new Date().toISOString();

  const fakeQueryParams = () => ({
    fake: 'param',
  });

  const fakeProject = () => ({
    id: 'fake-project-id',
    name: 'Fake project',
    created_at: fakeCreatedAt,
    created_by: 'Fake author',
    status: 'active',
  });

  const fakeDataset = () => ({
    id: 'fake-dataset-id',
    project_id: 'Fake project id',
    created_at: fakeCreatedAt,
    created_by: 'Fake author',
    status: 'active',
  });

  const fakeAnalysis = () => ({
    id: 'fake-analysis-id',
    project_id: 'Fake project id',
    created_at: fakeCreatedAt,
    created_by: 'Fake author',
    status: 'active',
  });

  const fakeUser = () => ({
    id: 'fake-user-id',
    name: 'John Doe',
    email: 'johndoe@example.org',
  });

  const fakeClient = () => ({
    id: 'fake-client-id',
    name: 'Machine account for John Doe',
    email: 'johndoe@example.org',
  });

  let store: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
        children: [
          { outlet: 'primary', params: fakeQueryParams() },
        ],
      },
    };
    const state = serializer.serialize(routerState);
    expect(state).toEqual({
      url: fakeUrl,
      params: {
        primary: fakeQueryParams(),
      },
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
          token: '',
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
          fromUrl: '',
          config: environment.auth,
        });
        done();
      });
    });

    it('unsets "fromUrl" on LOGIN_REDIRECT action', done => {
      store.dispatch(loginRedirect(fakeUrl));

      store.first().subscribe(state => {
        expect(state.auth).toEqual({
          token: '',
          fromUrl: '',
          config: environment.auth,
        });
        done();
      });
    });

    it('leaves the state intact on a non-matching action', done => {
      store.dispatch({ type: 'test' });

      store.first().subscribe(state => {
        expect(state.auth).toBe(initState.auth);
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
      expect(initState.api).toEqual(environment.api);
      done();
    });
  });

  it('configures a meta reducer for LOGOUT action that resets store to init state', done => {
    store.first().subscribe(initState => {

      store.dispatch(login(fakeUrl));
      store.dispatch(createSuccess<Project>('projects')(fakeProject()));
      store.dispatch(createSuccess<Dataset>('datasets')(fakeDataset()));
      store.dispatch(createSuccess<Analysis>('analyses')(fakeAnalysis()));
      store.dispatch(createSuccess<User>('users')(fakeUser()));
      store.dispatch(createSuccess<Client>('clients')(fakeClient()));
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

      const jsonCopy = obj =>
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

      it('users', () => {
        type = 'users';
        action = createSuccess<User>(type)(fakeUser());
      });

      it('clients', () => {
        type = 'clients';
        action = createSuccess<Client>(type)(fakeClient());
      });

      afterEach(done => {
        store.dispatch(action);

        const stored = JSON.parse(String(localStorage.getItem(type)));

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

      it('users', () => {
        type = 'users';
        action = createSuccess<User>(type)(fakeUser());
      });

      it('clients', () => {
        type = 'clients';
        action = createSuccess<Client>(type)(fakeClient());
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

  beforeEach(() => {
    const store = jasmine.createSpyObj('Store', ['select']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule,
      ],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: StoreModel, useValue: store },
      ],
    });
  });

  it('provides AuthEffects', () => {
    const effects = TestBed.get(AuthEffects);
    expect(effects).toBeDefined();
  });

  function testEffects<Item extends StoreItem, E extends EffectsService<Item>>
      (effectsClass: Type<E>, itemsType: string, props: [keyof E]) {

    let effects: E;

    beforeEach(() => {
      effects = TestBed.get(effectsClass);
    });

    it('items type', () => {
      expect(effects.type).toEqual(itemsType);
    });

    it('metadata', () => {
      const metadata = getEffectsMetadata(effects);
      const expected: typeof metadata = {};

      props.forEach(prop => {
        expected[prop] = { dispatch: true };
      });
      expect(metadata).toEqual(expected);
    });
  }

  describe('provides AnalysisEffects with correct', () => {
    testEffects<Analysis, AnalysisEffects>(AnalysisEffects, 'analyses',
      ['create$', 'update$', 'list$', 'listSuccess$', 'routeList$'],
    );
  });

  describe('provides ClientEffects with correct', () => {
    testEffects<Client, ClientEffects>(ClientEffects, 'clients',
      ['create$', 'update$', 'get$'],
    );
  });

  describe('provides DatasetEffects with correct', () => {
    testEffects<Dataset, DatasetEffects>(DatasetEffects, 'datasets',
      ['create$', 'update$', 'list$', 'listSuccess$', 'routeList$'],
    );
  });

  describe('provides ProjectEffects with correct', () => {
    testEffects<Project, ProjectEffects>(ProjectEffects, 'projects',
      ['create$', 'update$', 'get$', 'list$', 'routeList$'],
    );
  });

  describe('provides UserEffects with correct', () => {
    testEffects<User, UserEffects>(UserEffects, 'users',
      ['create$', 'update$', 'get$'],
    );
  });
});
