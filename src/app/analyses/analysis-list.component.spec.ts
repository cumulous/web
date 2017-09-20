import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { elementsText, fakeUUIDs } from '../../testing';

import { pageSize } from '../shared/list/list-base.component.spec';

import { AnalysesModule } from './analyses.module';
import { AnalysisListComponent } from './analysis-list.component';

import { AnalysesService } from '../api/api/analyses.service';
import { Analysis } from '../api/model/analysis';
import { AnalysisStatus } from '../api/model/analysisStatus';

import { ProjectsCachingService } from '../caching/projects-caching.service';

describe('AnalysisListComponent', () => {
  let fixture: ComponentFixture<AnalysisListComponent>;
  let component: AnalysisListComponent;
  let spyOnListAnalyses: jasmine.Spy;

  const fakeAnalysisCount = 20;

  const analysis_ids = fakeUUIDs(fakeAnalysisCount);
  const project_ids = fakeUUIDs(fakeAnalysisCount);
  const created_bys = fakeUUIDs(fakeAnalysisCount);

  const now = new Date().getTime();

  const fakeAnalysis = (i: number): Analysis => ({
    id: analysis_ids[i],
    project_id: project_ids[i],
    created_by: created_bys[i],
    created_at: new Date(now - i * 1E9).toISOString(),
    description: 'Analysis ' + i,
    status: i % 2 ? AnalysisStatus.Submitted : AnalysisStatus.Running,
  });

  const fakeAnalyses = (offset: number, limit: number) =>
    Array.from({length: limit}, (d, i) => fakeAnalysis(offset + i));

  const componentRows = () => component.rows.map(row => {
    const { id, project_id, created_by, created_at, description, status } = row;
    return { id, project_id, created_by, created_at, description, status } as Analysis;
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
        AnalysesModule,
        HttpModule,
      ],
      providers: [
        AnalysesService,
        { provide: ProjectsCachingService, useClass: FakeProjectsCachingService },
      ],
    });

    fixture = TestBed.createComponent(AnalysisListComponent);
    component = fixture.componentInstance;

    const analysesService = fixture.debugElement.injector.get(AnalysesService);
    spyOnListAnalyses = spyOn(analysesService, 'listAnalyses')
      .and.callFake((projectId, descriptionContains, status, sort, offset, limit) => {
        return Observable.of({
          items: fakeAnalyses(offset, limit),
        });
      });

    fixture.detectChanges();
  });

  it('correctly displays column names', () => {
    const columnNames = elementsText(fixture, '.list-column');
    expect(columnNames).toEqual(['Date Created', 'Description', 'Project', 'Status']);
  });

  it('loads correct analyses', () => {
    const limit = Math.max(pageSize(fixture), component.pageLimit);
    expect(spyOnListAnalyses).toHaveBeenCalledWith(
      undefined, undefined, undefined, undefined, 0, limit);
    expect(componentRows()).toEqual(fakeAnalyses(0, limit));
  });
});
