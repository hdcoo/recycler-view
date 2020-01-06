export interface IValue<T> {
  [key: string]: IPoint<T>;
}

export interface IPoint<T> {
  prev?: T;
  next?: T;
  [key: string]: any;
}
