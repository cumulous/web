import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RouterStateSerializer } from '@ngrx/router-store';

import { StoreModule } from './store.module';

describe('StoreModule', () => {
  const fakeUrl = '/fake/url;fake=param';

  const fakeQueryParams = () => ({
    fake: 'param',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule,
      ],
    });
  });

  it('configures custom RouterStateSerializer', () => {
    const serializer = TestBed.get(RouterStateSerializer);
    const routerState = {
      url: fakeUrl,
      root: {
        firstChild: {
          params: fakeQueryParams(),
        },
      },
    };
    const state = serializer.serialize(routerState);
    expect(state).toEqual({
      url: fakeUrl,
      params: fakeQueryParams(),
    });
  });
});
