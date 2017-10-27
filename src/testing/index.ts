import { DebugElement, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import * as uuid from 'uuid';

function root<F> (fixture: ComponentFixture<F> | DebugElement) {
  return fixture instanceof DebugElement ? fixture : fixture.debugElement;
}

export function debugElement<F, T> (fixture: ComponentFixture<F> | DebugElement, locator: string | Type<T> = '') {
  if (locator === '') {
    return root(fixture);
  } else if (typeof locator === 'string') {
    return root(fixture).query(By.css(locator));
  } else {
    return root(fixture).query(By.directive(locator));
  }
}

export function debugComponent<F, T> (fixture: ComponentFixture<F> | DebugElement, component: Type<T>) {
  return debugElement(fixture, component).injector.get(component);
}

export function debugComponents<F, T> (fixture: ComponentFixture<F> | DebugElement, component: Type<T>) {
  return debugElements(fixture, component)
    .map(element => element.injector.get(component));
}

export function debugElements<F, T> (fixture: ComponentFixture<F> | DebugElement, locator: string | Type<T>) {
  if (typeof locator === 'string') {
    return root(fixture).queryAll(By.css(locator));
  } else {
    return root(fixture).queryAll(By.directive(locator));
  }
}

export function selectElement<F, T> (fixture: ComponentFixture<F> | DebugElement, locator: string | Type<T> = '') {
  return debugElement(fixture, locator).nativeElement;
}

export function selectElements<F, T> (fixture: ComponentFixture<F> | DebugElement, locator: string | Type<T>) {
  return debugElements(fixture, locator)
    .map(element => element.nativeElement);
}

export function elementText<F, T> (fixture: ComponentFixture<F> | DebugElement, locator: string | Type<T> = '') {
  return selectElement(fixture, locator).textContent.trim();
}

export function elementsText<F, T> (fixture: ComponentFixture<F> | DebugElement, locator: string | Type<T>) {
  return selectElements(fixture, locator)
    .map(element => element.textContent.trim());
}

export function dispatchEvent<F, T> (fixture: ComponentFixture<F>, locator: string | Type<T>,
                                  eventName: string, eventData?: any) {
  const element = selectElement(fixture, locator);
  element.dispatchEvent(new CustomEvent(eventName, { detail: eventData }));
  fixture.detectChanges();
}

export function fakeUUIDs(count: number) {
  return Array.from({length: count}, () => uuid());
}
