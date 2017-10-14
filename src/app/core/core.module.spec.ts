import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { environment } from '../../environments/environment';
import { Configuration as ApiConfig } from '../api/configuration';
import { CoreModule } from './core.module';

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

  it('correctly configures ApiModule', () => {
    const config = TestBed.get(ApiConfig);
    expect(config).toEqual(new ApiConfig({
      basePath: environment.apiRoot,
      apiKeys: {
        Authorization: undefined,
      },
    }));
  });
});
