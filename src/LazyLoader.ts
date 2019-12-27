import {getAnimationEndEventName, loadImage, throttle} from './helpers/util';
import {IRecycler, RecyclerEvents} from './interfaces/recycler';
import {IBinding, IElementInfo, IHTMLElement, ImageTypes, ILazyLoaderOptions, IPlaceholders} from './interfaces/lazyload';

const ANIMATION_END = getAnimationEndEventName();

export default class LazyLoader {
  public static DEFAULT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  private readonly elementsInfo: Map<IHTMLElement, IElementInfo> = new Map();
  private readonly speedThreshold: number;
  private readonly placeholders: IPlaceholders;

  constructor(options: ILazyLoaderOptions = {}) {
    this.speedThreshold = options.speedThreshold || 100;
    this.placeholders = {
      loading: options.loading || LazyLoader.DEFAULT_PLACEHOLDER,
      error: options.error || LazyLoader.DEFAULT_PLACEHOLDER
    };
  }

  public  mount(recycler: IRecycler<any>) {
    recycler.on(RecyclerEvents.Scrolling, throttle((r: IRecycler<any>, speed: number) => {
      if (Math.abs(speed) < this.speedThreshold) {
        setTimeout(() => this.flush());
      }
    }));

    recycler.on(RecyclerEvents.ScrollAtStart, () => setTimeout(() => this.flush()));
    recycler.on(RecyclerEvents.ScrollAtEnd, () => setTimeout(() => this.flush()));
  }

  public update(el: IHTMLElement, binding: IBinding) {
    const elementInfo = this.getElementInfo(el);

    if (!el.__recycler_lazy_loading__) {
      el.setAttribute('lazy', 'loading');
      el.__recycler_lazy_loading__ = true;

      LazyLoader.setSrc(el, {
        value: this.placeholders.loading,
        type: binding.type
      });
    }

    if (!/^https?:\/\//.test(binding.value)) {
      return el.setAttribute('lazy', 'error');
    }

    LazyLoader.attemptCancel(elementInfo);
    elementInfo.binding = binding;

    elementInfo.render = function() {
      if (
        el.dataset.src === this.binding.value &&
        !el.__recycler_lazy_loading__
      ) {
        return;
      }

      const cache = this.binding;

      LazyLoader.attemptCancel(this);
      this.loader = loadImage(this.binding.value);
      this.render = null;

      this.loader.then(() => {
        if (cache.value === this.binding.value) {
          el.removeEventListener(ANIMATION_END, el.__recycler_lazy_animationend__);
          el.__recycler_lazy_animationend__ = () => {
            el.setAttribute('lazy', 'complete');
          };
          el.addEventListener(ANIMATION_END, el.__recycler_lazy_animationend__);
          el.setAttribute('lazy', 'loaded');
          LazyLoader.setSrc(el, this.binding);
        }
      }).catch((err) => {
        if (err !== 'canceled') {
          el.setAttribute('lazy', 'error');
        }
      }).finally(() => {
        el.__recycler_lazy_loading__ = false;
      });
    };
  }

  protected flush() {
    for (const elementInfo of this.elementsInfo.values()) {
      if (elementInfo.render) {
        elementInfo.render();
      }
    }
  }

  private getElementInfo(el: IHTMLElement) {
    let elementInfo = this.elementsInfo.get(el);

    if (!elementInfo) {
      elementInfo = {
        loader: null
      };
      this.elementsInfo.set(el, elementInfo);
    }

    return elementInfo;
  }

  private static setSrc(el: IHTMLElement, binding: IBinding) {
    if (binding.type === ImageTypes.background) {
      el.style.backgroundImage = `url(${binding.value})`;
    } else {
      el.src = binding.value;
    }

    el.dataset.src = binding.value;
  }

  private static attemptCancel(elementInfo: IElementInfo) {
    elementInfo.loader && elementInfo.loader.cancel && elementInfo.loader.cancel();
    elementInfo.loader = null;
  }
}
