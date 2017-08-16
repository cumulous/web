import { TestBed } from '@angular/core/testing';

import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import { AuthConfig } from '../auth/auth.config';
import { AuthService } from '../auth/auth.service';

describe('AuthService', () => {
  const fakeClientID = 'client-12345';
  const fakeDomain = 'login.example.org';

  const fakeConfig = () => {
    return new AuthConfig(fakeClientID, fakeDomain);
  };

  let service: AuthService;
  let auth: CognitoAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthConfig, useValue: fakeConfig() },
      ],
    });

    service = TestBed.get(AuthService);
    auth = (service as any).auth;
  });

  it('constructs CognitoAuth object with correct parameters', () => {
    expect(auth).toEqual(new CognitoAuth({
      ClientId: fakeClientID,
      AppWebDomain: fakeDomain,
      TokenScopesArray: [],
      RedirectUriSignIn: window.location.href,
      RedirectUriSignOut: window.location.href,
    }));
  });

  describe('login()', () => {
    let spyOnParseResponse: jasmine.Spy;
    let spyOnGetSession: jasmine.Spy;

    beforeEach(() => {
      spyOnParseResponse = spyOn(auth, 'parseCognitoWebResponse');
      spyOnGetSession = spyOn(auth, 'getSession');

      service.login();
    });

    it('login() calls auth.parseCognitoWebResponse() with correct parameters', () => {
      expect(spyOnParseResponse).toHaveBeenCalledWith(window.location.href);
    });

    it('login() calls auth.getSession() with correct parameters', () => {
      expect(spyOnGetSession).toHaveBeenCalled();
    });
  });
});
