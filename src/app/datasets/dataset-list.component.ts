import { Component, OnInit } from '@angular/core';

import { DatasetsService } from '../api/api/datasets.service';
import { Dataset } from '../api/model/dataset';
import { ListOfDatasets } from '../api/model/listOfDatasets';

@Component({
  templateUrl: './dataset-list.component.html',
})
export class DatasetListComponent implements OnInit {

  readonly pageSize = 30;

  private lastPage = -1;

  rows: Dataset[] = [];

  constructor(private datasetsService: DatasetsService) { }

  ngOnInit() {
    this.onPage(0);
  }

  onPage(pageIndex: number) {
    if (pageIndex === this.lastPage + 1) {
      this.lastPage++;
      this.loadPage(pageIndex);
    }
  }

  private loadPage(pageIndex: number) {
    this.datasetsService.listDatasets(
        undefined, undefined, undefined, undefined, pageIndex, this.pageSize)
      .subscribe((data: ListOfDatasets) => {
        this.rows = this.rows.concat(data.items);
      });
  }

  rowClass(row: Dataset) {
    return {
      'datasets-list-row': true,
    };
  }
}
