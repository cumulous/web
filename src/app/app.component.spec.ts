import { Component, Injectable, NgModule, NgModuleFactoryLoader } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { debugElement, selectElements } from '../testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { AuthGuardService } from './auth/auth-guard.service';

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
  canActivateChild() { return true; }
  canLoad() { return true; }
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let router: Router;

  beforeEach(fakeAsync(() => {
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
      datasets: MockModule,
      analyses: MockModule,
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

  describe('should display <nav> element if the route is', () => {
    let url: string;
    it('/datasets', () => url = '/datasets');
    it('/analyses', () => url = '/analyses');
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
    expect(links.map(link => link.textContent.trim())).toEqual(['Datasets', 'Analyses']);
    expect(links.map(link => link.pathname)).toEqual(['/datasets', '/analyses']);
  });
});
