import { ComponentFixture, TestBed } from '@angular/core/testing';

import { selectElement } from '../../testing';

import { DatasetListComponent } from './dataset-list.component';

describe('DatasetListComponent', () => {
  let fixture: ComponentFixture<DatasetListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetListComponent ],
    });

    fixture = TestBed.createComponent(DatasetListComponent);

    fixture.detectChanges();
  });

  it('should render table with #datasets-table id', () => {
    const table = selectElement(fixture, '#datasets-table');
    expect(table).toBeTruthy();
  });

  it('should render columns with .datasets-table-column-name class', () => {
    const table = selectElement(fixture, '.datasets-table-column-name');
    expect(table).toBeTruthy();
  });

  it('should render columns titles', () => {
    const table = selectElement(fixture, '.datasets-table-column-name');
    expect(table.name).toEqual(name); // ??
  });

});
