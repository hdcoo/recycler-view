export type Value<T> = {
  [P in keyof T]: T[P];
}

export interface IValue<T extends Value<T>> {
  [key: string]: IPoint<T>;
}

export interface IPoint<T> {
  prev?: T;
  next?: T;
  [key: string]: any;
}
