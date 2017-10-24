import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { debugComponent } from '../../../testing';

import { Project } from '../../api';

import * as storeModule from '../../store';
import { Property, Store } from '../../store';

import { ListComponent } from './list.component';
import { ListModule } from './list.module';
import { ListViewComponent } from './list-view.component';
import { ListColumn } from './models';

interface Item {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
}

interface SubjectsMap {
  [key: string]: BehaviorSubject<any>;
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

  const fakeProject = (i: number) => ({
    id: String(i),
    name: 'Fake project ' + i,
    created_at: new Date(now - i * 1E10).toISOString(),
    created_by: 'Fake project creator',
    status: 'Fake project status',
  });

  const fakeProjects = (count = 2) => {
    const projectsMap: { [id: string]: Project } = {};
    for (let i = 0; i < count; i++) {
      projectsMap[i] = fakeProject(i);
    }
    return projectsMap;
  };

  const fakeProperties = () => [
    new Property('id', 'ID', false),
    new Property('name'),
    new Property('project_id', 'Project'),
    new Property('created_at', 'Date Created'),
  ];

  let fixture: ComponentFixture<ListComponent<Item>>;
  let component: ListComponent<Item>;
  let view: ListViewComponent<Item>;
  let router: Router;
  let routerSpy: jasmine.SpyObj<Router>;
  let store: jasmine.SpyObj<Store>;

  let itemSubjects: SubjectsMap;
  let projectSubjects: SubjectsMap;
  let createSelectors: jasmine.Spy;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['list', 'select']);

    TestBed.configureTestingModule({
      imports: [
        ListModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Store, useValue: store },
      ],
    });

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    component.type = 'items';

    router = TestBed.get(Router);

    itemSubjects = {
      isLoading: new BehaviorSubject(true),
      propertyList: new BehaviorSubject(fakeProperties()),
      itemList: new BehaviorSubject(fakeItems()),
    };

    projectSubjects = {
      itemMap: new BehaviorSubject(fakeProjects()),
    };

    createSelectors = spyOn(storeModule, 'createSelectors').and.callFake(type => {
      switch (type) {
        case 'items': return itemSubjects;
        case 'projects': return projectSubjects;
      }
    });

    store.select.and.callFake(subject => subject);

    view = debugComponent(fixture, ListViewComponent);

    fixture.detectChanges();
  });

  it('selects isLoading state from the store and assigns it to listViewComponent.isLoading', () => {
    expect(view.isLoading).toEqual(true);
  });

  it('selects propertyList state from the store and transforms it into listViewComponent.columns', () => {
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

  it('selects itemList state from the store and assigns it to listViewComponent.rows', () => {
    const items = fakeItems();
    expect(view.rows.length).toBe(items.length);
    view.rows.forEach((row, i) => {
      expect(row).toEqual(jasmine.objectContaining(items[i]));
    });
  });

  it('selects project entitites from the store and assigns it to listViewComponent.projects', () => {
    expect(view.projects).toEqual(fakeProjects());
  });

  it('applies updates to listViewComponent.isLoading from the store', () => {
    itemSubjects.isLoading.next(false);
    fixture.detectChanges();
    expect(view.isLoading).toEqual(false);
  });

  it('applies updates to listViewComponent.columns from the store', () => {
    itemSubjects.propertyList.next(fakeProperties().slice(0, 2));
    fixture.detectChanges();
    expect(view.columns.length).toBe(1);
    expect(view.columns[0]).toEqual(jasmine.objectContaining({
      prop: 'name', name: 'Name',
    }));
  });

  it('applies updates to listViewComponent.rows from the store', () => {
    itemSubjects.itemList.next([fakeItem(2), fakeItem(3), fakeItem(4)]);
    fixture.detectChanges();
    expect(view.rows.length).toBe(3);
    view.rows.forEach((row, i) => {
      expect(row).toEqual(jasmine.objectContaining(fakeItem(i + 2)));
    });
  });

  it('applies updates to listViewComponent.projects from the store', () => {
    projectSubjects.itemMap.next(fakeProjects(3));
    fixture.detectChanges();
    expect(view.projects).toEqual(fakeProjects(3));
  });

  it('calls router.navigate once with correct parameters on (list) event from ListViewComponent', () => {
    const limit = 7;
    view.list.emit({
      limit,
    });
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith([{
      limit,
    }]);
  });

  it('sets router.navigated to "false" on (list) event from ListViewComponent', () => {
    router.navigated = true;
    view.list.emit({ limit: 1 });
    expect(router.navigated).toBe(false);
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
