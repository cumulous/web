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

  protected readonly headerHeight: number = 50;
  protected readonly rowHeight: number = 50;

  readonly pageLimit: number = 10;

  protected isLoading: boolean;
  protected readonly columns: ListColumn[] = [];

  readonly rows: Item[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.onScroll(0);
  }

  private onScroll(offsetY: number) {
    const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
    if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight) {
      this.loadPage();
    }
  }

  protected abstract list(offset: number, limit: number): Observable<{ items: Item[] }>;

  private loadPage() {
    this.isLoading = true;
    this.list(this.rows.length, this.pageLimit).subscribe(data => {
      this.rows.push(...data.items);
      this.isLoading = false;
    });
  }

  private rowClass() {
    return {
      'list-row': true,
    };
  }
}
