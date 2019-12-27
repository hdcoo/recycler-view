import { IEvents } from '../interfaces/events';
import { logger } from './util';

export default class EventEmitter implements IEvents {
  protected events: {
    [key: string]: Array<(...args: any[]) => void>
  };

  constructor() {
    this.events = {};
  }

  public on(key: string, handler: (...args: any[]) => void) {
    if (this.events[key]) {
      this.events[key].push(handler);
    } else {
      this.events[key] = [handler];
    }
    return this;
  }

  public emit(key: string, ...args: any[]) {
    const handlers = this.events[key];

    if (!handlers) {
      return this;
    }

    for (const handler of handlers) {
      try {
        handler(...args);
      } catch (e) {
        logger.error(e.stack);
      }
    }

    return this;
  }

  public off(...keys: string[]) {
    if (!keys || keys.length === 0) {
      this.events = {};
      return this;
    }

    for (const key of keys) {
      delete this.events[key];
    }

    return this;
  }
}
