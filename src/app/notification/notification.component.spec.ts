import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { debugComponent } from '../../testing';

import { NotificationComponent } from './notification.component';

@Component({
  selector: 'app-notification',
  template: '',
})
class StubViewComponent {
  @Input() text?: string;
  @Input() class?: string;
}

describe('NotificationComponent', () => {
  const fakeText = 'Text message';
  const fakeClass = 'info';
  const fakeNewText = 'Error message';
  const fakeNewClass = 'error';

  let fixture: ComponentFixture<NotificationComponent>;
  let view: StubViewComponent;
  let route: {
    params: BehaviorSubject<Params>;
  };

  beforeEach(() => {
    route = {
      params: new BehaviorSubject({
        text: fakeText,
        class: fakeClass,
      }),
    };

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
      ],
      declarations: [
        NotificationComponent,
        StubViewComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    fixture = TestBed.createComponent(NotificationComponent);
    view = debugComponent(fixture, StubViewComponent);

    fixture.detectChanges();
  });

  it('constructs the view', () => {
    expect(view).toBeTruthy();
  });

  it('sets "text" and "class" of the view to the values from the route', () => {
    expect(view.text).toBe(fakeText);
    expect(view.class).toBe(fakeClass);
  });

  it('updates "text" and "class" of the view to new values', () => {
    route.params.next({
      text: fakeNewText,
      class: fakeNewClass,
    });

    fixture.detectChanges();

    expect(view.text).toBe(fakeNewText);
    expect(view.class).toBe(fakeNewClass);
  });
});
