import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import * as swaggerUiDist from 'swagger-ui-dist';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { selectElement } from '../../testing';

import { SwaggerComponent, HideTopbarPlugin } from './swagger.component';

import { Configuration as ApiConfig } from '../api/configuration';
import { ApiService } from '../api/api/api.service';

it('HideTopbarPlugin() returns a null Topbar component', () => {
  expect(HideTopbarPlugin().components.Topbar()).toBeNull();
});

describe('SwaggerComponent', () => {
  const fakeApiHost = 'fake.api.example.org';
  const fakeApiPath = '/v1';
  const fakeToken = 'ey.ab.cdef';

  let fixture: ComponentFixture<SwaggerComponent>;
  let component: SwaggerComponent;

  let apiService: ApiService;
  let apiSpec: any;
  let swaggerUi: SwaggerUIBundle;

  let spyOnSwaggerUIBundle: jasmine.Spy;

  beforeEach(fakeAsync(() => {
    apiService = jasmine.createSpyObj('ApiService', ['getApi']);
    apiService.configuration = new ApiConfig({
      basePath: 'https://' + fakeApiHost + fakeApiPath,
      apiKeys: {
        Authorization: fakeToken,
      },
    });
    apiSpec = jasmine.createSpy('Spec');
    (apiService.getApi as jasmine.Spy).and.returnValue(Observable.of(apiSpec));

    swaggerUi = jasmine.createSpy('SwaggerUIBundle');
    swaggerUi.authActions = jasmine.createSpyObj('SwaggerUIAuthActions', ['authorize']);
    spyOnSwaggerUIBundle = spyOn(swaggerUiDist, 'SwaggerUIBundle')
      .and.returnValue(swaggerUi);

    TestBed.configureTestingModule({
      declarations: [
        SwaggerComponent,
      ],
      providers: [
        { provide: ApiService, useValue: apiService },
      ],
    });

    fixture = TestBed.createComponent(SwaggerComponent);
    component = fixture.componentInstance;

    component.ngAfterViewInit();
    tick();
  }));

  it('ngAfterViewInit() calls ApiService.getApi() once', () => {
    expect(apiService.getApi).toHaveBeenCalledTimes(1);
  });

  describe('ngAfterViewInit() sets spec.host and spec.basePath to correct values', () => {
    it('if ApiService.configuration.basePath starts with https://', () => {
      expect(apiSpec.host).toBe(fakeApiHost);
    });
    it('if ApiService.configuration.basePath starts with /', fakeAsync(() => {
      apiService.configuration.basePath = fakeApiPath;
      component.ngAfterViewInit();
      tick();
      expect(apiSpec.host).toBeUndefined();
    }));
    afterEach(() => {
      expect(apiSpec.basePath).toBe(fakeApiPath);
    });
  });

  it('ngAfterViewInit() constructs SwaggerUIBundle once with correct parameters', () => {
    const swaggerNode = selectElement(fixture, 'div');
    expect(spyOnSwaggerUIBundle).toHaveBeenCalledTimes(1);
    expect(spyOnSwaggerUIBundle).toHaveBeenCalledWith({
      spec: apiSpec,
      domNode: swaggerNode,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset,
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl,
        HideTopbarPlugin,
      ],
      layout: 'StandaloneLayout',
    });
  });

  it('ngAfterViewInit() calls SwaggerUIBundle.authActions.authorize() once with correct parameters',
      () => {
    expect(swaggerUi.authActions.authorize).toHaveBeenCalledTimes(1);
    expect(swaggerUi.authActions.authorize).toHaveBeenCalledWith({
      member_token: {
        name: 'member_token',
        schema: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
        value: fakeToken,
      },
    });
  });
});
