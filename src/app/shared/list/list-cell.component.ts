import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-cell',
  templateUrl: './list-cell.component.html',
})
export class ListCellComponent<Item> {
  @Input() item: Item;
}
