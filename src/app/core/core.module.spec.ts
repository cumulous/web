import { TestBed } from '@angular/core/testing';

import { apiKeys, CoreModule } from './core.module';

import { APIS } from '../api/api/api'; // :)
import { Configuration as ApiConfig } from '../api/configuration';

import { environment } from '../../environments/environment';

describe('CoreModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
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
});
