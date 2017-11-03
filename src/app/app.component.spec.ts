import { Component, Injectable } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { debugComponent, debugElement, selectElements } from '../testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { AuthGuardService } from './auth/auth-guard.service';

import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';

import { Store } from './store';
import { storage } from './store/actions';

@Component({
  template: '',
})
class MockComponent {}

@Component({
  template: '',
})
class MockLoginComponent {}

@Component({
  template: '',
})
class MockNotificationComponent {}

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
        MockComponent,
        MockLoginComponent,
        MockNotificationComponent,
      ],
      providers: [
        { provide: AuthGuardService, useClass: MockAuthGuard },
        { provide: Store, useValue: store },
      ],
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          MockComponent,
          MockLoginComponent,
          MockNotificationComponent,
        ],
      }
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

    router = TestBed.get(Router);
    router.resetConfig(router.config.map(route => {
      if (route.loadChildren) {
        route.loadChildren = undefined;
        route.component = MockComponent;
      } else if (route.component === LoginComponent) {
        route.component = MockLoginComponent;
      } else if (route.component === NotificationComponent) {
        route.component = MockNotificationComponent;
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

  describe('should display <nav> element if the primary route path is', () => {
    let path: string;

    it('projects', () => path = 'projects');
    it('datasets', () => path = 'datasets');
    it('analyses', () => path = 'analyses');
    it('api', () => path = 'api');

    afterEach(fakeAsync(() => {
      router.navigate([path]);
      tick();
      fixture.detectChanges();
      const nav = debugElement(fixture, 'nav');
      expect(nav).toBeTruthy();
    }));
  });

  it('should display correct <a> elements for navigation', () => {
    const links = selectElements(fixture, 'nav a');
    expect(links.map(link => link.textContent.trim())).toEqual([
      'Projects', 'Datasets', 'Analyses', 'API',
    ]);
    expect(links.map(link => link.pathname)).toEqual([
      '/projects', '/datasets', '/analyses', '/api',
    ]);
  });

  it('should display LoginComponent if the route starts with /login', fakeAsync(() => {
    router.navigateByUrl('/login#test');
    tick();
    const component = debugComponent(fixture, MockLoginComponent);
    expect(component).toBeTruthy();
  }));

  it('should not display <nav> element if the route starts with /login', fakeAsync(() => {
    router.navigateByUrl('/login#test');
    tick();
    fixture.detectChanges();
    const nav = debugElement(fixture, 'nav');
    expect(nav).toBeFalsy();
  }));

  const routeNotification = () => {
    router.navigate([{ outlets: { notification: ['message'] }}]);
    tick();
  };

  it('should display NotificationComponent in the "notification" outlet', fakeAsync(() => {
    routeNotification();
    const component = debugComponent(fixture, MockNotificationComponent);
    expect(component).toBeTruthy();
  }));

  it('should reset "notification" outlet after clicking on a navigation link', fakeAsync(() => {
    const links = selectElements(fixture, 'nav a');
    links.forEach(link => {
      routeNotification();
      tick();

      link.click();
      tick();

      const component = debugElement(fixture, MockNotificationComponent);
      expect(component).toBeFalsy();
    });
  }));

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
