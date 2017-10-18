import { TestBed } from '@angular/core/testing';

import { CoreModule } from './core.module';

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
});
