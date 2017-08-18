import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../auth/auth.service';

import { LoginModule } from './login.module';
import { LoginComponent } from './login.component';

@Injectable()
export class MockAuthService {
  login() {}
}

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  let spyOnLogin: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoginModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);

    const authService = fixture.debugElement.injector.get(AuthService);
    spyOnLogin = spyOn(authService, 'login');

    fixture.detectChanges();
  });

  it('should call auth.login()', () => {
    expect(spyOnLogin).toHaveBeenCalled();
  });
});
