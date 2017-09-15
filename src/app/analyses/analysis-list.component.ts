import { Component, ElementRef, OnInit } from '@angular/core';

import { AnalysesService } from '../api/api/analyses.service';
import { Analysis } from '../api/model/analysis';
import { ListOfAnalyses } from '../api/model/listOfAnalyses';

import { ListBaseComponent, ListColumn } from '../shared/list/list-base.component';

@Component({
  templateUrl: '../shared/list/list-base.component.html',
})
export class AnalysisListComponent extends ListBaseComponent<Analysis> implements OnInit {

  constructor(private analysesService: AnalysesService, element: ElementRef) {
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
    return this.analysesService.listAnalyses(
      undefined, undefined, undefined, undefined, offset, limit);
  }
}
