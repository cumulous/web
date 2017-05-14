import { ComponentFixture, TestBed } from '@angular/core/testing';

import { selectElements } from '../../testing';

import { DatasetsModule } from './datasets.module';
import { DatasetListComponent } from './dataset-list.component';

describe('DatasetListComponent', () => {
  let fixture: ComponentFixture<DatasetListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ DatasetsModule ],
    });

    fixture = TestBed.createComponent(DatasetListComponent);

    fixture.detectChanges();
  });

  it('should render table with proper column names', () => {
    const columnNames = selectElements(fixture, '.datasets-list-column')
      .map(element => element.textContent.trim());
    expect(columnNames).toEqual(['Date Created', 'Description']);
  });
});
