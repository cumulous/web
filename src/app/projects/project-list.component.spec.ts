import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { elementsText, fakeUUIDs } from '../../testing';

import { pageSize } from '../shared/list/list-base.component.spec';

import { ProjectsModule } from './projects.module';
import { ProjectListComponent } from './project-list.component';

import { ProjectsService } from '../api/api/projects.service';
import { Project } from '../api/model/project';
import { ProjectStatus } from '../api/model/projectStatus';

describe('ProjectListComponent', () => {
  let fixture: ComponentFixture<ProjectListComponent>;
  let component: ProjectListComponent;

  let spyOnListProjects: jasmine.Spy;

  const fakeProjectCount = 20;

  const project_ids = fakeUUIDs(fakeProjectCount);
  const created_bys = fakeUUIDs(fakeProjectCount);

  const now = new Date().getTime();

  const fakeProject = (i: number): Project => ({
    id: project_ids[i],
    name: 'Project ' + i,
    created_by: created_bys[i],
    created_at: new Date(now - i * 1E9).toISOString(),
    description: 'Project ' + i + ' description',
    status: i % 2 ? ProjectStatus.Active : ProjectStatus.Removed,
  });

  const fakeProjects = (offset: number, limit: number) =>
    Array.from({length: limit}, (d, i) => fakeProject(offset + i));

  const componentRows = () => component.rows.map(row => {
    const { id, name, created_by, created_at, description, status } = row;
    return { id, name, created_by, created_at, description, status } as Project;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ProjectsModule, HttpModule ],
      providers: [ ProjectsService ],
    });

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;

    const projectsService = fixture.debugElement.injector.get(ProjectsService);
    spyOnListProjects = spyOn(projectsService, 'listProjects').and.callFake(
        (nameContains, isMember, isHidden, status, descriptionContains, sort, offset, limit) => {
      return Observable.of({
        items: fakeProjects(offset, limit),
      });
    });

    fixture.detectChanges();
  });

  it('correctly displays column names', () => {
    const columnNames = elementsText(fixture, '.list-column');
    expect(columnNames).toEqual(['Name', 'Description', 'Date Created', 'Status']);
  });

  it('loads correct projects', () => {
    const limit = Math.max(pageSize(fixture), component.pageLimit);
    expect(spyOnListProjects).toHaveBeenCalledWith(
      undefined, undefined, undefined, undefined, undefined, undefined, 0, limit);
    expect(componentRows()).toEqual(fakeProjects(0, limit));
  });
});
