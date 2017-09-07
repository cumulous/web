import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { debugElement } from '../../testing';

import { ProjectsModule } from './projects.module';
import { ProjectsComponent } from './projects.component';
import { ProjectListComponent } from './project-list.component';

import { ProjectsService } from '../api/api/projects.service';

describe('ProjectsComponent', () => {
  let fixture: ComponentFixture<ProjectsComponent>;
  let component: ProjectsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ProjectsModule, HttpModule ],
      providers: [ ProjectsService ],
    });

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;

    const projectsService = fixture.debugElement.injector.get(ProjectsService);
    spyOn(projectsService, 'listProjects')
      .and.returnValue(Observable.of({ items: [] }));

    fixture.detectChanges();
  });

  it('includes ProjectListComponent', () => {
    const projectList = debugElement(fixture, ProjectListComponent);
    expect(projectList).not.toBeNull();
  });
});
