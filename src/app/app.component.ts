import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private readonly links = [{
    path: 'projects',
    label: 'Projects',
  }, {
    path: 'datasets',
    label: 'Datasets',
  }, {
    path: 'analyses',
    label: 'Analyses',
  }, {
    path: 'api',
    label: 'API',
  }];

  readonly linkActive$ = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .map((event: NavigationEnd) => {
      return this.links.map(link => link.path)
        .includes(event.urlAfterRedirects.substr(1));
    });

  constructor(private readonly router: Router) {}
}
