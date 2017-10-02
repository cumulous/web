import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import * as uuid from 'uuid';

function root<T> (fixture: ComponentFixture<T>) {
  return fixture.debugElement;
}

export function debugElement<T> (fixture: ComponentFixture<T>, locator: string | Type<any>) {
  if (typeof locator === 'string') {
    return root(fixture).query(By.css(locator));
  } else {
    return root(fixture).query(By.directive(locator));
  }
}

export function debugElements<T> (fixture: ComponentFixture<T>, locator: string | Type<any>) {
  if (typeof locator === 'string') {
    return root(fixture).queryAll(By.css(locator));
  } else {
    return root(fixture).queryAll(By.directive(locator));
  }
}

export function selectElement<T> (fixture: ComponentFixture<T>, locator: string | Type<any>) {
  return debugElement(fixture, locator).nativeElement;
}

export function selectElements<T> (fixture: ComponentFixture<T>, locator: string | Type<any>) {
  return debugElements(fixture, locator)
    .map(element => element.nativeElement);
}

export function elementsText<T> (fixture: ComponentFixture<T>, locator: string | Type<any>) {
  return selectElements(fixture, locator)
    .map(element => element.textContent.trim());
}

export function dispatchEvent<T> (fixture: ComponentFixture<T>, locator: string | Type<any>, eventName: string) {
  const element = selectElement(fixture, locator);
  element.dispatchEvent(new Event(eventName));
  fixture.detectChanges();
}

export function fakeUUIDs(count: number) {
  return Array.from({length: count}, (d, i) => uuid());
}
