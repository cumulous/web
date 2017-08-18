import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { apiKeys, CoreModule } from './core.module';

import { APIS } from '../api/api/api'; // :)
import { Configuration as ApiConfig } from '../api/configuration';

import { AuthService } from '../auth/auth.service';
import { AuthConfig } from '../auth/auth.config';

import { environment } from '../../environments/environment';

describe('CoreModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        RouterTestingModule,
      ],
    });
  });

  it('throws an error if imported more than once', (done) => {
    try {
      new CoreModule(TestBed.get(CoreModule));
    } catch (err) {
      done();
    }
  });

  it('initializes ApiModule services with correct parameters', () => {
    APIS.forEach(apiService => {
      const config = TestBed.get(apiService).configuration;
      expect(config).toEqual(new ApiConfig({
        basePath: environment.apiRoot,
        withCredentials: true,
        apiKeys,
      }));
      expect(config.apiKeys).toBe(apiKeys);
    });
  });

  it('initializes AuthModule with correct parameters', () => {
    const config = TestBed.get(AuthService).config;
    expect(config).toEqual(new AuthConfig(
      environment.auth.clientId,
      environment.auth.domain,
      apiKeys,
    ));
    expect(config.apiKeys).toBe(apiKeys);
  });
});
