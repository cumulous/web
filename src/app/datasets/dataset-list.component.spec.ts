import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { elementsText, fakeUUIDs } from '../../testing';

import { pageSize } from '../shared/list-base.component.spec';

import { DatasetsModule } from './datasets.module';
import { DatasetListComponent } from './dataset-list.component';

import { DatasetsService } from '../api/api/datasets.service';
import { Dataset } from '../api/model/dataset';
import { DatasetStatus } from '../api/model/datasetStatus';

describe('DatasetListComponent', () => {
  let fixture: ComponentFixture<DatasetListComponent>;
  let component: DatasetListComponent;
  let spyOnListDatasets: jasmine.Spy;

  const fakeDatasetCount = 20;

  const dataset_ids = fakeUUIDs(fakeDatasetCount);
  const project_ids = fakeUUIDs(fakeDatasetCount);
  const creator_ids = fakeUUIDs(fakeDatasetCount);

  const now = new Date().getTime();

  const fakeDataset = (i: number): Dataset => ({
    id: dataset_ids[i],
    project_id: project_ids[i],
    creator_id: creator_ids[i],
    created_at: new Date(now - i * 1E9).toISOString(),
    description: 'Dataset ' + i,
    status: i % 2 ? DatasetStatus.Created : DatasetStatus.Available,
  });

  const fakeDatasets = (offset: number, limit: number) =>
    Array.from({length: limit}, (d, i) => fakeDataset(offset + i));

  const componentRows = () => component.rows.map(row => {
    const { id, project_id, creator_id, created_at, description, status } = row;
    return { id, project_id, creator_id, created_at, description, status } as Dataset;
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
      .and.callFake((projectId, descriptionContains, status, sort, offset, limit) => {
        return Observable.of({
          items: fakeDatasets(offset, limit),
        });
      });

    fixture.detectChanges();
  });

  it('correctly displays column names', () => {
    const columnNames = elementsText(fixture, '.list-column');
    expect(columnNames).toEqual(['Date Created', 'Description', 'Status']);
  });

  it('loads correct datasets', () => {
    const limit = Math.max(pageSize(fixture), component.pageLimit);
    expect(spyOnListDatasets).toHaveBeenCalledWith(
      undefined, undefined, undefined, undefined, 0, limit);
    expect(componentRows()).toEqual(fakeDatasets(0, limit));
  });
});
