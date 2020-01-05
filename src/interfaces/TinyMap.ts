export interface ITinyMap<T, U> {
  readonly size: number;
  set(key: T, value: U): boolean;
  get(key: T): U;
  has(key: T): boolean;
  delete(key: T): boolean;
  forEach(handler: (value: U, key: T) => void): void;
}

export interface ITinyMapConstructor {
  readonly prototype: ITinyMap<any, any>;
  new<T, U>(values?: Array<[T, U]> | null): ITinyMap<T, U>;
}
