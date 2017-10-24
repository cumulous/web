import { ChangeDetectionStrategy, Component, EventEmitter,
         Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Project } from '../../api';
import { createSelectors, Property, StoreItem, Store } from '../../store';

import { ListColumn, ListViewRequest } from './models';
import { ListViewComponent } from './list-view.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<Item extends StoreItem> implements OnInit {

  @ViewChild(ListViewComponent) private readonly view: ListViewComponent<Item>;

  @Input() type: string;
  @Output() readonly open = new EventEmitter<Item>();

  isLoading$: Observable<boolean>;
  rows$: Observable<Item[]>;
  projects$: Observable<{ [id: string]: Project }>;
  columns$: Observable<ListColumn[]>;

  constructor(
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    this.setupSelectors();
  }

  private setupSelectors() {
    const selectors = createSelectors<Item>(this.type);
    const projectsSelector = createSelectors<Project>('projects');

    this.isLoading$ = this.store.select(selectors.isLoading);
    this.projects$ = this.store.select(projectsSelector.itemMap);
    this.rows$ = this.store.select(selectors.itemList);
    this.columns$ = this.store.select(selectors.propertyList)
      .map(properties => properties
        .filter(property => property.column)
        .map(property => this.getColumn(property))
      );
  }

  onList(request: ListViewRequest) {
    this.router.navigated = false;
    this.router.navigate([request]);
  }

  private getColumn(property: Property) {
    return new ListColumn(
      property.name,
      property.label,
      this.getTemplate(property.name),
    );
  }

  private getTemplate(propName: string) {
    const templates = {
      created_at: this.view.dateTemplate,
      project_id: this.view.projectTemplate,
    };
    return templates[propName];
  }
}
