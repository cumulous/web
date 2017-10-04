import { TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ItemsPageComponent } from '../shared/items/items-page.component';

import { AnalysesModule } from './analyses.module';

describe('AnalysesModule', () => {
  let routes: Routes;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AnalysesModule,
        RouterTestingModule,
      ],
    });

    routes = TestBed.get(Router).config;
  });

  it('configures a list of routes', () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  it('routes to ItemsPageComponent with correct parameters', () => {
    const defaultRoute = routes
      .filter(route => route.path === '')[0];

    expect(defaultRoute.component).toBe(ItemsPageComponent);
    expect(defaultRoute.data).toEqual({
      type: 'analyses',
    });
  });
});
