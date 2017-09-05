import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { apiKeys, CoreModule } from './core.module';

import { ApiModule } from '../api/api.module';
import { Configuration as ApiConfig } from '../api/configuration';

import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { AuthProviderConfig } from '../auth/auth-provider.config';

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

  const testApiConfig = () => {
    const config = TestBed.get(ApiConfig);
    expect(config).toEqual(new ApiConfig({
      basePath: environment.apiRoot,
      apiKeys,
    }));
    expect(config.apiKeys).toBe(apiKeys);
  };

  it('correctly configures ApiModule', () => {
    TestBed.overrideModule(CoreModule, {
      remove: {
        imports: [ AuthModule ],
      },
    });
    testApiConfig();
  });

  describe('correctly configures AuthModule with', () => {
    beforeEach(() => {
      TestBed.overrideModule(CoreModule, {
        remove: {
          imports: [ ApiModule ],
        },
      });
    });
    it('ApiConfig', () => {
      testApiConfig();
    });
    it('AuthProviderConfig', () => {
      const config = TestBed.get(AuthProviderConfig);
      expect(config).toEqual(environment.auth);
    });
  });
});
