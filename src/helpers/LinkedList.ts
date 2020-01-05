import { uuid } from './util';
import { IValue } from '../interfaces/LinkedList';

export default abstract class LinkedList<T extends IValue<T>> {
  protected readonly uuid: string;
  protected listSize: number = 0;
  protected head: IValue<T> = {};
  protected tail: IValue<T> = {};

  public get size(): number {
    return this.listSize;
  }

  protected constructor(keyPrefix: string = 'linked-list') {
    this.uuid = `--${keyPrefix}-${uuid()}--`;

    this.head[this.uuid] = {};
    this.tail[this.uuid] = {};

    this.head[this.uuid].next = this.tail as T;
    this.tail[this.uuid].prev = this.head as T;
  }

  public has(value: T): boolean {
    return LinkedList.isValid(value) && !!value[this.uuid];
  }

  public delete(value: T): boolean {
    if (!this.has(value) || !LinkedList.isValid(value)) {
      return false;
    }

    const point = value[this.uuid];

    point.prev[this.uuid].next = point.next;
    point.next[this.uuid].prev = point.prev;

    this.listSize -= 1;
    delete value[this.uuid];

    return true;
  }

  public abstract forEach(handler: (...args: any) => void): void;

  protected static isValid<K>(value: K): boolean {
    return value && typeof value === 'object';
  }
}
