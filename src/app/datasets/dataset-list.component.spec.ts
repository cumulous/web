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
});