import { ComponentFixture, TestBed } from '@angular/core/testing';

import { selectElement } from '../../../testing';

import { ToolbarModule } from './toolbar.module';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let toolbar: HTMLElement;
  let buttonCreate: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToolbarModule,
      ],
    });

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    toolbar = selectElement(fixture, '#toolbar');
    buttonCreate = toolbar.querySelector('#create') as HTMLElement;
  });

  it('displays toolbar', () => {
    expect(toolbar).toBeTruthy();
  });

  it('displays "Create" button inside the toolbar', () => {
    expect(buttonCreate instanceof HTMLButtonElement).toBe(true);
    expect(buttonCreate.textContent.trim()).toBe('Create');
  });

  it('emits empty (create) event if "Create" button is clicked', done => {
    component.create.subscribe(value => {
      expect(value).toBeUndefined();
      done();
    });
    buttonCreate.click();
  });
});
