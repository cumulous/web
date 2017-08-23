import { ComponentFixture, TestBed } from '@angular/core/testing';

import { selectElement } from '../../testing';

import { SessionComponent } from './session.component';

import { AuthService } from '../auth/auth.service';

describe('SessionComponent', () => {
  let fixture: ComponentFixture<SessionComponent>;

  let auth: AuthService;
  let button: any;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      declarations: [
        SessionComponent,
      ],
      providers: [
        { provide: AuthService, useValue: auth },
      ],
    });

    fixture = TestBed.createComponent(SessionComponent);

    fixture.detectChanges();

    button = selectElement(fixture, '#logOut');
  });

  it('should display a "Log Out" button if authenticated', () => {
    expect(button.textContent.trim()).toBe('Log Out');
  });

  it('should call authService.logout() if the "Log Out" button is clicked', () => {
    button.click();
    expect(auth.logout).toHaveBeenCalled();
  });

  it('should not call authService.logout() by itself', () => {
    expect(auth.logout).not.toHaveBeenCalled();
  });
});
