import createRecycler from "./helpers/recyclerCreator";
import { createNormalScroller } from "./helpers/scrollerCreator";
import { getTranslateY, initBody } from "./helpers/util";

describe('HTMLElement as scroller', function () {
  const { scroller, container } = createNormalScroller();
  
  initBody(scroller);
  
  beforeEach(function () {
    this.recycler = createRecycler(scroller, container);
    if (!this.getRunway) {
      this.getRunway = function () {
        return this.recycler.getCurrentRunway();
      }
    }
  });
  
  afterEach(function () {
    this.recycler.destroy();
  });
  
  afterAll(function () {
    document.body.removeChild(scroller);
  });
  
  it('getters should be correct', function () {
    const source = this.getRunway().source;

    expect(source.getWidth()).toBe('100%');
    expect(source.getHeight()).toBe(100);
    expect(source.getScrollTop(30)).toBe(29 * 100);
    expect(source.getMaxScrollHeight()).toBe(100 * 100);
    expect(source.getLength()).toBe(100);
  });

  it('elements count should less than element limit after init', function () {
    expect([...this.getRunway().screenNodes].length).toBeLessThan(16);
  });

  it('elements count should less than element limit during scroll', async function () {
    await this.recycler.scrollTo(4563);
    await this.recycler.scrollTo(3000);
    await this.recycler.scrollTo(7892);
    await this.recycler.scrollTo(486);
  
    expect(container.childElementCount).toBe([...this.getRunway().screenNodes].length);
    expect(container.childElementCount).toBeLessThan(16);
  });
  
  it('anchor should be correct', async function () {
    let runway;
    
    await this.recycler.scrollTo(3000);
    runway = this.recycler.getCurrentRunway();
    
    expect(runway.firstAttachedItem).toBe(28);
    expect(runway.lastAttachedItem).toBe(42);
  });
  
  it('transform should be correct', async function () {
    await this.recycler.scrollTo(5630);
    
    const runway = this.getRunway();
    
    for (const el of runway.screenNodes.values()) {
      const { index } = el.dataset;
      expect(getTranslateY(el)).toBe(runway.source.getScrollTop(index));
    }
  });
});
