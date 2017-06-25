import { Component, ElementRef, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { debugElement, elementsText, fakeUUIDs } from '../../testing';

import { SharedModule } from './shared.module';
import { ListBaseComponent, ListColumn } from './list-base.component';

describe('ListBaseComponent', () => {

  interface Item {
    id: string;
    created_at: string;
    description: string;
  }

  const itemListLimit = 5;
  const itemRowHeight = 55;

  const item_ids = fakeUUIDs(itemListLimit * 2);
  const now = new Date().getTime();

  const fakeItem = (i: number): Item => ({
    id: item_ids[i],
    created_at: new Date(now - i * 1E9).toISOString(),
    description: 'Item ' + i,
  });

  const fakeItems = (offset: number, limit: number) =>
    Array.from({length: limit}, (d, i) => fakeItem(offset + i));

  @Component({
    templateUrl: './list-base.component.html',
  })
  class ItemListComponent extends ListBaseComponent<Item> implements OnInit {

    protected readonly rowHeight: number = itemRowHeight;
    readonly pageLimit: number = itemListLimit;

    isLoading: boolean;
    readonly rows: Item[] = [];

    static fakeItems(offset: number, limit: number) {
      return Observable.of({
        items: fakeItems(offset, limit),
      });
    }

    constructor(element: ElementRef) {
      super(element);
    }

    ngOnInit() {
      this.columns.push(
        new ListColumn('created_at', 'Date Created', this.dateTemplate),
        new ListColumn('description'),
      );
      super.ngOnInit();
    }

    protected list(offset: number, limit: number) {
      return ItemListComponent.fakeItems(offset, limit);
    }
  }

  let fixture: ComponentFixture<ItemListComponent>;
  let component: ItemListComponent;
  let rowsText: string[];

  const triggerScroll = (offsetY: number) => debugElement(fixture, '.list')
    .triggerEventHandler('scroll', { offsetY });

  const componentRows = () => component.rows.map(row => {
    const { id, created_at, description } = row;
    return { id, created_at, description } as Item;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [ ItemListComponent ],
    });

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    rowsText = elementsText(fixture, '.list-row');
  });

  it('correctly displays column names', () => {
    const columnNames = elementsText(fixture, '.list-column');
    expect(columnNames).toEqual(['Date Created', 'Description']);
  });

  it('loads correct items', () => {
    expect(componentRows()).toEqual(fakeItems(0, itemListLimit));
  });

  it('correctly displays item descriptions', () => {
    rowsText.map((rowText, i) =>
      expect(rowText).toContain(fakeItem(i).description));
  });

  it('correctly displays item creation dates', () => {
    rowsText.map((rowText, i) => {
      const createdAt = new Date(fakeItem(i).created_at);
      const createdDate = createdAt.toLocaleDateString();
      const createdTime = createdAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      expect(rowText).toContain(createdDate + ', ' + createdTime);
    });
  });

  it('loads the second page of items on (scroll) event', () => {
    debugElement(fixture, '.list')
      .triggerEventHandler('scroll', { offsetY: itemRowHeight });
    fixture.detectChanges();
    expect(componentRows()).toEqual(fakeItems(0, 2 * itemListLimit));
  });

  describe('does not load the same page twice', () => {
    let spyOnItemsList: jasmine.Spy;
    beforeEach(() => {
      spyOnItemsList = spyOn(ItemListComponent, 'fakeItems').and.callThrough();
    });
    it('if the page is already loaded', () => {
      triggerScroll(0);
      fixture.detectChanges();
      expect(componentRows()).toEqual(fakeItems(0, itemListLimit));
      expect(spyOnItemsList).not.toHaveBeenCalled();
    });
    it('while the page is being loaded', () => {
      spyOnItemsList.and.callFake((offset: number, limit: number) => {
        triggerScroll(itemRowHeight);
        return Observable.of({
          items: fakeItems(offset, limit),
        });
      });
      triggerScroll(itemRowHeight);
      fixture.detectChanges();
      expect(componentRows()).toEqual(fakeItems(0, 2 * itemListLimit));
      expect(spyOnItemsList).toHaveBeenCalledTimes(1);
    });
  });

  it('enables loading indicator during page load', () => {
    spyOn(ItemListComponent, 'fakeItems').and.callFake(() => {
      expect(component.isLoading).toBe(true);
      return Observable.of({ items: [] });
    });
    debugElement(fixture, '#datasets-list');
    triggerScroll(itemRowHeight);
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });
});