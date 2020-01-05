import { uuid } from './util';

export interface IValue {
  [key: string]: IPoint;
}

export interface IPoint {
  prev?: IValue;
  next?: IValue;
  [key: string]: any;
}

export default abstract class LinkedList {
  protected readonly uuid: string;
  protected listSize: number = 0;
  protected head: IValue = {};
  protected tail: IValue = {};

  public get size(): number {
    return this.listSize;
  }

  protected constructor(keyPrefix: string = 'linked-list') {
    this.uuid = `--${keyPrefix}-${uuid()}--`;

    this.head[this.uuid] = {};
    this.tail[this.uuid] = {};

    this.head[this.uuid].next = this.tail;
    this.tail[this.uuid].prev = this.head;
  }

  public has(value: any): boolean {
    return LinkedList.isValid(value) && !!value[this.uuid];
  }

  public delete(value: any): boolean {
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

  public abstract map(handler: (...args: any) => void): void;

  protected static isValid(value: any): boolean {
    return value && typeof value === 'object';
  }
}
