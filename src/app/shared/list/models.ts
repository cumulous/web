import { TemplateRef } from '@angular/core';

export class ListColumn {
  readonly headerClass = 'list-column';

  constructor(
    readonly prop: string,
    readonly name?: string,
    readonly cellTemplate?: TemplateRef<any>,
    readonly cellClass?: string,
  ) {}
}

export interface ListViewRequest {
  limit: number;
}
