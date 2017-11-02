import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { hot } from 'jasmine-marbles';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth.service';
import { routerNavigation } from '../testing';

import { login, loginSuccess, loginRedirect, logout } from '../actions';
import { RouterState } from '../state';
import { AuthEffects } from './effects';

describe('AuthEffects', () => {
  const fakeUrl = '/fake/url';
  const fakeToken = 'fake-token-1234';

  let effects: AuthEffects;
  let metadata: EffectsMetadata<AuthEffects>;
  let actions: Observable<Action>;
  let authService: jasmine.SpyObj<AuthService>;
  let auth: jasmine.SpyObj<any>;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['login', 'logout']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        AuthEffects,
        provideMockActions(() => actions),
        { provide: AuthService, useValue: authService },
      ],
    });

    effects = TestBed.get(AuthEffects);
    metadata = getEffectsMetadata(effects);
    auth = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  describe('login$', () => {
    it('switches to authService.login() in response to LOGIN', () => {
      const values = () => ({
        a: login(fakeUrl),
        b: jasmine.any(Object),
        c: jasmine.any(Object),
        d: jasmine.any(Object),
      });

      actions = hot('aa--|', values());

      auth.login.and.returnValues(hot('---b|', values()), hot('--c-|', values()));

      expect(effects.login$).toBeObservable(hot('--d-|', values()));
    });

    it('does not dispatch an action', () => {
      expect(metadata.login$).toEqual({ dispatch: false });
    });
  });

  it('loginSuccess$ dispatches LOGIN_REDIRECT once in response to LOGIN_SUCCESS ' +
     'with the first url from the store', () => {
    const values = () => ({
      a: loginSuccess(fakeToken),
      b: fakeUrl,
      c: fakeUrl + 2,
      d: loginRedirect(fakeUrl),
    });

    actions = hot('a--|', values());

    auth.fromUrl = hot('-bc|', values());

    expect(effects.loginSuccess$).toBeObservable(hot('-d-|', values()));
    expect(metadata.loginSuccess$).toEqual({ dispatch: true });
  });

  describe('loginRedirect$', () => {
    it('navigates router to correct url once in response to LOGIN_REDIRECT', () => {
      const values = () => ({
        a: loginRedirect(fakeUrl),
        b: jasmine.any(Object),
      });

      actions = hot('a|', values());

      spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

      expect(effects.loginRedirect$).toBeObservable(hot('b|', values()));

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(fakeUrl);
    });

    it('does not dispatch an action', () => {
      expect(metadata.loginRedirect$).toEqual({ dispatch: false });
    });
  });

  describe('logout$', () => {
    it('switches to authService.logout() in response to LOGOUT', () => {
      const values = () => ({
        a: logout(),
        b: jasmine.any(Object),
        c: jasmine.any(Object),
        d: jasmine.any(Object),
      });

      actions = hot('aa--|', values());

      auth.logout.and.returnValues(hot('---b|', values()), hot('--c-|', values()));

      expect(effects.logout$).toBeObservable(hot('--d-|', values()));
    });

    it('does not dispatch an action', () => {
      expect(metadata.logout$).toEqual({ dispatch: false });
    });
  });

  describe('routeLogin$', () => {
    let payload: RouterState;

    describe('dispatches LOGIN once with correct url if routerState url', () => {
      let expected: string;

      it('is /login', () => {
        payload = {
          url: '/login',
          params: {
            primary: {},
          },
        };
        expected = '';
      });

      it('starts with /login and defines "from" parameter in the primary outlet', () => {
        payload = {
          url: '/login;param=...;from=' + fakeUrl,
          params: {
            primary: { from: fakeUrl },
          },
        };
        expected = fakeUrl;
      });

      afterEach(() => {
        const values = () => ({
          a: routerNavigation(payload),
          b: login(expected),
        });

        actions = hot('a|', values());

        expect(effects.routeLogin$).toBeObservable(hot('b|', values()));
      });

      afterAll(() => {
        expect(metadata.routeLogin$).toEqual({ dispatch: true });
      });
    });

    describe('does not dispatch LOGIN if routerState url', () => {
      it('does not start with /login', () => {
        payload = {
          url: fakeUrl,
          params: {},
        };
      });

      it('does not start with /login, but defines "from" parameter in the primary outlet', () => {
        payload = {
          url: fakeUrl + ';from=1234',
          params: {
            primary: { from: '1234' },
          },
        };
      });

      it('starts with /login, but does not define "from" parameter in the primary outlet', () => {
        payload = {
          url: '/login;param=...',
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

        expect(effects.routeLogin$).toBeObservable(hot('-|', values()));
      });
    });
  });

  describe('routeLoginResponse$', () => {
    it('dispatches LOGIN_SUCCESS once with access_token from routerState url that starts with /login', () => {
      const values = () => ({
        a: routerNavigation({
          url: '/login#token_type=Bearer&access_token=' + fakeToken + '&expires_in=3600',
          params: {},
        }),
        b: loginSuccess(fakeToken),
      });

      actions = hot('a|', values());

      expect(effects.routeLoginResponse$).toBeObservable(hot('b|', values()));
      expect(metadata.routeLoginResponse$).toEqual({ dispatch: true });
    });

    describe('does not dispatch LOGIN_SUCCESS if routerState url', () => {
      let url: string;

      it('does not start with /login', () => {
        url = fakeUrl;
      });

      it('does not start with /login, but contains access_token parameter', () => {
        url = fakeUrl + ';access_token=' + fakeToken;
      });

      it('starts with /login, but does not contain "access_token" parameter', () => {
        url = '/login;param=...';
      });

      afterEach(() => {
        const values = () => ({
          a: routerNavigation({
            url,
            params: {},
          }),
        });

        actions = hot('a|', values());

        expect(effects.routeLoginResponse$).toBeObservable(hot('-|', values()));
      });
    });
  });

  describe('routeLogout$', () => {
    it('dispatches LOGOUT once if routerState url starts with /login, ' +
       'and "logout" parameter is "true" in the primary outlet', () => {
      const values = () => ({
        a: routerNavigation({
          url: '/login;param=...;logout=true;param2=...',
          params: {
            primary: { logout: 'true' },
          },
        }),
        b: logout(),
      });

      actions = hot('a|', values());

      expect(effects.routeLogout$).toBeObservable(hot('b|', values()));
      expect(metadata.routeLogout$).toEqual({ dispatch: true });
    });

    describe('does not dispatch LOGOUT if routerState url', () => {
      let payload: RouterState;

      it('does not start with /login', () => {
        payload = {
          url: fakeUrl,
          params: {},
        };
      });

      it('does not start with /login, but "logout" parameter is "true" in the primary outlet', () => {
        payload = {
          url: fakeUrl + ';logout=true;param=...',
          params: {
            primary: { logout: 'true' },
          },
        };
      });

      it('starts with /login, but "logout" parameter is not defined in the primary outlet', () => {
        payload = {
          url: '/login;param=...',
          params: {
            primary: {},
          },
        };
      });

      it('starts with /login, but "logout" parameter is not "true" in the primary outlet', () => {
        payload = {
          url: '/login;param=...;logout=value;param2=...',
          params: {
            primary: { logout: 'value' },
          },
        };
      });

      afterEach(() => {
        const values = () => ({
          a: routerNavigation(payload),
        });

        actions = hot('a|', values());

        expect(effects.routeLogout$).toBeObservable(hot('-|', values()));
      });
    });
  });
});
