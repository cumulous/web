import * as CognitoAuthModule from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import { CognitoAuthSession, CognitoAccessToken } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';
import * as jwt from 'jsrsasign';

import { CognitoAuthProviderService } from './cognito-auth-provider.service';

const CognitoAuth = CognitoAuthModule.CognitoAuth;

describe('CognitoAuthProviderService', () => {
  const fakeClientID = 'fake-client-id';
  const fakeDomain = 'fake-domain';
  const fakeExpiresIn = 1000 + Math.random() * 10000;
  const fakeCurrentUrl = 'fake-current-url';

  const fakeAuthConfig = () => ({
    clientId: fakeClientID,
    domain: fakeDomain,
    expiresIn: fakeExpiresIn,
  });

  let service: CognitoAuthProviderService;
  let auth: any;

  let spyOnCognitoAuth: jasmine.Spy;

  beforeEach(() => {
    spyOnCognitoAuth = jasmine.createSpy('CognitoAuth')
      .and.callFake((config) => {
        auth = new CognitoAuth(config);
        return auth;
      });
    Object.defineProperty(CognitoAuthModule, 'CognitoAuth', {
      value: spyOnCognitoAuth,
    });

    service = new CognitoAuthProviderService(fakeAuthConfig());
  });

  it('constructs CognitoAuth with correct parameters', () => {
    const callbackUrl = 'https://' + window.location.hostname + '/login';
    expect(spyOnCognitoAuth).toHaveBeenCalledWith({
      ClientId: fakeClientID,
      AppWebDomain: fakeDomain,
      TokenScopesArray: [],
      RedirectUriSignIn: callbackUrl,
      RedirectUriSignOut: callbackUrl,
    });
  });

  it('delegates CognitoAuthSession.isValid() to AuthCognito.isValid()', () => {
    const spyOnIsValid = spyOn(service, 'isValid');
    const session = auth.getSignInUserSession();

    spyOnIsValid.and.returnValue(true);
    expect(session.isValid()).toBe(true);

    spyOnIsValid.and.returnValue(false);
    expect(session.isValid()).toBe(false);
  });

  describe('signIn()', () => {
    let spyOnSuccess: jasmine.Spy;
    let spyOnFailure: jasmine.Spy;
    let spyOnParseResponse: jasmine.Spy;
    let spyOnIsValid: jasmine.Spy;
    let spyOnGetSession: jasmine.Spy;

    const testMethod = () =>
      service.signIn(fakeCurrentUrl, spyOnSuccess, spyOnFailure);

    beforeEach(() => {
      spyOnSuccess = jasmine.createSpy('onSuccess');
      spyOnFailure = jasmine.createSpy('onFailure');
      spyOnParseResponse = spyOn(CognitoAuth.prototype, 'parseCognitoWebResponse');
      spyOnIsValid = spyOn(service, 'isValid');
      spyOnGetSession = spyOn(CognitoAuth.prototype, 'getSession');
    });
    it('correctly overrides userhandler', () => {
      testMethod();
      expect(auth.userhandler.onSuccess).toEqual(spyOnSuccess);
      expect(auth.userhandler.onFailure).toEqual(spyOnFailure);
    });
    it('calls CognitoAuth.parseCognitoWebResponse() once with correct parameters', () => {
      testMethod();
      expect(spyOnParseResponse).toHaveBeenCalledWith(fakeCurrentUrl);
      expect(spyOnParseResponse).toHaveBeenCalledTimes(1);
    });
    it('calls CognitoAuth.getSession() once if isValid() returns "false"', () => {
      spyOnIsValid.and.returnValue(false);
      testMethod();
      expect(spyOnGetSession).toHaveBeenCalledTimes(1);
    });
    it('does not call CognitoAuth.getSession() if isValid() returns "true"', () => {
      spyOnIsValid.and.returnValue(true);
      testMethod();
      expect(spyOnGetSession).not.toHaveBeenCalled();
    });
  });

  it('signOut() calls CognitoAuth.signOut() once', () => {
    const spyOnSignOut = spyOn(CognitoAuth.prototype, 'signOut');
    service.signOut();
    expect(spyOnSignOut).toHaveBeenCalledTimes(1);
  });

  describe('getAccessToken()', () => {
    const fakeJwt = 'ey.ab.cd';

    let spyOnGetSignInSession: jasmine.Spy;

    let session: CognitoAuthSession;
    let token: CognitoAccessToken;

    beforeEach(() =>{
      session = jasmine.createSpyObj('CognitoAuthSession', ['getAccessToken']);
      token = jasmine.createSpyObj('CognitoAccessToken', ['getJwtToken']);
      session.getAccessToken.and.returnValue(token);
      token.getJwtToken.and.returnValue(fakeJwt);

      spyOnGetSignInSession = spyOn(CognitoAuth.prototype, 'getSignInUserSession')
        .and.returnValue(session);
    });

    it('returns valid JWT token if it is defined', () => {
      expect(service.getAccessToken()).toBe(fakeJwt);
    });

    describe('returns undefined if', () => {
      it('CognitoAuth.getSignInUserSession() result is undefined', () => {
        spyOnGetSignInSession.and.returnValue(undefined);
      });
      it('CognitoAuth.getSignInUserSession() result is null', () => {
        spyOnGetSignInSession.and.returnValue(null);
      });
      it('CognitoAuthSession.getAccessToken() result is undefined', () => {
        session.getAccessToken.and.returnValue(undefined);
      });
      it('CognitoAuthSession.getAccessToken() result is null', () => {
        session.getAccessToken.and.returnValue(null);
      });
      afterEach(() => {
        expect(service.getAccessToken()).toBeUndefined();
      });
    });
  });

  describe('isValid() returns correct result if token', () => {
    const now = new Date().getTime() / 1000;

    const fakeJwt = (iat: number) =>
      jwt.jws.JWS.sign('HS256', {alg: 'HS256', typ: 'JWT'}, {iat}, {rstr: 'secret'});

    let iat: number;
    let expected: boolean;

    let spyOnGetAccessToken: jasmine.Spy;

    beforeEach(() =>{
      spyOnGetAccessToken = spyOn(service, 'getAccessToken')
        .and.callFake(() => fakeJwt(iat));
    });

    it('issue time + expiresIn is > now', () => {
      iat = now;
      expected = true;
    });
    it('issue time + expiresIn is < now', () => {
      iat = now - fakeExpiresIn - 1000;
      expected = false;
    });
    it('is undefined', () => {
      spyOnGetAccessToken.and.returnValue(undefined);
      expected = false;
    });
    it('is null', () => {
      spyOnGetAccessToken.and.returnValue(null);
      expected = false;
    });
    it('is empty', () => {
      spyOnGetAccessToken.and.returnValue('');
      expected = false;
    });
    it('is invalid', () => {
      spyOnGetAccessToken.and.returnValue('ey.ab.cd');
      expected = false;
    });
    afterEach(() => {
      expect(service.isValid()).toBe(expected);
    });
  });
});
