import LinkedList from './LinkedList';
import { IValue } from '../interfaces/LinkedList';

// Implemented with linked list
// This data structure only store Object and Array
export class TinyMap<T extends IValue<T>, U> extends LinkedList<T> {
  constructor(values?: Array<[T, U]> | null) {
    super('tiny-map');

    if (Array.isArray(values)) {
      values.forEach((value) => {
        if (Array.isArray(value)) {
          this.set(value[0], value[1]);
        }
      });
    }
  }

  public get(key: T): U | undefined {
    if (!this.has(key)) {
      return undefined;
    }

    return key[this.uuid].value;
  }

  public set(key: T, value: U): boolean {
    if (!TinyMap.isValid(key)) {
      return false;
    }

    if (this.has(key)) {
      key[this.uuid].value = value;
      return true;
    }

    (key as unknown as IValue<T>)[this.uuid] = {
      prev: this.tail[this.uuid].prev,
      next: this.tail as T,
      value
    };
    this.tail[this.uuid].prev[this.uuid].next = key;
    this.tail[this.uuid].prev = key;
    this.listSize += 1;

    return true;
  }

  public forEach(handler: (value: U, key: T) => void): void {
    let key = this.head[this.uuid].next;

    while (key !== this.tail) {
      const next = key[this.uuid].next;
      const value = key[this.uuid].value;
      handler(value, key);
      key = next;
    }
  }
}

export default function newMap<K, V>(values?: Array<[K, V]> | null) {
  return typeof Map === 'function' ? new Map(values) : new TinyMap(values as Array<[any, V]>);
}
