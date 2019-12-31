import { createRecyclerWithLazyLoader } from './helpers/recyclerCreator';
import { createNormalScroller } from "./helpers/scrollerCreator";
import { sleep } from "./helpers/util";
import hook from "./helpers/hook";

describe('LazyLoader', function () {
  const { scroller, container } = createNormalScroller();
  
  hook({
    createRecycler: () => createRecyclerWithLazyLoader(scroller, container),
    destroy: () => document.body.removeChild(scroller),
    el: scroller
  });
  
  it('lazyLoader size should less than elements limit', async function () {
    const { recycler } = this;
    
    expect(recycler.renderer.lazyLoader.elementsInfo.size).toBeLessThan(16);
    
    await recycler.scrollTo(5486);
    await sleep(300);
    await recycler.scrollTo(5496);
    await sleep(300);
    await recycler.scrollTo(0);
    await sleep(300);
    await recycler.scrollTo(10000);
    await sleep(300);
  
    expect(recycler.renderer.lazyLoader.elementsInfo.size).toBe(15);
  });
});
