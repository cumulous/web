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
