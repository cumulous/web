import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { debugComponent } from '../../../testing';

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

  const fakeUser = (i: number) => ({
    id: 'fake-user-id-' + i,
    name: 'Fake user name ' + i,
    email: 'fake-user-' + i + '@example.org',
  });

  const fakeClient = (i: number) => ({
    id: 'fake-client-id-' + i,
    name: 'Fake client name ' + i,
    email: 'fake-client-' + i + '@example.org',
  });

  function createMap<T>(createItem: (i: number) => T, count = 2) {
    const map: { [id: string]: T } = {};
    for (let i = 0; i < count; i++) {
      map[i] = createItem(i);
    }
    return map;
  };

  const fakeProjects = (count?: number) => createMap(fakeProject, count);
  const fakeUsers = (count?: number) => createMap(fakeUser, count);
  const fakeClients = (count?: number) => createMap(fakeClient, count);

  const fakeProperties = () => [
    new Property('id', 'ID', false),
    new Property('name'),
    new Property('project_id', 'Project'),
    new Property('created_at', 'Date Created'),
    new Property('created_by', 'Created By'),
  ];

  let fixture: ComponentFixture<ListComponent<Item>>;
  let component: ListComponent<Item>;
  let view: ListViewComponent<Item>;
  let router: Router;
  let routerSpy: jasmine.SpyObj<Router>;
  let store: jasmine.SpyObj<Store>;

  let itemSubjects: SubjectsMap;
  let projectSubjects: SubjectsMap;
  let userSubjects: SubjectsMap;
  let clientSubjects: SubjectsMap;
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

    userSubjects = {
      itemMap: new BehaviorSubject(fakeUsers()),
    };

    clientSubjects = {
      itemMap: new BehaviorSubject(fakeClients()),
    };

    createSelectors = spyOn(storeModule, 'createSelectors').and.callFake(type => {
      switch (type) {
        case 'items': return itemSubjects;
        case 'projects': return projectSubjects;
        case 'users': return userSubjects;
        case 'clients': return clientSubjects;
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
    expect(view.columns.length).toBe(4);
    expect(view.columns[0]).toEqual(jasmine.objectContaining({
      prop: 'name', name: 'Name',
    }));
    expect(view.columns[1]).toEqual(jasmine.objectContaining({
      prop: 'project_id', name: 'Project', cellTemplate: view.projectTemplate,
    }));
    expect(view.columns[2]).toEqual(jasmine.objectContaining({
      prop: 'created_at', name: 'Date Created', cellTemplate: view.dateTemplate,
    }));
    expect(view.columns[3]).toEqual(jasmine.objectContaining({
      prop: 'created_by', name: 'Created By', cellTemplate: view.memberTemplate,
    }));
  });

  it('selects itemList state from the store and assigns it to listViewComponent.rows', () => {
    const items = fakeItems();
    expect(view.rows.length).toBe(items.length);
    view.rows.forEach((row, i) => {
      expect(row).toEqual(jasmine.objectContaining(items[i]));
    });
  });

  describe('selects corresponding entities from the store and assigns them to listViewComponent', () => {
    let itemsType: string;
    let createItems: <T>() => { [id: string]: T };

    it('projects', () => {
      itemsType = 'projects';
      createItems = fakeProjects;
    });

    it('users', () => {
      itemsType = 'users';
      createItems = fakeUsers;
    });

    it('clients', () => {
      itemsType = 'clients';
      createItems = fakeClients;
    });

    afterEach(() => {
      expect(view[itemsType]).toEqual(createItems());
    });
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

  describe('applies updates from the store to listViewComponent', () => {
    let itemsType: string;
    let createItems: <T>(count: number) => { [id: string]: T };
    let subjects: SubjectsMap;

    it('projects', () => {
      itemsType = 'projects';
      createItems = fakeProjects;
      subjects = projectSubjects;
    });

    it('users', () => {
      itemsType = 'users';
      createItems = fakeUsers;
      subjects = userSubjects;
    });

    it('clients', () => {
      itemsType = 'clients';
      createItems = fakeClients;
      subjects = clientSubjects;
    });

    afterEach(() => {
      subjects.itemMap.next(createItems(4));
      fixture.detectChanges();
      expect(view[itemsType]).toEqual(createItems(4));
    });
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
