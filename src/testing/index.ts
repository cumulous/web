import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function selectElement<T> (fixture: ComponentFixture<T>, locator: string) {
  return fixture.debugElement.query(By.css(locator)).nativeElement;
}

export function selectElements<T> (fixture: ComponentFixture<T>, locator: string) {
  return fixture.debugElement.queryAll(By.css(locator))
    .map(element => element.nativeElement);
}
