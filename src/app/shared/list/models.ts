import { TemplateRef } from '@angular/core';

export class ListColumn {
  constructor(
    readonly prop: string,
    readonly name?: string,
    readonly cellTemplate?: TemplateRef<any>,
    readonly cellClass?: string,
    readonly headerClass = 'list-column',
  ) {}
}

export interface ListViewRequest {
  limit: number;
}
