import { Recycler } from "src";
import { SourceWithNoData, MyRenderer } from "./helpers/recyclerCreator";

describe('Edge situation', function () {
  
  it('invalid scroller', function () {
    let err;
    
    try {
      new Recycler(document.documentElement, new SourceWithNoData(), {
        renderer: new MyRenderer()
      });
    } catch (e) {
      err = e;
    }
    
    expect(err).toBeInstanceOf(Error);
    err = undefined;
    
    try {
      new Recycler({}, new SourceWithNoData(), {
        renderer: new MyRenderer()
      })
    } catch (e) {
      err = e;
    }
    
    expect(err).toBeInstanceOf(Error);
  });
  
  it('invalid source', function () {
    let err;
    
    try {
      new Recycler(window, 0, {
        renderer: new MyRenderer()
      });
    } catch (e) {
      err = e;
    }
  
    expect(err).toBeInstanceOf(Error);
  });
  
  it('no container', function () {
    let recycler = new Recycler(window, new SourceWithNoData(), {
      renderer: new MyRenderer()
    });
    let scroller = document.createElement('div');
    
    document.body.appendChild(scroller);
    
    expect(recycler.container).toBe(document.body);
    
    recycler = new Recycler(scroller, new SourceWithNoData(), {
      renderer: new MyRenderer(),
      handleWindowResize: true
    });
    recycler.onResize();
    
    expect(recycler.container).toBe(scroller);
    
    document.body.removeChild(scroller);
  });
});
