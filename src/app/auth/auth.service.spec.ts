import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import * as jwt from 'jsrsasign';

import { Observable } from 'rxjs/Observable';

import { authSelectors, Store } from '../store';
import { AuthService } from './auth.service';

@Injectable()
class AuthTestService extends AuthService {
  constructor(store: Store) {
    super(store);
  }

  get config() {
    return super.config;
  }

  login() {
    return new Observable<void>();
  }

  logout() {
    return new Observable<void>();
  }
}

interface Config {
  expiresIn: number;
  clientId: string;
};

describe('AuthService', () => {
  const fakeToken = 'fake-token';
  const fakeExpiresIn = 7200;
  const fakeUrl = 'fake-url';

  const fakeConfig = (): Config => ({
    expiresIn: fakeExpiresIn,
    clientId: 'fake-client-id',
  });

  let service: AuthTestService;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    store = jasmine.createSpyObj('Store', ['select']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: AuthTestService },
        { provide: Store, useValue: store },
      ],
    });

    service = TestBed.get(AuthService);
  });

  describe('provides', () => {
    let expected: any;
    let tested: string;

    it('config from the store', () => {
      tested = 'config';
      expected = fakeConfig();
    });

    it('token from the store', () => {
      tested = 'token';
      expected = fakeToken;
    });

    it('fromUrl from the store', () => {
      tested = 'fromUrl';
      expected = fakeUrl;
    });

    afterEach(done => {
      store.select.and.returnValue(Observable.of(expected));

      service[tested].subscribe(result => {
        expect(store.select).toHaveBeenCalledWith(authSelectors[tested]);
        expect(result).toEqual(expected);
        done();
      });
    });
  });

  describe('isAuthenticated() returns correct result if', () => {
    const now = new Date().getTime() / 1000;

    const fakeJwt = (iat: number = now) =>
      jwt.jws.JWS.sign('HS256', {alg: 'HS256', typ: 'JWT'}, {iat}, {rstr: 'secret'});

    let config: Config;
    let token: string | undefined;
    let expected: boolean;

    beforeEach(() => {
      config = fakeConfig();
      token = fakeJwt();
    });

    it('token issue time + expiresIn is > now', () => {
      expected = true;
    });
    it('token issue time + expiresIn is < now', () => {
      token = fakeJwt(now - fakeExpiresIn - 1000);
      expected = false;
    });
    it('token is undefined', () => {
      token = undefined;
      expected = false;
    });
    it('token is invalid', () => {
      token = 'ey.ab.cd';
      expected = false;
    });

    afterEach(done => {
      store.select.and.callFake(selector => {
        switch (selector) {
          case authSelectors.token:
            return Observable.of(token);
          case authSelectors.config:
            return Observable.of(config);
        };
      });

      service.isAuthenticated.subscribe(authed => {
        expect(authed).toBe(expected);
        done();
      });
    });
  });
});
