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
      const url = event.urlAfterRedirects.substr(1);
      return this.links.map(link => link.path)
        .some(path => url.startsWith(path));
    });

  constructor(private readonly router: Router) {}
}
