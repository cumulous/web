import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { selectElement } from '../testing';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let h1: HTMLElement;
  let router: Router;
  let location: Location;

  beforeEach(fakeAsync(() => {
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
});
