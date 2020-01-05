import TinyMap from './helpers/TinyMap';
import {getAnimationEndEventName, loadImage, throttle, isFunction} from './helpers/util';
import {IRecycler, RecyclerEvents} from './interfaces/recycler';
import {IBinding, IElementInfo, IHTMLElement, ImageTypes, ILazyLoaderOptions, IPlaceholders} from './interfaces/lazyload';

const ANIMATION_END = getAnimationEndEventName();

export default class LazyLoader {
  public static DEFAULT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  private readonly elementsInfo: TinyMap<IHTMLElement, IElementInfo> = new TinyMap();
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
      this.render = null;
      this.cancel = loadImage(
        this.binding.value,
        () => {
          el.__recycler_lazy_loading__ = false;

          if (cache.value === this.binding.value) {
            el.removeEventListener(ANIMATION_END, el.__recycler_lazy_animationend__);
            el.__recycler_lazy_animationend__ = () => {
              el.setAttribute('lazy', 'complete');
            };
            el.addEventListener(ANIMATION_END, el.__recycler_lazy_animationend__);
            el.setAttribute('lazy', 'loaded');
            LazyLoader.setSrc(el, this.binding);
          }
        },
        () => {
          el.__recycler_lazy_loading__ = false;
          el.setAttribute('lazy', 'error');
        }
      );
    };
  }

  protected flush() {
    this.elementsInfo.map((key, elementInfo) => {
      if (elementInfo.render) {
        elementInfo.render();
      }
    });
  }

  private getElementInfo(el: IHTMLElement) {
    let elementInfo = this.elementsInfo.get(el);

    if (!elementInfo) {
      elementInfo = {};
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
    isFunction(elementInfo.cancel) && elementInfo.cancel();
    elementInfo.cancel = null;
  }
}
