import { Component, ElementRef, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { debugElement, elementsText, fakeUUIDs } from '../../testing';

import { SharedModule } from './shared.module';
import { ListBaseComponent, ListColumn } from './list-base.component';

export function pageSize(fixture: ComponentFixture<ListBaseComponent<any>>) {
  const page = debugElement(fixture, '.list').nativeElement;
  const component = fixture.componentInstance;
  return Math.ceil((page.offsetHeight - component.headerHeight) / component.rowHeight);
}

describe('ListBaseComponent', () => {

  interface Item {
    id: string;
    created_at: string;
    description: string;
  }

  const itemPageSurplus = 2;

  const item_ids = fakeUUIDs(100);
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

    pageLimit: number;

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

    component.pageLimit = pageSize(fixture) + itemPageSurplus;
  });

  it('correctly displays column names', () => {
    fixture.detectChanges();
    const columnNames = elementsText(fixture, '.list-column');
    expect(columnNames).toEqual(['Date Created', 'Description']);
  });

  describe('loads correct items if', () => {
    let limit: number;
    let pSize: number;
    beforeEach(() => {
      pSize = pageSize(fixture);
    });
    afterEach(() => {
      fixture.detectChanges();
      expect(componentRows()).toEqual(fakeItems(0, limit));
    });
    it('pageSize < pageLimit', () => {
      component.pageLimit = pSize + 1;
      limit = component.pageLimit;
    });
    it('pageSize = pageLimit', () => {
      component.pageLimit = pSize;
      limit = pSize;
    });
    it('pageSize > pageLimit', () => {
      component.pageLimit = pSize - 1;
      limit = pSize;
    });
  });

  describe('displays correct', () => {
    let rowsText: string[];
    beforeEach(() => {
      fixture.detectChanges();
      rowsText = elementsText(fixture, '.list-row');
    });
    it('number of items', () => {
      expect(rowsText.length).toEqual(pageSize(fixture));
    });
    it('item descriptions', () => {
      rowsText.map((rowText, i) => {
        expect(rowText).toContain(fakeItem(i).description);
      });
    });
    it('item creation dates', () => {
      rowsText.map((rowText, i) => {
        const createdAt = new Date(fakeItem(i).created_at);
        const createdDate = createdAt.toLocaleDateString();
        const createdTime = createdAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        expect(rowText).toContain(createdDate + ', ' + createdTime);
      });
    });
  });

  it('loads the second page of items on (scroll) event', () => {
    fixture.detectChanges();
    triggerScroll((itemPageSurplus + 1) * component.rowHeight);
    fixture.detectChanges();
    expect(componentRows()).toEqual(fakeItems(0, 2 * component.pageLimit));
  });

  describe('does not load the same page twice', () => {
    let spyOnItemsList: jasmine.Spy;
    beforeEach(() => {
      spyOnItemsList = spyOn(ItemListComponent, 'fakeItems').and.callThrough();
    });
    afterEach(() => {
      fixture.detectChanges();
      expect(componentRows()).toEqual(fakeItems(0, component.pageLimit));
      expect(spyOnItemsList).toHaveBeenCalledTimes(1);
    });
    it('if the page is already loaded', () => {
      fixture.detectChanges();
      triggerScroll(0);
    });
    it('while the page is being loaded', () => {
      spyOnItemsList.and.callFake((offset: number, limit: number) => {
        triggerScroll(0);
        return Observable.of({
          items: fakeItems(offset, limit),
        });
      });
    });
  });

  it('enables loading indicator during page load', () => {
    spyOn(ItemListComponent, 'fakeItems').and.callFake(() => {
      expect(component.isLoading).toBe(true);
      return Observable.of({ items: [] });
    });
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });
});
