import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ProjectsService } from '../api/api/projects.service';
import { ProjectsCachingService } from './projects-caching.service';

@Injectable()
class TestProjectsCachingService extends ProjectsCachingService {

  constructor(projectsService: ProjectsService) {
    super(projectsService);
  }

  initCache() {
    super.initCache();
  }

  listItems(offset?: number, limit?: number) {
    return super.listItems(offset, limit);
  }
}

describe('ProjectsCachingService', () => {
  let service: TestProjectsCachingService;
  let projectsService: ProjectsService;

  let spyOnInitCache: jasmine.Spy;
  let fakeListOfProjects: jasmine.Spy;

  beforeEach(() => {
    projectsService = jasmine.createSpyObj('ProjectsService', ['listProjects']);

    TestBed.configureTestingModule({
      providers: [
        TestProjectsCachingService,
        { provide: ProjectsService, useValue: projectsService },
      ],
    });

    spyOnInitCache = spyOn(TestProjectsCachingService.prototype, 'initCache');

    fakeListOfProjects = jasmine.createSpy('ListOfProjects');
    (projectsService.listProjects as jasmine.Spy)
      .and.returnValue(Observable.of(fakeListOfProjects));

    service = TestBed.get(TestProjectsCachingService);
  });

  it('calls initCache() once upon construction', () => {
    expect(spyOnInitCache).toHaveBeenCalledTimes(1);
  });

  describe('listItems()', () => {
    const offset = 1;
    const limit = 5;

    it('calls projectsService.listProjects() with correct parameters', () => {
      service.listItems(offset, limit);
      expect(projectsService.listProjects).toHaveBeenCalledWith(
        undefined, undefined, undefined, undefined, undefined, undefined,
        offset, limit,
      );
    });

    it('returns result from projectsService.listProjects()', done => {
      service.listItems(offset, limit).subscribe(listOfProjects => {
        expect(listOfProjects).toBe(fakeListOfProjects);
        done();
      });
    });
  });
});
