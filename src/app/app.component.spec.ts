import { Component, Injectable, NgModule, NgModuleFactoryLoader } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { debugElement, selectElements } from '../testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { AuthGuardService } from './auth/auth-guard.service';

import { Store } from './store';
import { storage } from './store/actions';

@Component({
  template: '',
})
class MockLoginComponent {}

@Component({
  template: '',
})
class MockComponent {}

@NgModule({
  declarations: [
    MockComponent,
  ],
})
class MockModule {}

@Injectable()
class MockAuthGuard {
  canActivate() { return true; }
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let router: Router;
  let store: jasmine.SpyObj<Store>;

  beforeEach(fakeAsync(() => {
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
      ],
      declarations: [
        MockLoginComponent,
      ],
      providers: [
        { provide: AuthGuardService, useClass: MockAuthGuard },
        { provide: Store, useValue: store },
      ],
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ MockLoginComponent ]
      }
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

    const loader = TestBed.get(NgModuleFactoryLoader);
    loader.stubbedModules = {
      projects: MockModule,
      datasets: MockModule,
      analyses: MockModule,
      api: MockModule,
    };

    router = TestBed.get(Router);
    router.resetConfig(router.config.map(route => {
      if (route.loadChildren) {
        route.loadChildren = route.path;
      } else if (route.path === 'login') {
        route.component = MockLoginComponent;
      }
      return route;
    }));

    router.initialNavigation();
    fixture.detectChanges();
  }));

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should navigate to /datasets by default', () => {
    expect(router.url).toEqual('/datasets');
  });

  describe('should display <nav> element if the route starts with', () => {
    let url: string;
    const params = ';test=param';
    it('/projects', () => url = '/projects' + params);
    it('/datasets', () => url = '/datasets' + params);
    it('/analyses', () => url = '/analyses' + params);
    it('/api', () => url = '/api' + params);
    afterEach(fakeAsync(() => {
      router.navigateByUrl(url);
      tick();
      fixture.detectChanges();
      const nav = debugElement(fixture, 'nav');
      expect(nav).toBeTruthy();
    }));
  });

  it('should not display <nav> element if the route starts with /login', fakeAsync(() => {
    router.navigateByUrl('/login#test');
    tick();
    fixture.detectChanges();
    const nav = debugElement(fixture, 'nav');
    expect(nav).toBeFalsy();
  }));

  it('should display correct <a> elements for navigation', () => {
    const links = selectElements(fixture, 'nav a');
    expect(links.map(link => link.textContent.trim())).toEqual([
      'Projects', 'Datasets', 'Analyses', 'API',
    ]);
    expect(links.map(link => link.pathname)).toEqual([
      '/projects', '/datasets', '/analyses', '/api',
    ]);
  });

  it('should display SessionComponent as part of the navigation bar', () => {
    const component = debugElement(fixture, 'nav app-session-control');
    expect(component).toBeTruthy();
  });

  it('should dispatch STORAGE action once with correct key on window.storage events', () => {
    const key = 'test';

    window.dispatchEvent(new StorageEvent('storage', {
      key,
      url: router.url,
    }));

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(storage(key));
  });
});
