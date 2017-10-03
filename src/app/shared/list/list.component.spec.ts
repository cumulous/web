import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { debugElement } from '../../../testing';

import { ListComponent } from './list.component';
import { ListModule } from './list.module';
import { ListViewComponent } from './list-view.component';
import { ListColumn } from './models';

import * as store from '../../store';
import { Property, StoreService } from '../../store';

interface Item {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
}

describe('ListComponent', () => {
  const now = new Date().getTime();

  const fakeItem = (i: number) => ({
    id: 'fake-item-' + i,
    name: 'Fake item ' + i,
    project_id: 'fake-project-id-' + i,
    created_at: new Date(now - i * 1E9).toISOString(),
  });

  const fakeItems = () => [fakeItem(1), fakeItem(2)];

  const fakeProperties = () => [
    new Property('id', 'ID', false),
    new Property('name'),
    new Property('project_id', 'Project'),
    new Property('created_at', 'Date Created'),
  ];

  let fixture: ComponentFixture<ListComponent<Item>>;
  let component: ListComponent<Item>;
  let view: ListViewComponent<Item>;
  let storeService: jasmine.SpyObj<StoreService>;

  let subjects: { [key: string]: BehaviorSubject<any> };
  let createSelectors: jasmine.Spy;

  beforeEach(() => {
    storeService = jasmine.createSpyObj('StoreService', ['list', 'select']);

    TestBed.configureTestingModule({
      imports: [
        ListModule,
      ],
      providers: [
        { provide: StoreService, useValue: storeService },
      ],
    });

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    component.type = 'items';

    subjects = {
      isLoading: new BehaviorSubject(true),
      propertyList: new BehaviorSubject(fakeProperties()),
      itemList: new BehaviorSubject(fakeItems()),
    };
    createSelectors = spyOn(store, 'createSelectors').and.returnValue(subjects);
    storeService.select.and.callFake(subject => subject);

    view = debugElement(fixture, ListViewComponent).componentInstance;

    fixture.detectChanges();
  });

  it('calls createSelectors() once with correct parameters', () => {
    expect(createSelectors).toHaveBeenCalledTimes(1);
    expect(createSelectors).toHaveBeenCalledWith('items');
  });

  it('selects isLoading state from storeService and assigns it to listViewComponent.isLoading', () => {
    expect(view.isLoading).toEqual(true);
  });

  it('selects propertyList state from storeService and transforms it into listViewComponent.columns', () => {
    expect(view.columns.length).toBe(3);
    expect(view.columns[0]).toEqual(jasmine.objectContaining({
      prop: 'name', name: 'Name',
    }));
    expect(view.columns[1]).toEqual(jasmine.objectContaining({
      prop: 'project_id', name: 'Project', cellTemplate: view.projectTemplate,
    }));
    expect(view.columns[2]).toEqual(jasmine.objectContaining({
      prop: 'created_at', name: 'Date Created', cellTemplate: view.dateTemplate,
    }));
  });

  it('selects itemList state from storeService and assigns it to listViewComponent.rows', () => {
    const items = fakeItems();
    expect(view.rows.length).toBe(items.length);
    view.rows.forEach((row, i) => {
      expect(row).toEqual(jasmine.objectContaining(items[i]));
    });
  });

  it('applies updates to listViewComponent.isLoading from storeService', () => {
    subjects.isLoading.next(false);
    fixture.detectChanges();
    expect(view.isLoading).toEqual(false);
  });

  it('applies updates to listViewComponent.columns from storeService', () => {
    subjects.propertyList.next(fakeProperties().slice(0, 2));
    fixture.detectChanges();
    expect(view.columns.length).toBe(1);
    expect(view.columns[0]).toEqual(jasmine.objectContaining({
      prop: 'name', name: 'Name',
    }));
  });

  it('applies updates to listViewComponent.rows from storeService', () => {
    subjects.itemList.next([fakeItem(2), fakeItem(3), fakeItem(4)]);
    fixture.detectChanges();
    expect(view.rows.length).toBe(3);
    view.rows.forEach((row, i) => {
      expect(row).toEqual(jasmine.objectContaining(fakeItem(i + 2)));
    });
  });

  it('calls storeService.list() once with correct parameters on (list) event from ListViewComponent', () => {
    const limit = 7;
    view.list.emit({
      limit,
    });
    expect(storeService.list).toHaveBeenCalledTimes(1);
    expect(storeService.list).toHaveBeenCalledWith('items', {
      limit,
    });
  });

  it('re-emits (open) event from ListViewComponent', done => {
    const fakeEvent = () => fakeItem(2);
    component.open.subscribe(event => {
      expect(event).toEqual(fakeEvent());
      done();
    });
    view.open.emit(fakeEvent());
  });
});
