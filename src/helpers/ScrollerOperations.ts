import { isElementNode, Exceptions } from './util';

export default class ScrollerOperations {
  private readonly isWindow: boolean;
  private readonly window: Window = window;
  private readonly document: Document = document;

  constructor(private target: Window | HTMLElement) {
    if (target === this.window) {
      this.isWindow = true;
    } else if (isElementNode(target)) {
      this.isWindow = false;
    } else {
      throw Exceptions.TypeError('target must be window or an ElementNode');
    }
  }

  public isScrollerValid(): boolean {
    return this.isWindow || this.hasAncestor((this.target as HTMLElement), this.document.body);
  }

  public appendChild(el: HTMLElement) {
    if (this.isWindow) {
      return this.document.body.appendChild(el);
    }

    return (this.target as HTMLElement).appendChild(el);
  }

  public removeChild(el: HTMLElement) {
    try {
      if (this.isWindow) {
        return this.document.body.removeChild(el);
      }

      return (this.target as HTMLElement).removeChild(el);
    } catch (e) {
      // keep silence
    }
  }

  public scrollTo(position: number) {
    if (this.isWindow) {
      return this.window.scrollTo(0, position);
    }

    (this.target as HTMLElement).scrollTop = position;
  }

  public getOffsetHeight(): number {
    if (this.isWindow) {
      return this.document.body.offsetHeight;
    }

    return (this.target as HTMLElement).offsetHeight;
  }

  public getScrollTop(): number {
    if (this.isWindow) {
      return this.window.pageYOffset;
    }

    return (this.target as HTMLElement).scrollTop;
  }

  public getElement(): HTMLElement {
    if (this.isWindow) {
      return this.document.body;
    }

    return this.target as HTMLElement;
  }

  private hasAncestor(target: Node, refer: HTMLElement): boolean {
    if (target.parentNode && target.parentNode !== refer) {
      return this.hasAncestor(target.parentNode, refer);
    }

    return !!target.parentNode;
  }
}
