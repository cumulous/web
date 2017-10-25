import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

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
      expect(err.message).toContain('already');
      done();
    }
  });
});
