import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function debugElement<T> (fixture: ComponentFixture<T>, locator: string) {
  return fixture.debugElement.query(By.css(locator));
}

export function selectElement<T> (fixture: ComponentFixture<T>, locator: string) {
  return debugElement(fixture, locator).nativeElement;
}

export function selectElements<T> (fixture: ComponentFixture<T>, locator: string) {
  return fixture.debugElement.queryAll(By.css(locator))
    .map(element => element.nativeElement);
}

export function elementsText<T> (fixture: ComponentFixture<T>, locator: string) {
  return selectElements(fixture, locator)
    .map(element => element.textContent.trim());
}
