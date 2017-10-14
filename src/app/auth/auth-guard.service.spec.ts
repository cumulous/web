import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from '../auth/auth.service';
import { AuthGuardService } from '../auth/auth-guard.service';

@Injectable()
export class MockAuthService {
  authed: boolean;

  get isAuthenticated() {
    return Observable.of(this.authed);
  };
}

describe('AuthGuardService', () => {
  const fakeUrl = '/fake/url';

  let router: Router;
  let service: AuthGuardService;
  let auth: MockAuthService;

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

    spyOn(router, 'navigate');
  });

  describe('canActivate()', () => {
    let fakeRoute: any;
    let fakeState: any;

    beforeEach(() => {
      fakeRoute = jasmine.createSpy('route');
      fakeState = {
        url: fakeUrl,
      };
    });

    describe('returns correct value if auth.isAuthenticated returns', () => {
      let expected: boolean;

      it('"true"', () => expected = true);
      it('"false"', () => expected = false);

      afterEach(done => {
        auth.authed = expected;
        service.canActivate(fakeRoute, fakeState).subscribe(result => {
          expect(result).toBe(expected);
          done();
        });
      });
    });

    it('navigates to /login when auth.isAuthenticated returns "false"', done => {
      auth.authed = false;
      service.canActivate(fakeRoute, fakeState).subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/login', {
          from: fakeUrl,
        }]);
        done();
      });
    });

    it('does not re-navigate when auth.isAuthenticated returns "true"', done => {
      auth.authed = true;
      service.canActivate(fakeRoute, fakeState).subscribe(() => {
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
