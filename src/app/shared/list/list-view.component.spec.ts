import { ComponentFixture, TestBed } from '@angular/core/testing';

import { debugElement, debugElements, elementsText, fakeUUIDs, selectElement } from '../../../testing';

import { ListModule } from './list.module';
import { ListViewComponent } from './list-view.component';
import { ListColumn } from './models';

interface Item {
  id: string;
  name: string;
  created_at: string;
  project_id: string;
  description: string;
}

const item_ids = fakeUUIDs(100);
const project_ids = fakeUUIDs(100);

const now = new Date().getTime();

const fakeItem = (i: number): Item => ({
  id: item_ids[i],
  name: 'Fake item ' + i,
  created_at: new Date(now - i * 1E9).toISOString(),
  project_id: project_ids[i],
  description: 'Item ' + i,
});

const fakeItems = (offset: number, limit: number) =>
  Array.from({length: limit}, (d, i) => fakeItem(offset + i));

const fakeProjectName = (i: number) => 'Fake project ' + i;

const fakeProject = (i: number) => ({
  id: project_ids[i],
  name: fakeProjectName(i),
  created_at: new Date(now - i * 1E8).toISOString(),
  created_by: 'Fake project creator ' + i,
  status: 'active',
});

export function pageSize(fixture: ComponentFixture<ListViewComponent<Item>>) {
  const page = debugElement(fixture, '.list').nativeElement;
  const component = fixture.componentInstance;
  return Math.ceil((page.offsetHeight - component.headerHeight) / component.rowHeight);
}

describe('ListViewComponent', () => {
  const itemPageSurplus = 2;

  let fixture: ComponentFixture<ListViewComponent<Item>>;
  let component: ListViewComponent<Item>;

  const triggerScroll = (offsetY: number) => debugElement(fixture, '.list')
    .triggerEventHandler('scroll', { offsetY });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ListModule,
      ],
    });

    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;

    component.columns = [
      new ListColumn('name'),
      new ListColumn('description', 'Description', undefined, 'item-description'),
      new ListColumn('project_id', 'Project', component.projectTemplate),
      new ListColumn('created_at', 'Date Created', component.dateTemplate),
    ];

    component.pageLimit = pageSize(fixture) + itemPageSurplus;
  });

  it('correctly displays column names', () => {
    fixture.detectChanges();
    expect(elementsText(fixture, '.list-column'))
      .toEqual(['Name', 'Description', 'Project', 'Date Created']);
  });

  describe('emits initial list() with correct parameters if', () => {
    let limit: number;
    let pSize: number;
    beforeEach(() => {
      pSize = pageSize(fixture);
    });
    afterEach(done => {
      component.list.subscribe(request => {
        expect(request).toEqual({
          limit,
        });
        done();
      });
      fixture.detectChanges();
    });
    it('pageSize < pageLimit', () => {
      component.pageLimit = pSize + 1;
      limit = pSize + 1;
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

  it('requests the second page upon (scroll) to the bottom of the list', done => {
    component.rows = fakeItems(0, component.pageLimit);
    component.list.subscribe(request => {
      expect(request).toEqual({
        limit: 2 * component.pageLimit,
      });
      done();
    });
    triggerScroll((itemPageSurplus + 1) * component.rowHeight);
  });

  describe('displays correct', () => {
    const knownProjectsCount = 2;

    let rowsText: string[];
    beforeEach(() => {
      component.rows = fakeItems(0, pageSize(fixture));

      project_ids.forEach((id, i) => {
        if (i < knownProjectsCount) {
          component.projects[id] = fakeProject(i);
        }
      });

      fixture.detectChanges();
      rowsText = elementsText(fixture, '.list-row');
    });
    it('number of items', () => {
      expect(rowsText.length).toEqual(pageSize(fixture));
    });
    it('item names', () => {
      rowsText.map((rowText, i) => {
        expect(rowText).toContain(fakeItem(i).name);
      });
    });
    it('item descriptions', () => {
      rowsText.map((rowText, i) => {
        expect(rowText).toContain(fakeItem(i).description);
      });
    });
    it('project names', () => {
      expect(rowsText.length).toBeGreaterThan(knownProjectsCount);
      rowsText.map((rowText, i) => {
        if (i < knownProjectsCount) {
          expect(rowText).toContain(fakeProjectName(i));
        } else {
          expect(rowText).not.toContain(fakeProjectName(i));
        }
      });
    });
    it('project loading indicators', () => {
      const rows = debugElements(fixture, '.list-row');
      rows.map((row, i) => {
        const indicator = debugElement(row, 'mat-progress-spinner');
        if (i < knownProjectsCount) {
          expect(indicator).toBeFalsy();
        } else {
          expect(indicator).toBeTruthy();
        }
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

  describe('does not request the same page twice if', () => {
    let spyOnListEvent: jasmine.Spy;
    beforeEach(() => {
      spyOnListEvent = spyOn(component.list, 'emit');
    });
    afterEach(() => {
      triggerScroll(0);
      expect(spyOnListEvent).not.toHaveBeenCalled();
    });
    it('the page is already loaded', () => {
      component.rows = fakeItems(0, pageSize(fixture));
    });
    it('"isLoading" is set to "true"', () => {
      component.isLoading = true;
    });
  });

  it('enables loading indicator during page load', () => {
    fixture.detectChanges();
    const progressBar = () => debugElement(fixture, '.progress-linear');
    expect(progressBar()).toBeFalsy();

    component.isLoading = true;
    fixture.detectChanges();
    expect(progressBar()).toBeTruthy();

    component.isLoading = false;
    fixture.detectChanges();
    expect(progressBar()).toBeFalsy();
  });

  it('click on an item element emits (open) event with correct parameters', done => {
    component.rows = [fakeItem(0)];
    fixture.detectChanges();
    const element = selectElement(fixture, '.item-description');

    component.open.subscribe(event => {
      expect(event).toEqual(fakeItem(0));
      done();
    });
    element.click();
  });
});
