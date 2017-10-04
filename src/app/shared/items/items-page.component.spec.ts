import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { debugComponent } from '../../../testing';

import { ListComponent } from '../list/list.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { ItemsPageComponent } from './items-page.component';


interface Item {
  id: string;
  name: string;
}

@Component({
  selector: 'app-toolbar',
  template: '',
})
class MockToolbarComponent extends ToolbarComponent {}

@Component({
  selector: 'app-list',
  template: '',
})
class MockListComponent extends ListComponent<Item> implements OnInit {
  ngOnInit() {}
}

describe('ItemsPageComponent', () => {
  const fakeType = 'items';

  const fakeItem = () => ({
    id: 'fake-id',
    name: 'Fake name',
  });

  let fixture: ComponentFixture<ItemsPageComponent<Item>>;
  let component: ItemsPageComponent<Item>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let toolbar: ToolbarComponent;
  let list: ListComponent<Item>;

  beforeEach(() => {
    route = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    route.snapshot.data = {
      type: fakeType,
    };

    TestBed.configureTestingModule({
      declarations: [
        ItemsPageComponent,
        MockListComponent,
        MockToolbarComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    fixture = TestBed.createComponent(ItemsPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    toolbar = debugComponent(fixture, MockToolbarComponent);
    list = debugComponent(fixture, MockListComponent);
  });

  it('hosts ToolbarComponent', () => {
    expect(toolbar instanceof ToolbarComponent).toBeTruthy();
  });

  it('calls onCreate() once when ToolbarComponent emits (create)', () => {
    const spyOnCreate = spyOn(component, 'onCreate').and.callThrough();
    expect(spyOnCreate).toHaveBeenCalledTimes(0);

    toolbar.create.emit();

    expect(spyOnCreate).toHaveBeenCalledTimes(1);
    expect(spyOnCreate).toHaveBeenCalledWith();
  });

  it('hosts ListComponent', () => {
    expect(list instanceof ListComponent).toBeTruthy();
  });

  it('passes correct type to ListComponent', () => {
    expect(list.type).toBe(fakeType);
  });

  it('calls onOpen() once with correct parameters when ListComponent emits (open)', () => {
    const spyOnOpen = spyOn(component, 'onOpen').and.callThrough();
    expect(spyOnOpen).toHaveBeenCalledTimes(0);

    list.open.emit(fakeItem());

    expect(spyOnOpen).toHaveBeenCalledTimes(1);
    expect(spyOnOpen).toHaveBeenCalledWith(fakeItem());
  });
});
