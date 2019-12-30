import { createNormalScroller } from "./helpers/scrollerCreator";
import { createMultiRunwaysRecycler, MySource } from "./helpers/recyclerCreator";
import hook from "./helpers/hook";

describe('Runway manipulator', function () {
  const { scroller, container } = createNormalScroller();
  
  hook({
    createRecycler: () => createMultiRunwaysRecycler(scroller, container),
    destroy: () => document.body.removeChild(scroller),
    el: scroller
  });
  
  it('has multiple runway', function () {
    expect(Object.keys(this.recycler.runways).length).toBe(2);
  });
  
  it('checkout runway', async function () {
    const { recycler } = this;
    const scrollTop = 5978;

    await recycler.scrollTo(scrollTop);
    await recycler.checkout(1);

    expect(recycler.getScrollTop()).toBe(0);
    
    await recycler.checkout(0);
  
    expect(recycler.getScrollTop()).toBe(scrollTop);
  });
  
  it('add runway', async function () {
    const { recycler } = this;
    
    recycler.addRunway(new MySource());
    
    expect(Object.keys(recycler.runways).length).toBe(3);
    expect(!!recycler.runways['2']).toBe(true);
    
    recycler.addRunway(new MySource('fourth'));
  
    expect(Object.keys(recycler.runways).length).toBe(4);
    expect(!!recycler.runways['fourth']).toBe(true);
  });
  
  it('reset runway', async function () {
    let runway;
    const { recycler } = this;
  
    await recycler.scrollTo(1000);
    recycler.resetRunway();
    
    runway = recycler.getCurrentRunway();
    
    expect(container.childElementCount).toBe(0);
    expect(runway.scrollTop).toBe(0);
    expect(runway.screenNodes.size).toBe(0);
  });
});
