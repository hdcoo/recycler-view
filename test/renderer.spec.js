import { createNormalScroller } from "./helpers/scrollerCreator";
import { createMultiRunwaysRecycler } from "./helpers/recyclerCreator";
import hook from "./helpers/hook";

describe('Renderer', function () {
  const { scroller, container } = createNormalScroller();
  
  hook({
    createRecycler: () => createMultiRunwaysRecycler(scroller, container),
    destroy: () => document.body.removeChild(scroller),
    el: scroller
  });
  
  it('releaseAll should work correct', function () {
    const { recycler } = this;
    
    recycler.renderer.releaseAll();
    
    expect(recycler.renderer.queue.using.size).toBe(0);
  });
  
  it('clear should work correct ', function () {
    const { recycler } = this;
  
    recycler.renderer.clear();
    
    expect(recycler.renderer.queue.using.size).toBe(0);
    expect(container.childElementCount).toBe(0);
  });
});
