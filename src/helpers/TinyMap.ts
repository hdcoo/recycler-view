import LinkedList, { IValue } from './LinkedList';

export default class TinyMap<T, U> extends LinkedList {
  constructor(values?: Array<[T, U]>) {
    super('tiny-map');

    if (Array.isArray(values)) {
      values.forEach((value) => {
        if (Array.isArray(value)) {
          this.set((value[0] as unknown as IValue), value[1]);
        }
      });
    }
  }

  public get(key: IValue): U | undefined {
    if (!this.has(key)) {
      return undefined;
    }

    return key[this.uuid].value;
  }

  public set(key: IValue, value: U): boolean {
    if (!TinyMap.isValid(key)) {
      return false;
    }

    if (this.has(key)) {
      key[this.uuid].value = value;
      return true;
    }

    key[this.uuid] = {
      prev: this.tail[this.uuid].prev,
      next: this.tail,
      value
    };
    this.tail[this.uuid].prev[this.uuid].next = key;
    this.tail[this.uuid].prev = key;
    this.listSize += 1;

    return true;
  }

  public map(handler: (key: IValue, value: U) => void): void {
    let key = this.head[this.uuid].next;

    while (key !== this.tail) {
      const next = key[this.uuid].next;
      const value = key[this.uuid].value;
      handler(key, value);
      key = next;
    }
  }
}
