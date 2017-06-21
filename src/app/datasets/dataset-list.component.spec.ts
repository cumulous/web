import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import * as uuid from 'uuid';

import { elementsText } from '../../testing';

import { DatasetsModule } from './datasets.module';
import { DatasetListComponent } from './dataset-list.component';

import { DatasetsService } from '../api/api/datasets.service';
import { Dataset } from '../api/model/dataset';
import { DatasetStatus } from '../api/model/datasetStatus';

describe('DatasetListComponent', () => {
  let fixture: ComponentFixture<DatasetListComponent>;
  let component: DatasetListComponent;
  let spyOnListDatasets: jasmine.Spy;
  let textRows: string[];

  const fakeDatasetCount = 5;

  const uuids = () => Array.from({length: fakeDatasetCount}, (d, i) => uuid());

  const dataset_ids = uuids();
  const project_ids = uuids();
  const creator_ids = uuids();

  const fakeDataset = (i: number): Dataset => ({
    id: dataset_ids[i],
    project_id: dataset_ids[i],
    creator_id: project_ids[i],
    created_at: new Date((100 - i) * 1E10).toISOString(),
    description: 'Dataset ' + i,
    status: DatasetStatus.Created,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ DatasetsModule, HttpModule ],
      providers: [ DatasetsService ],
    });

    fixture = TestBed.createComponent(DatasetListComponent);
    component = fixture.componentInstance;

    const datasetsService = fixture.debugElement.injector.get(DatasetsService);
    spyOnListDatasets = spyOn(datasetsService, 'listDatasets')
      .and.returnValue(Observable.of({
        items: Array.from({length: fakeDatasetCount}, (d, i) => fakeDataset(i)),
      }));

    fixture.detectChanges();

    textRows = elementsText(fixture, '.datasets-list-row');
  });

  it('should render table with proper column names', () => {
    const columnNames = elementsText(fixture, '.datasets-list-column');
    expect(columnNames).toEqual(['Date Created', 'Description']);
  });

  it('should load the correct number of datasets', () => {
    expect(component.rows.length).toEqual(fakeDatasetCount);
  });

  it('should correctly display dataset descriptions', () => {
    textRows.map((row, i) =>
      expect(row).toContain(fakeDataset(i).description as string));
  });

  it('should correctly display dataset creation dates', () => {
    textRows.map((row, i) => {
      const createdAt = new Date(fakeDataset(i).created_at as string);
      const createdDate = createdAt.toLocaleDateString();
      const createdTime = createdAt.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
      expect(row).toContain(createdDate + ', ' + createdTime);
    });
  });
});
