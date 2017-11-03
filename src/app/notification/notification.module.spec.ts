import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NotificationModule } from './notification.module';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {

  let fixture: ComponentFixture<NotificationComponent>;
  let component: NotificationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NotificationModule,
        RouterTestingModule,
      ],
    });

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it('sets up NotificationComponent', () => {
    expect(component).toBeTruthy();
  });
});
