export class Property {
  constructor(
    readonly name: string,
    readonly label: string = name.charAt(0).toUpperCase() + name.substring(1),
    readonly column: boolean = true,
    readonly type: 'string' | 'date' | 'project' = 'string',
  ) {}
}
