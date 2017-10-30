import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from '../auth/auth.service';
import { Store } from '../store';

import { ApiModule } from './api.module';

describe('ApiModule sets up an interceptor that', () => {
  const fakeToken = 'fake.token.1234';
  const fakeBaseUrl = 'https://api.example.org/v2';
  const fakeDataPath = '/data';

  let httpMock: HttpTestingController;
  let auth: { token: BehaviorSubject<string> };
  let baseUrl: BehaviorSubject<string>;
  let store: jasmine.SpyObj<Store>;
  let request: HttpRequest<any>;

  beforeEach(() => {
    auth = { token: new BehaviorSubject(fakeToken) };

    store = jasmine.createSpyObj('Store', ['select']);
    baseUrl = new BehaviorSubject(fakeBaseUrl);
    store.select.and.returnValue(baseUrl);

    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Store, useValue: store },
      ],
    });

    httpMock = TestBed.get(HttpTestingController);

    const http = TestBed.get(HttpClient);
    http.get(fakeDataPath).subscribe();

    request = httpMock.expectOne(fakeBaseUrl + fakeDataPath).request;
  });

  it('appends Authorization header with token from the store to HTTP requests', () => {
    expect(request.headers.keys()).toEqual(['Authorization']);
    expect(request.headers.getAll('Authorization')).toEqual([fakeToken]);
  });

  it('prepends url with baseUrl from the store to HTTP requests', () => {});

  describe('does not re-execute the request if', () => {
    it('baseUrl changes', () => {
      baseUrl.next(fakeBaseUrl + 2);
    });

    it('token changes', () => {
      auth.token.next(fakeToken + 2);
    });

    it('both baseUrl and token change', () => {
      baseUrl.next(fakeBaseUrl + 2);
      auth.token.next(fakeToken + 2);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
