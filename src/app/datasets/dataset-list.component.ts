import { Component, ElementRef, OnInit } from '@angular/core';

import { DatasetsService } from '../api/api/datasets.service';
import { Dataset } from '../api/model/dataset';
import { ListOfDatasets } from '../api/model/listOfDatasets';

import { ListBaseComponent, ListColumn } from '../shared/list-base.component';

@Component({
  templateUrl: '../shared/list-base.component.html',
})
export class DatasetListComponent extends ListBaseComponent<Dataset> implements OnInit {

  constructor(private datasetsService: DatasetsService, element: ElementRef) {
    super(element);
  }

  ngOnInit() {
    this.columns.push(
      new ListColumn('created_at', 'Date Created', this.dateTemplate),
      new ListColumn('description'),
      new ListColumn('status'),
    );
    super.ngOnInit();
  }

  protected list(offset: number, limit: number) {
    return this.datasetsService.listDatasets(
      undefined, undefined, undefined, undefined, offset, limit);
  }
}
