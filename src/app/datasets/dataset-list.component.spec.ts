import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { elementsText, fakeUUIDs } from '../../testing';

import { pageSize } from '../shared/list/list-base.component.spec';

import { DatasetsModule } from './datasets.module';
import { DatasetListComponent } from './dataset-list.component';

import { DatasetsService } from '../api/api/datasets.service';
import { Dataset } from '../api/model/dataset';
import { DatasetStatus } from '../api/model/datasetStatus';

import { ProjectsCachingService } from '../caching/projects-caching.service';

describe('DatasetListComponent', () => {
  let fixture: ComponentFixture<DatasetListComponent>;
  let component: DatasetListComponent;
  let spyOnListDatasets: jasmine.Spy;

  const fakeDatasetCount = 20;

  const dataset_ids = fakeUUIDs(fakeDatasetCount);
  const project_ids = fakeUUIDs(fakeDatasetCount);
  const created_bys = fakeUUIDs(fakeDatasetCount);

  const now = new Date().getTime();

  const fakeDataset = (i: number): Dataset => ({
    id: dataset_ids[i],
    project_id: project_ids[i],
    created_by: created_bys[i],
    created_at: new Date(now - i * 1E9).toISOString(),
    description: 'Dataset ' + i,
    status: i % 2 ? DatasetStatus.Created : DatasetStatus.Available,
  });

  const fakeDatasets = (offset: number, limit: number) =>
    Array.from({length: limit}, (d, i) => fakeDataset(offset + i));

  const componentRows = () => component.rows.map(row => {
    const { id, project_id, created_by, created_at, description, status } = row;
    return { id, project_id, created_by, created_at, description, status } as Dataset;
  });

  const fakeProject = (i: number) => ({
    name: 'Project ' + i,
  });

  @Injectable()
  class FakeProjectsCachingService {
    get(id: string) {
      return Observable.of(fakeProject(project_ids.indexOf(id)));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DatasetsModule,
        HttpModule,
      ],
      providers: [
        DatasetsService,
        { provide: ProjectsCachingService, useClass: FakeProjectsCachingService },
      ],
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
    expect(columnNames).toEqual(['Date Created', 'Description', 'Project', 'Status']);
  });

  it('loads correct datasets', () => {
    const limit = Math.max(pageSize(fixture), component.pageLimit);
    expect(spyOnListDatasets).toHaveBeenCalledWith(
      undefined, undefined, undefined, undefined, 0, limit);
    expect(componentRows()).toEqual(fakeDatasets(0, limit));
  });
});
