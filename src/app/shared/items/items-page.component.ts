import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './items-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsPageComponent<Item> {
  readonly type: string;

  constructor(route: ActivatedRoute) {
    this.type = route.snapshot.data.type;
  }

  onCreate() {
    // TODO
  }

  onOpen(item: Item) {
    // TODO
  }
}
