import { getRAFExecutor } from '../helpers/util';

const requestAnimationFrame = getRAFExecutor();

export default abstract class Listener {
  protected abstract eventType: string;
  private listened: boolean = false;
  private ticking: boolean = false;
  private handlers: Array<(e: Event) => void> = [];

  protected constructor(protected target: Window | HTMLElement) {
    this.handler = this.handler.bind(this);
  }

  public on(fn: (e: Event) => void) {
    this.handlers.push(fn);

    if (!this.listened) {
      this.bind(this.handler);
      this.listened = true;
    }
  }

  public off() {
    this.listened && this.unbind(this.handler);
  }

  public destroy() {
    this.off();
    this.handlers = [];
  }

  protected abstract getScrollEventTarget(): Window | HTMLElement;

  private handler(e: Event) {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        try {
          for (const handler of this.handlers) {
            handler(e);
          }
        } catch (e) {
          // keep silence
        } finally {
          this.ticking = false;
        }
      });

      this.ticking = true;
    }
  }

  private bind(fn: (e: Event) => void) {
    this.getScrollEventTarget().addEventListener(this.eventType, fn);
  }

  private unbind(fn: (e: Event) => void) {
    this.getScrollEventTarget().removeEventListener(this.eventType, fn);
  }
}
