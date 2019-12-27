import Listener from './Listener';

export default class ScrollListener extends Listener {
  protected eventType: string = 'scroll';

  constructor(target: Window | HTMLElement) {
    super(target);
  }

  protected getScrollEventTarget(): Window | HTMLElement {
    return this.target;
  }
}
