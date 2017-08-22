import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { AuthProviderService } from './auth-provider.service';

import { Configuration as ApiConfig } from '../api/configuration';

describe('AuthService', () => {
  const fakeAccessToken = 'fake-access-token';
  const fakeGuardedUrl = '/fake/guarded/url';

  const fakeApiConfig = () => new ApiConfig({
    basePath: 'fake-api',
    withCredentials: true,
    apiKeys: {
      Authorization: undefined,
    },
  });

  let apiConfig: ApiConfig;
  let auth: AuthProviderService;
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthProviderService',
      ['signIn', 'signOut', 'getAccessToken', 'isValid']);
    apiConfig = fakeApiConfig();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        AuthService,
        { provide: AuthProviderService, useValue: auth },
        { provide: ApiConfig, useValue: apiConfig },
      ],
    });

    service = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  describe('login()', () => {
    it('calls auth.signIn() once with correct parameters', () => {
      service.login();
      expect(auth.signIn).toHaveBeenCalledWith(
        router.url,
        jasmine.any(Function),
        jasmine.any(Function),
      );
      expect(auth.signIn).toHaveBeenCalledTimes(1);
    });
    describe('supplies an onSuccess() callback that', () => {
      let spyOnNavigate: jasmine.Spy;
      beforeEach(() => {
        (auth.signIn as jasmine.Spy).and.callFake((url, onSuccess) => onSuccess());
        spyOnNavigate = spyOn(router, 'navigateByUrl');
      });
      it('sets Authorization key to the value of access token', () => {
        (auth.getAccessToken as jasmine.Spy).and.returnValue(fakeAccessToken);
        apiConfig.apiKeys.Authorization = undefined;
        service.login();
        expect(apiConfig.apiKeys.Authorization).toBe(fakeAccessToken);
      });
      it('calls router.navigateByUrl() once with guardedUrl', () => {
        service.guardedUrl = fakeGuardedUrl;
        service.login();
        expect(spyOnNavigate).toHaveBeenCalledWith(fakeGuardedUrl);
        expect(spyOnNavigate).toHaveBeenCalledTimes(1);
      });
    });
    it('supplies an onFailure() callback that calls logout()', () => {
      const spyOnLogout = spyOn(service, 'logout');
      (auth.signIn as jasmine.Spy).and.callFake((url, onSuccess, onFailure) => onFailure());
      service.login();
      expect(spyOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout()', () => {
    it('unsets Authorization key', () => {
      apiConfig.apiKeys.Authorization = fakeAccessToken;
      service.logout();
      expect(apiConfig.apiKeys.Authorization).toBeUndefined();
    });
    it('calls auth.signOut() once', () => {
      service.logout();
      expect(auth.signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('isAuthenticated()', () => {
    it('calls auth.isValid() once', () => {
      service.isAuthenticated();
      expect(auth.isValid).toHaveBeenCalledTimes(1);
    });
    describe('returns', () => {
      let expected: boolean;
      it('"true" if auth.isValid() returns "true"', () => expected = true);
      it('"false" if auth.isValid() returns "false"', () => expected = false);
      afterEach(() => {
        (auth.isValid as jasmine.Spy).and.returnValue(expected);
        expect(service.isAuthenticated()).toBe(expected);
      });
    });
  });

  it('set guardedUrl sets sessionStorage.guardedUrl to correct path', () => {
    sessionStorage.removeItem('guardedUrl');
    service.guardedUrl = fakeGuardedUrl;
    expect(sessionStorage.getItem('guardedUrl')).toBe(fakeGuardedUrl);
  });

  describe('gets correct guardedUrl if sessionStorage.guardedUrl', () => {
    let expected: string;
    it('does not exist', () => {
      sessionStorage.removeItem('guardedUrl');
      expected = '/';
    });
    it('is empty', () => {
      sessionStorage.setItem('guardedUrl', '');
      expected = '/';
    });
    it('is non-empty', () => {
      sessionStorage.setItem('guardedUrl', fakeGuardedUrl);
      expected = fakeGuardedUrl;
    });
    afterEach(() => {
      expect(service.guardedUrl).toBe(expected);
    });
  });
});
