export interface ITinySet<T> {
  readonly size: number;
  add(value: T): boolean;
  has(value: T): boolean;
  delete(value: T): boolean;
  map(handler: (value: T) => void): void;
}

export interface ITinySetConstructor {
  readonly prototype: ITinySet<any>;
  new<T>(values?: T[]): ITinySet<T>;
}
