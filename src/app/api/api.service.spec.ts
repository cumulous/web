import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';
import { apiBaseSelector, Store } from '../store';

import { ApiModule } from './api.module';
import { ApiService, RequestParams } from './api.service';

describe('ApiService', () => {
  const fakeToken = 'fake.token.1234';
  const fakeBaseUrl = 'https://api.example.org/v2';
  const fakeStrParam = '';
  const fakeNumParam = 0;

  const fakeHeaders = () => ({
    Authorization: [fakeToken],
  });

  const fakeParams = () => ({
    strParam: fakeStrParam,
    numParam: fakeNumParam,
    undefParam: undefined,
  });

  const fakeBody = () => ({
    some: 'body',
  });

  const fakeResult = () => ({
    fake: 'result',
  });

  let api: ApiService;
  let auth: { token: Observable<string> };
  let http: jasmine.SpyObj<HttpClient>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(() => {
    auth = { token: Observable.of(fakeToken) };

    http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch']);

    store = jasmine.createSpyObj('Store', ['select']);
    store.select.and.returnValue(Observable.of(fakeBaseUrl));

    TestBed.configureTestingModule({
      imports: [
        ApiModule,
      ],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: HttpClient, useValue: http },
        { provide: Store, useValue: store },
      ],
    });

    api = TestBed.get(ApiService);
  });

  const checkHeaders = (httpHeaders: HttpHeaders) => {
    const headers: { [key: string]: string[] | null } = {};

    httpHeaders.keys().forEach(key => {
      headers[key] = httpHeaders.getAll(key);
    });

    expect(headers).toEqual(fakeHeaders());
  };

  describe('get() returns result of httpClient.get() called once with correct parameters for', () => {
    let path: string[];
    let url: string;
    let params: RequestParams | undefined;
    let httpParams: HttpParams;

    beforeEach(() => {
      url = fakeBaseUrl;
      path = [];

      params = fakeParams();

      httpParams = new HttpParams()
        .set('strParam', fakeStrParam)
        .set('numParam', String(fakeNumParam));

      http.get.and.returnValue(Observable.of(fakeResult()));
    });

    it('an empty path', () => {});

    it('a non-empty path', () => {
      path = ['fake', 'path'];
      url += '/fake/path';
    });

    it('undefined params', () => {
      params = undefined;
      httpParams = new HttpParams();
    });

    afterEach(done => {
      api.get(path, params).subscribe(result => {
        expect(store.select).toHaveBeenCalledWith(apiBaseSelector);
        expect(http.get).toHaveBeenCalledTimes(1);
        expect(http.get).toHaveBeenCalledWith(url, {
          headers: jasmine.any(HttpHeaders),
          params: httpParams,
        });
        checkHeaders(http.get.calls.argsFor(0)[1].headers);
        expect(result).toEqual(fakeResult());
        done();
      });
    });
  });

  describe('post() returns result of httpClient.post() called once with correct parameters for', () => {
    let path: string[];
    let url: string;

    beforeEach(() => {
      http.post.and.returnValue(Observable.of(fakeResult()));
    });

    it('an empty path', () => {
      path = [];
      url = fakeBaseUrl;
    });

    it('a non-empty path', () => {
      path = ['fake', 'path'];
      url += '/fake/path';
    });

    afterEach(done => {
      api.post(path, fakeBody()).subscribe(result => {
        expect(store.select).toHaveBeenCalledWith(apiBaseSelector);
        expect(http.post).toHaveBeenCalledTimes(1);
        expect(http.post).toHaveBeenCalledWith(url, fakeBody(), {
          headers: jasmine.any(HttpHeaders),
        });
        checkHeaders(http.post.calls.argsFor(0)[2].headers);
        expect(result).toEqual(fakeResult());
        done();
      });
    });
  });

  describe('patch() returns result of httpClient.patch() called once with correct parameters for', () => {
    let path: string[];
    let url: string;

    beforeEach(() => {
      http.patch.and.returnValue(Observable.of(fakeResult()));
    });

    it('an empty path', () => {
      path = [];
      url = fakeBaseUrl;
    });

    it('a non-empty path', () => {
      path = ['fake', 'path'];
      url += '/fake/path';
    });

    afterEach(done => {
      api.patch(path, fakeBody()).subscribe(result => {
        expect(store.select).toHaveBeenCalledWith(apiBaseSelector);
        expect(http.patch).toHaveBeenCalledTimes(1);
        expect(http.patch).toHaveBeenCalledWith(url, fakeBody(), {
          headers: jasmine.any(HttpHeaders),
        });
        checkHeaders(http.patch.calls.argsFor(0)[2].headers);
        expect(result).toEqual(fakeResult());
        done();
      });
    });
  });
});
