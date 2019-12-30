import createRecycler from "./helpers/recyclerCreator";
import { sleep } from "./helpers/util";

describe('Recycler unit test', function () {
  const scroller = document.createElement('div');
  const container = document.createElement('div');
  
  scroller.appendChild(container);
  document.body.appendChild(scroller);
  scroller.style.height = '100%';
  scroller.style.position = 'relative';
  scroller.style.overflowX = 'hidden';
  scroller.style.overflowY = 'scroll';
  document.body.style.height = '667px';
  document.body.style.width = '375px';
  
  beforeEach(function () {
    this.recycler && this.recycler.destroy();
    this.recycler = createRecycler(scroller, container);
    this.runway = this.recycler.getCurrentRunway();
  });
  
  // it('getters should be good', function () {
  //   const source = this.runway.source;
  //
  //   expect(source.getWidth()).toBe('100%');
  //   expect(source.getHeight()).toBe(100);
  //   expect(source.getScrollTop(30)).toBe(29 * 100);
  //   expect(source.getMaxScrollHeight()).toBe(100 * 100);
  //   expect(source.getLength()).toBe(100);
  // });
  //
  // it('init: should less than element limit', function () {
  //   expect([...this.runway.screenNodes].length).toBeLessThan(16);
  // });
  //
  // it('scrolling: should less than element limit', function () {
  //   this.recycler.scrollTo(3000);
  //   this.recycler.scroller.scrollTop;
  //
  //   expect([...this.runway.screenNodes].length).toBeLessThan(16);
  // });
  
  it('anchor should be correct', async function () {
    this.recycler.scrollTo(3000);
  
    await sleep(10);
  
    expect(this.runway.firstAttachedItem).toBe(28);
    expect(this.runway.lastAttachedItem).toBe(42);
  });
  
});
