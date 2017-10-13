import { Injectable } from '@angular/core';
import { Store as NgRxStore } from '@ngrx/store';

import { State } from './state';

@Injectable()
export class Store extends NgRxStore<State> {};

export class Property {
  constructor(
    readonly name: string,
    readonly label: string = name.charAt(0).toUpperCase() + name.substring(1),
    readonly column: boolean = true,
  ) {}
}

export interface StoreItem {
  id: any;
}
