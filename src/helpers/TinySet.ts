import { uuid } from './util';

interface IValue {
  [key: string]: IPoint;
}

interface IPoint {
  prev?: IValue;
  next?: IValue;
}

/**
 * Implemented with linked list
 * This data structure only store Object and Array
 * */
export default class TinySet {
  private readonly uuid: string;
  private listSize: number = 0;
  private head: IValue = {};
  private tail: IValue = {};

  public get size(): number {
    return this.listSize;
  }

  constructor(values?: any[]) {
    this.uuid = `--tiny-set-${uuid()}--`;

    this.head[this.uuid] = {};
    this.tail[this.uuid] = {};

    this.head[this.uuid].next = this.tail;
    this.tail[this.uuid].prev = this.head;

    if (Array.isArray(values)) {
      values.forEach((value) => this.add(value));
    }
  }

  public has(value: any): boolean {
    return TinySet.isValid(value) && !!value[this.uuid];
  }

  public add(value: any): boolean {
    if (this.has(value) || !TinySet.isValid(value)) {
      return false;
    }

    value[this.uuid] = {
      prev: this.tail[this.uuid].prev,
      next: this.tail
    };
    this.tail[this.uuid].prev[this.uuid].next = value;
    this.tail[this.uuid].prev = value;
    this.listSize += 1;

    return true;
  }

  public delete(value: any): boolean {
    if (!this.has(value) || !TinySet.isValid(value)) {
      return false;
    }

    const point: IPoint = value[this.uuid];

    point.prev[this.uuid].next = point.next;
    point.next[this.uuid].prev = point.prev;

    this.listSize -= 1;

    return delete value[this.uuid];
  }

  public map(handler: (value: any) => void) {
    let value = this.head[this.uuid].next;

    while (value !== this.tail) {
      const next = value[this.uuid].next;
      handler(value);
      value = next;
    }
  }

  private static isValid(value: any): boolean {
    return value && typeof value === 'object';
  }
}
