import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '../core/core.module';

import { AuthService } from '../auth/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  let spyOnLogin: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        RouterTestingModule,
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
