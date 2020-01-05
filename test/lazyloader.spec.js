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
  
    expect(recycler.renderer.lazyLoader.elementsInfo.size).toBe(15);
  });
  
  it('image should be rendered', async function () {
    const { recycler } = this;
  
    await recycler.scrollTo(5486);
    await sleep(300);
    await recycler.scrollTo(5496);

    recycler.getRunway().screenNodes.forEach((el) => {
      const state = el.getAttribute('lazy');
      if (state === 'loaded' || state === 'complete') {
        expect(el.style.backgroundImage).toBe('url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZSURBVDhPY3hAIhjVQAwY1UAMGHQaHjwAAD9boB9HiJ0WAAAAAElFTkSuQmCC")');
      } else if (state === 'error') {
        expect(el.style.backgroundImage).toBe('url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")');
      }
    });
  });
});
