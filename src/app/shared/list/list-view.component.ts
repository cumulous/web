import { Component, ElementRef, EventEmitter, Input,
         OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { Project } from '../../api';
import { ListColumn, ListViewRequest } from './models';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
})
export class ListViewComponent<Item> implements OnInit {

  @ViewChild('table', { read: ElementRef }) private readonly table: ElementRef;
  @ViewChild('dateTemplate') readonly dateTemplate: TemplateRef<any>;
  @ViewChild('projectTemplate') readonly projectTemplate: TemplateRef<any>;

  @Input() columns: ListColumn[] = [];
  @Input() rows: Item[] = [];
  @Input() projects: { [id: string]: Project } = {};
  @Input() isLoading = false;

  @Input() headerHeight = 42;
  @Input() rowHeight = 45;
  @Input() pageLimit = 10;

  @Output() readonly list = new EventEmitter<ListViewRequest>();
  @Output() readonly open = new EventEmitter<Item>();

  ngOnInit() {
    this.onScroll(0);
  }

  onScroll(offsetY: number) {
    const viewHeight = this.table.nativeElement.getBoundingClientRect().height - this.headerHeight;
    if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight) {
      let limit = this.pageLimit;
      if (this.rows.length === 0) {
        const pageSize = Math.ceil(viewHeight / this.rowHeight);
        limit = Math.max(pageSize, this.pageLimit);
      }
      this.list.emit({
        limit: this.rows.length + limit,
      });
    }
  }

  rowClass() {
    return {
      'list-row': true,
    };
  }
}
