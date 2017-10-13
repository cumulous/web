import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import 'rxjs/add/operator/filter';

import { Store } from './store';
import { storage } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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

  constructor(
    private readonly renderer: Renderer2,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  ngOnInit() {
    this.renderer.listen('window', 'storage', event => {
      this.store.dispatch(storage(event.key));
    });
  }
}
