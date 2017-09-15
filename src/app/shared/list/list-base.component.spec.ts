import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MdDialog, MdDialogModule, MD_DIALOG_DATA } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { debugElement, elementsText, fakeUUIDs, selectElement } from '../../../testing';

import { ListModule } from './list.module';
import { ListBaseComponent, ListColumn } from './list-base.component';

interface Item {
  id: string;
  created_at: string;
  description: string;
}

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
  selector: 'app-item-list',
  templateUrl: './list-base.component.html',
})
class ItemListComponent extends ListBaseComponent<Item> implements OnInit {

  pageLimit: number;

  static fakeItems(offset: number, limit: number) {
    return Observable.of({
      items: fakeItems(offset, limit),
    });
  }

  constructor(dialog: MdDialog) {
    super(dialog, ItemDialogComponent);
  }

  ngOnInit() {
    this.columns.push(
      new ListColumn('created_at', 'Date Created', this.dateTemplate),
      new ListColumn('description', 'Description', null, 'item-description'),
    );
    super.ngOnInit();
  }

  protected list(offset: number, limit: number) {
    return ItemListComponent.fakeItems(offset, limit);
  }
}

@Component({
  template: '',
})
class ItemDialogComponent {
  constructor(@Inject(MD_DIALOG_DATA) item: Item) {}
}

@NgModule({
  imports: [
    CommonModule,
    MdDialogModule,
    ListModule,
  ],
  declarations: [
    ItemListComponent,
    ItemDialogComponent,
  ],
  entryComponents: [
    ItemDialogComponent,
  ],
  providers: [
    MdDialog,
  ],
})
export class ItemsModule { }

export function pageSize(fixture: ComponentFixture<ListBaseComponent<any>>) {
  const page = debugElement(fixture, '.list').nativeElement;
  const component = fixture.componentInstance;
  return Math.ceil((page.offsetHeight - component.headerHeight) / component.rowHeight);
}

describe('ListBaseComponent', () => {
  const itemPageSurplus = 2;

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
        ItemsModule,
      ],
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

  it('applies "progress-bottom" style to the list after the initial loading', () => {
    const page = debugElement(fixture, '.list').nativeElement;
    spyOn(ItemListComponent, 'fakeItems').and.callFake(() => {
      expect(component.progressBottom).toBe(false);
      expect(page.classList).not.toContain('progress-bottom');
      return Observable.of({ items: [] });
    });
    fixture.detectChanges();
    expect(component.progressBottom).toBe(true);
    expect(page.classList).toContain('progress-bottom');
  });

  describe('', () => {
    const updatedDescription = 'Item 0 (updated)';

    let spyOnDialogOpen: jasmine.Spy;

    const testSubmit = (data?: any) => {
      fixture.detectChanges();

      const dialog = TestBed.get(MdDialog);
      const dialogRef = jasmine.createSpyObj('DialogRef', ['close', 'afterClosed']);
      spyOnDialogOpen = spyOn(dialog, 'open')
        .and.returnValue(dialogRef);
      dialogRef.afterClosed.and.returnValue(Observable.of(data));

      const description = selectElement(fixture, '.item-description');
      expect(description.textContent.trim()).toBe(fakeItem(0).description);
      description.click();
      tick();
      fixture.detectChanges();
    };
    it('opens a dialog for the item been clicked', fakeAsync(() => {
      testSubmit();
      expect(spyOnDialogOpen).toHaveBeenCalledWith(ItemDialogComponent, {
        data: fakeItem(0),
      });
    }));
    it('applies a defined update from afterClosed() observable', fakeAsync(() => {
      testSubmit({
        description: updatedDescription,
      });
      expect(component.rows[0].id).toEqual(fakeItem(0).id);
      expect(component.rows[0].created_at).toEqual(fakeItem(0).created_at);
      expect(component.rows[0].description).toEqual(updatedDescription);
    }));
    it('ignores "undefined" update from afterClosed() observable', fakeAsync(() => {
      testSubmit();
      expect(component.rows[0]).toEqual(fakeItem(0));
    }));
  });
});
