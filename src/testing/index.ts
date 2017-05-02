import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function selectElement<T> (fixture: ComponentFixture<T>, locator: string) {
  return fixture.debugElement.query(By.css(locator)).nativeElement;
}
