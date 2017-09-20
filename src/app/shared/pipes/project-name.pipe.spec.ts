import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import * as uuid from 'uuid';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ProjectNamePipe } from './project-name.pipe';

import { ProjectsCachingService } from '../../caching/projects-caching.service';

const fakeProjectId = uuid();
const fakeProjectName = 'Fake project';

const fakeProject = () => ({
  id: fakeProjectId,
  name: fakeProjectName,
});

@Component({
  template: `{{ projectId | projectName | async }}`,
})
class TestProjectNameComponent {
  readonly projectId = fakeProjectId;
}

describe('ProjectNamePipe', () => {
  let projectsCachingService: ProjectsCachingService;

  beforeEach(() => {
    projectsCachingService = jasmine.createSpyObj('ProjectsCachingService', ['get']);

    TestBed.configureTestingModule({
      declarations: [
        ProjectNamePipe,
        TestProjectNameComponent,
      ],
      providers: [
        ProjectNamePipe,
        { provide: ProjectsCachingService, useValue: projectsCachingService },
      ],
    });

    (projectsCachingService.get as jasmine.Spy)
      .and.returnValue(Observable.of(fakeProject()));
  });

  describe('transform()', () => {
    let pipe: ProjectNamePipe;

    beforeEach(() => {
      pipe = TestBed.get(ProjectNamePipe);
    });

    it('calls projectsCachingService.get() once with correct parameters', () => {
      pipe.transform(fakeProjectId);
      expect(projectsCachingService.get).toHaveBeenCalledTimes(1);
      expect(projectsCachingService.get).toHaveBeenCalledWith(fakeProjectId);
    });

    it('returns project name if defined', done => {
      pipe.transform(fakeProjectId).subscribe(name => {
        expect(name).toBe(fakeProjectName);
        done();
      });
    });

    it('returns project id if project name is undefined', done => {
      (projectsCachingService.get as jasmine.Spy)
        .and.returnValue(Observable.of({
          id: fakeProjectId,
        }));
      pipe.transform(fakeProjectId).subscribe(name => {
        expect(name).toBe(fakeProjectId);
        done();
      });
    });
  });

  it('displays correct project name when used in a component', () => {
    const fixture = TestBed.createComponent(TestProjectNameComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.textContent.trim()).toBe(fakeProjectName);
  });
});
