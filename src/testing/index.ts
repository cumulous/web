import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import * as uuid from 'uuid';

export function debugElement<T> (fixture: ComponentFixture<T>, locator: string | Type<any>) {
  const root = fixture.debugElement;
  if (typeof locator === 'string') {
    return root.query(By.css(locator));
  } else {
    return root.query(By.directive(locator));
  }
}

export function selectElement<T> (fixture: ComponentFixture<T>, locator: string | Type<any>) {
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

export function dispatchEvent<T> (fixture: ComponentFixture<T>, locator: string, eventName: string) {
  const element = selectElement(fixture, locator);
  element.dispatchEvent(new Event(eventName));
  fixture.detectChanges();
}

export function fakeUUIDs(count: number) {
  return Array.from({length: count}, (d, i) => uuid());
}
