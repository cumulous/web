import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../auth/auth.service';
import { AuthGuardService } from '../auth/auth-guard.service';

@Injectable()
export class MockAuthService {
  isAuthenticated() {}
}

describe('AuthGuardService', () => {
  const fakeUrl = '/fake/url';
  const fakePath = 'fake-path';

  let router: Router;
  let service: AuthGuardService;
  let auth: AuthService;

  let spyOnAuthenticated: jasmine.Spy;
  let spyOnNavigate: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        AuthGuardService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    router = TestBed.get(Router);
    service = TestBed.get(AuthGuardService);
    auth = TestBed.get(AuthService);

    spyOnAuthenticated = spyOn(auth, 'isAuthenticated');
    spyOnNavigate = spyOn(router, 'navigate');
  });

  describe('returns correct value for', () => {
    let result: boolean;
    let expected: boolean;

    let fakeRoute: any;
    let fakeState: any;

    beforeEach(() => {
      fakeRoute = jasmine.createSpy('route');
      fakeState = jasmine.createSpy('state');
    });

    afterEach(() => {
      expect(result).toBe(expected);
    });

    describe('canActivate() if auth.isAuthenticated() is', () => {
      it('"true"', () => expected = true);
      it('"false"', () => expected = false);
      afterEach(() => {
        spyOnAuthenticated.and.returnValue(expected);
        result = service.canActivate(fakeRoute, fakeState);
      });
    });
    describe('canActivateChild() if auth.isAuthenticated() is', () => {
      it('"true"', () => expected = true);
      it('"false"', () => expected = false);
      afterEach(() => {
        spyOnAuthenticated.and.returnValue(expected);
        result = service.canActivateChild(fakeRoute, fakeState);
      });
    });
    describe('canLoad() if auth.isAuthenticated() is', () => {
      it('"true"', () => expected = true);
      it('"false"', () => expected = false);
      afterEach(() => {
        spyOnAuthenticated.and.returnValue(expected);
        result = service.canLoad(fakeRoute);
      });
    });
  });

  describe('correctly sets auth.guardedUrl when auth.isAuthenticated() is "false" for', () => {
    let expected: string;
    let route: any;
    let state: any;

    beforeEach(() => {
      route = jasmine.createSpy('route');
      spyOnAuthenticated.and.returnValue(false);
    });

    afterEach(() => {
      expect(auth.guardedUrl).toBe(expected);
    });

    it('canActivate()', () => {
      state = { url: fakeUrl };
      service.canActivate(route, state);
      expected = fakeUrl;
    });
    it('canActivateChild()', () => {
      state = { url: fakeUrl };
      service.canActivateChild(route, state);
      expected = fakeUrl;
    });
    it('canLoad()', () => {
      route = { path: fakePath };
      service.canLoad(route);
      expected = '/' + fakePath;
    });
  });

  describe('navigates to /login when auth.isAuthenticated() is "false" for', () => {
    let route: any;
    let state: any;

    beforeEach(() => {
      route = jasmine.createSpy('route');
      spyOnAuthenticated.and.returnValue(false);
    });

    afterEach(() => {
      expect(spyOnNavigate).toHaveBeenCalledWith(['login']);
    });

    it('canActivate()', () => {
      state = { url: fakeUrl };
      service.canActivate(route, state);
    });
    it('canActivateChild()', () => {
      state = { url: fakeUrl };
      service.canActivateChild(route, state);
    });
    it('canLoad()', () => {
      route = { path: fakePath };
      service.canLoad(route);
    });
  });
});
