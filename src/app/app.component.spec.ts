import { ComponentFixture, TestBed } from '@angular/core/testing';

import { selectElement } from '../testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    h1 = selectElement(fixture, 'h1');

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'app works!'`, () => {
    expect(app.title).toEqual('app works!');
  });

  it('should render title in a h1 tag', () => {
    expect(h1.textContent).toContain('app works!');
  });
});
