import { ComponentFixture, TestBed } from '@angular/core/testing';

import { debugElement, elementText } from '../../../testing';

import { ListModule } from './list.module';
import { ListCellComponent } from './list-cell.component';

interface Item {
  name: string;
}

describe('ListCellComponent', () => {
  const fakeName = 'Fake Name';

  const fakeItem = () => ({
    name: fakeName,
  });

  let fixture: ComponentFixture<ListCellComponent<Item>>;
  let component: ListCellComponent<Item>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ListModule,
      ],
    });

    fixture = TestBed.createComponent(ListCellComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  const indicator = () =>
    debugElement(fixture, 'mat-progress-spinner');

  it('shows loading indicator when item is undefined', () => {
    expect(indicator()).toBeTruthy();
  });

  it('does not show loading indicator when item is defined', () => {
    component.item = fakeItem();
    fixture.detectChanges();

    expect(indicator()).toBeFalsy();
  });

  it('does not show item name when item is undefined', () => {
    expect(elementText(fixture)).toBe('');
  });

  it('shows item name when item is defined', () => {
    component.item = fakeItem();
    fixture.detectChanges();

    expect(elementText(fixture)).toBe(fakeName);
  });
});
