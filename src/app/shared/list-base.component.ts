import { ElementRef, TemplateRef, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';

export class ListColumn {
  readonly headerClass = 'list-column';

  constructor(
    readonly prop: string,
    readonly name?: string,
    readonly cellTemplate?: TemplateRef<any>) {}
}

export abstract class ListBaseComponent<Item> implements OnInit {

  @ViewChild('dateTemplate') protected readonly dateTemplate: TemplateRef<any>;

  readonly headerHeight: number = 50;
  readonly rowHeight: number = 50;
  readonly pageLimit: number = 10;

  readonly columns: ListColumn[] = [];
  readonly rows: Item[] = [];
  isLoading: boolean;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.onScroll(0);
  }

  onScroll(offsetY: number) {
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
    if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight) {
      let limit = this.pageLimit;
      if (this.rows.length === 0) {
        const pageSize = Math.ceil(viewHeight / this.rowHeight);
        limit = Math.max(pageSize, this.pageLimit);
      }
      this.loadPage(limit);
    }
  }

  protected abstract list(offset: number, limit: number): Observable<{ items: Item[] }>;

  private loadPage(limit: number) {
    this.isLoading = true;
    this.list(this.rows.length, limit).subscribe(data => {
      this.rows.push(...data.items);
      this.isLoading = false;
    });
  }

  rowClass() {
    return {
      'list-row': true,
    };
  }
}
