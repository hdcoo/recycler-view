import LinkedList from './LinkedList';
import { IValue } from '../interfaces/LinkedList';

// Implemented with linked list
// This data structure only store Object and Array
export class TinySet<T extends object> extends LinkedList<T> {
  constructor(values?: T[]) {
    super('tiny-set');

    if (Array.isArray(values)) {
      values.forEach((value) => this.add(value));
    }
  }

  public add(value: T): boolean {
    if (this.has(value) || !TinySet.isValid(value)) {
      return false;
    }

    (value as IValue<T>)[this.uuid] = {
      prev: this.tail[this.uuid].prev,
      next: this.tail as T
    };
    (this.tail[this.uuid].prev as IValue<T>)[this.uuid].next = value;
    this.tail[this.uuid].prev = value;
    this.listSize += 1;

    return true;
  }

  public forEach(handler: (value: T) => void) {
    let value = this.head[this.uuid].next;

    while (value !== this.tail as T) {
      const next = (value as IValue<T>)[this.uuid].next;
      handler(value);
      value = next;
    }
  }
}

export default function newSet<T extends object>(values?: T[]) {
  return typeof Set === 'function' ? new Set(values) : new TinySet(values);
}
