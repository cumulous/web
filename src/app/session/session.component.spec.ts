import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { selectElement } from '../../testing';

import { SessionModule } from './session.module';
import { SessionComponent } from './session.component';

describe('SessionComponent', () => {
  let fixture: ComponentFixture<SessionComponent>;

  let router: Router;
  let button: any;

  beforeEach(() => {
    spyOn(Router.prototype, 'navigate');

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SessionModule,
      ],
    });

    fixture = TestBed.createComponent(SessionComponent);
    router = TestBed.get(Router);

    fixture.detectChanges();

    button = selectElement(fixture, '#logOut');
  });

  it('should display a "Log Out" button if authenticated', () => {
    expect(button.textContent.trim()).toBe('Log Out');
  });

  it('should correctly navigate the router if the "Log Out" button is clicked', () => {
    button.click();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/login', {
      logout: true,
    }]);
  });

  it('should not navigate the router by itself', () => {
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
