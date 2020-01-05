import LinkedList from './LinkedList';

// Implemented with linked list
// This data structure only store Object and Array
export default class TinySet extends LinkedList {
  constructor(values?: any[]) {
    super('tiny-set');

    if (Array.isArray(values)) {
      values.forEach((value) => this.add(value));
    }
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

  public map(handler: (value: any) => void) {
    let value = this.head[this.uuid].next;

    while (value !== this.tail) {
      const next = value[this.uuid].next;
      handler(value);
      value = next;
    }
  }
}
