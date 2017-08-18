import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import { AuthConfig } from '../auth/auth.config';
import { AuthService } from '../auth/auth.service';

describe('AuthService', () => {
  const fakeClientID = 'client-12345';
  const fakeDomain = 'login.example.org';
  const fakePath = '/fake/path';

  const fakeConfig = () => {
    return new AuthConfig(fakeClientID, fakeDomain);
  };

  const fakeSession = (isValid: boolean) => {
    const spyOnSession = jasmine.createSpyObj('session', ['isValid']);
    spyOnSession.isValid = () => isValid;
    return spyOnSession;
  };

  let service: AuthService;
  let auth: CognitoAuth;
  let router: Router;

  let spyOnNavigate: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        AuthService,
        { provide: AuthConfig, useValue: fakeConfig() },
      ],
    });

    service = TestBed.get(AuthService);
    auth = (service as any).auth;

    router = TestBed.get(Router);
    spyOnNavigate = spyOn(router, 'navigateByUrl');
  });

  it('constructs CognitoAuth object with correct parameters', () => {
    expect(auth).toEqual(Object.assign(new CognitoAuth({
      ClientId: fakeClientID,
      AppWebDomain: fakeDomain,
      TokenScopesArray: [],
      RedirectUriSignIn: window.location.origin + '/login',
      RedirectUriSignOut: window.location.origin + '/login',
    }), {
      userhandler: {
        onSuccess: jasmine.any(Function),
        onFailure: jasmine.any(Function),
      },
    }));
  });

  describe('login()', () => {
    let spyOnCallOrder: jasmine.Spy;
    let spyOnParseResponse: jasmine.Spy;
    let spyOnGetSession: jasmine.Spy;

    beforeEach(() => {
      spyOnCallOrder = jasmine.createSpy('callOrder');
      spyOnParseResponse = spyOn(auth, 'parseCognitoWebResponse')
        .and.callFake(() => spyOnCallOrder('parseCognitoWebResponse'));
      spyOnGetSession = spyOn(auth, 'getSession')
        .and.callFake(() => spyOnCallOrder('getSession'));

      service.login();
    });

    it('calls auth.parseCognitoWebResponse() with correct parameters first', () => {
      expect(spyOnParseResponse).toHaveBeenCalledWith(router.url);
      expect(spyOnParseResponse).toHaveBeenCalledTimes(1);
      expect(spyOnCallOrder.calls.first().args[0]).toBe('parseCognitoWebResponse');
    });

    it('calls auth.getSession() last', () => {
      expect(spyOnGetSession).toHaveBeenCalledTimes(1);
      expect(spyOnCallOrder.calls.mostRecent().args[0]).toBe('getSession');
    });
  });

  it('logout() calls auth.signOut() once', () => {
    const spyOnSignOut = spyOn(auth, 'signOut');
    service.logout();
    expect(spyOnSignOut).toHaveBeenCalledTimes(1);
  });

  describe('sets isAuthenticated status upon', () => {
    it('successful authentication', () => {
      auth.userhandler.onSuccess(fakeSession(true));
      expect(service.isAuthenticated()).toBeTruthy();
    });
    it('unsuccessful authentication', () => {
      auth.userhandler.onFailure();
      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('navigates to correct path upon successful authentication ' +
           'if localStorage.guardedUrl was', () => {
    let expectedPath: string;
    afterEach(() => {
      auth.userhandler.onSuccess(fakeSession(true));
      expect(spyOnNavigate).toHaveBeenCalledWith(expectedPath);
    });
    it('non-empty', () => {
      localStorage.setItem('guardedUrl', fakePath);
      expectedPath = fakePath;
    });
    it('undefined', () => {
      localStorage.removeItem('guardedUrl');
      expectedPath = '/';
    });
    it('empty', () => {
      localStorage.setItem('guardedUrl', '');
      expectedPath = '/';
    });
  });

  it('guardedUrl sets localStorage.guardedUrl to correct path', () => {
    localStorage.removeItem('guardedUrl');
    service.guardedUrl = fakePath;
    expect(localStorage.getItem('guardedUrl')).toBe(fakePath);
  });
});
