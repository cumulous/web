import { Component, OnInit } from '@angular/core';

import { DatasetsService } from '../api/api/datasets.service';
import { Dataset } from '../api/model/dataset';
import { ListOfDatasets } from '../api/model/listOfDatasets';

@Component({
  templateUrl: './dataset-list.component.html',
})
export class DatasetListComponent implements OnInit {

  rows: Dataset[];

  constructor(private datasetsService: DatasetsService) { }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.datasetsService.listDatasets().subscribe((data: ListOfDatasets) => {
      this.rows = data.items;
    });
  }

  rowClass(row: Dataset) {
    return {
      'datasets-list-row': true,
    };
  }
}
