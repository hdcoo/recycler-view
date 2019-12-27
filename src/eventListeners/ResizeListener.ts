import Listener from './Listener';

export default class ResizeListener extends Listener {
  protected eventType: string = 'resize';

  constructor(target: Window = window) {
    super(target);
  }

  protected getScrollEventTarget(): Window | HTMLElement {
    return window;
  }
}
