import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { elementsText, selectElement, selectElements } from '../testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { APIS } from './api/api/api'; // :)
import { Configuration as ApiConfig } from './api/configuration';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let h1: HTMLElement;
  let router: Router;
  let location: Location;

  const fakeAccessToken = 'ey.12.ab';

  beforeEach(fakeAsync(() => {
    localStorage.setItem('accessToken', fakeAccessToken);

    TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule,
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    h1 = selectElement(fixture, 'h1');

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    router.initialNavigation();
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'app works!'`, () => {
    expect(app.title).toEqual('app works!');
  });

  it('should render title in a h1 tag', () => {
    expect(h1.textContent).toContain('app works!');
  });

  it('should navigate to /datasets by default', () => {
    expect(location.path()).toEqual('/datasets');
  });

  it('should display <nav> element', () => {
    const nav = selectElement(fixture, 'nav');
    expect(nav).toBeTruthy();
  });

  it('should display <a> elements for the tabs', () => {
    const links = elementsText(fixture, 'nav a');
    expect(links).toEqual(['Datasets']);
  });

  it('should navigate correctly when we click on the tabs', () => {
    const links = selectElements(fixture, 'nav a');
    const routes = ['/datasets'];
    links.forEach((link, i) => {
      link.click();
      fixture.detectChanges();
      expect(location.path()).toEqual(routes[i]);
    });
  });

  it('should initialize ApiModule services with correct parameters', () => {
    APIS.forEach(service => {
      expect(TestBed.get(service).configuration).toEqual(new ApiConfig({
        basePath: environment.apiRoot,
        apiKeys: {
          Authorization: fakeAccessToken,
        },
        withCredentials: true,
      }));
    });
  });
});
