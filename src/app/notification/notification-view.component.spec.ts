import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';

import { NotificationViewComponent } from './notification-view.component';

abstract class TestComponent {
  text?: string;
  class?: string;
}

@Component({
  template: '<app-notification [text]="text" [class]="class"></app-notification>',
})
class TestControllerComponent extends TestComponent {}

@Component({
  template: '<app-notification></app-notification>',
})
class TestViewComponent extends TestComponent {}

describe('NotificationViewComponent', () => {
  const fakeText = 'Text message';

  let fixture: ComponentFixture<TestControllerComponent | TestViewComponent>;
  let component: TestControllerComponent | TestViewComponent;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

    TestBed.configureTestingModule({
      declarations: [
        NotificationViewComponent,
        TestControllerComponent,
        TestViewComponent,
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });

    fixture = TestBed.createComponent(TestControllerComponent);
    component = fixture.componentInstance;
  });

  beforeEach(fakeAsync(() => {
    fixture.detectChanges();
    tick();
  }));

  describe('calls snackBar.open() once with correct parameters if "text" is defined,', () => {
    let textClass: string | undefined;
    let extraClasses: string[] | undefined;

    beforeEach(() => {
      expect(snackBar.open).not.toHaveBeenCalled();
    });

    it('but "class" is not', () => {
      textClass = undefined;
      extraClasses = undefined;
    });

    it('but "class" is not in the list of supported classes', () => {
      textClass = 'unsupported';
      extraClasses = undefined;
    });

    it('and "class" is "error"', () => {
      textClass = 'error';
      extraClasses = [textClass];
    });

    it('and "class" is "warning"', () => {
      textClass = 'warning';
      extraClasses = [textClass];
    });

    it('and "class" is "info"', () => {
      textClass = 'info';
      extraClasses = [textClass];
    });

    afterEach(fakeAsync(() => {
      component.text = fakeText;
      component.class = textClass;

      fixture.detectChanges();
      tick();

      expect(snackBar.open).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledWith(fakeText, 'Dismiss', {
        extraClasses,
      });
    }));
  });

  describe('does not call snackBar.open()', () => {
    it('by itself', () => {
      fixture = TestBed.createComponent(TestViewComponent);
      component = fixture.componentInstance;
    });

    it('if "text" is undefined', () => {
      component.text = undefined;
    });

    afterEach(fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(snackBar.open).not.toHaveBeenCalled();
    }));
  });

  describe('calls snackBar.dismiss() once when', () => {
    it('"text" is undefined', () => {
      expect(component.text).toBeUndefined();
    });

    it('the component is destroyed', () => {
      snackBar.dismiss.calls.reset();
      TestBed.resetTestingModule();
    });

    afterEach(() => {
      expect(snackBar.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
