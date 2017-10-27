import { TestBed } from '@angular/core/testing';
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

import { Observable } from 'rxjs/Observable';

import { Store } from '../store';
import { CognitoAuthService } from './cognito-auth.service';

describe('CognitoAuthService', () => {
  const fakeClientId = 'fake-client-id';
  const fakeDomain = 'fake-domain';
  const fakeExpiresIn = 1000 + Math.random() * 10000;
  const callbackUrl = 'https://' + window.location.hostname + '/login';

  const fakeConfig = () => ({
    expiresIn: fakeExpiresIn,
    clientId: fakeClientId,
    domain: fakeDomain,
  });

  const fakeAuth = () => new CognitoAuth({
    ClientId: fakeClientId,
    AppWebDomain: fakeDomain,
    TokenScopesArray: [],
    RedirectUriSignIn: callbackUrl,
    RedirectUriSignOut: callbackUrl,
  });

  let service: CognitoAuthService;
  let store: jasmine.SpyObj<Store>;
  let launchUri: jasmine.Spy;

  beforeEach(() => {
    store = jasmine.createSpyObj('Store', ['select']);
    store.select.and.returnValue(Observable.of(fakeConfig()));

    TestBed.configureTestingModule({
      providers: [
        CognitoAuthService,
        { provide: Store, useValue: store },
      ],
    });

    launchUri = spyOn(CognitoAuth.prototype, 'launchUri');

    service = TestBed.get(CognitoAuthService);
  });

  describe('calls CognitoAuth.launchUri once with correct url for', () => {
    let method: string;
    let urlMethod: string;

    it('login()', () => {
      method = 'login';
      urlMethod = 'getFQDNSignIn';
      spyOn(console, 'log'); // stub hardcoded console.log
    });

    it('logout()', () => {
      method = 'logout';
      urlMethod = 'getFQDNSignOut';
    });

    afterEach(done => {
      const anyState = 'state=[^&]*';
      const url = fakeAuth()[urlMethod]()
        .replace(new RegExp(anyState), anyState)
        .replace('?', '\\?');

      service[method]().subscribe(() => {
        expect(launchUri).toHaveBeenCalledWith(
          jasmine.stringMatching(url)
        );
        done();
      });
    });
  });
});
