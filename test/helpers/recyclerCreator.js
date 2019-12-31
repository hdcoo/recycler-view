import { Recycler, Source, Renderer } from "src";

export class MySource extends Source {
  constructor(key) {
    super();
    
    this.data = [];
    this.key = key;
    
    this.fetch();
  }
  
  getData(index, recycler) {
    return this.data[index];
  }
  
  getHeight(index, recycler) {
    return 100;
  }
  
  getWidth(index, recycler) {
    return '100%';
  }
  
  getLength(recycler) {
    return this.data.length;
  }
  
  getMaxScrollHeight(recycler) {
    return this.getLength() * this.getHeight();
  }
  
  getScrollTop(index, recycler) {
    return Math.max(0, index - 1) * this.getHeight();
  }
  
  fetch(recycler) {
    const lastData = this.data[this.data.length - 1] || 0;
    
    for (let i = lastData;i < lastData + 100;i++) {
      this.data.push(i);
    }
    
    return true;
  }
}

export class MyRenderer extends Renderer {
  createElement(data) {
    return document.createElement('div');
  }
  
  update(el, data, recycler) {
    el.renderCount = (el.renderCount || 0) + 1;
    el.textContent = data;
  }
}

export function createNormalRecycler(scroller, container) {
  return new Recycler(scroller, new MySource(), {
    container,
    renderer: new MyRenderer()
  })
}

export function createMultiRunwaysRecycler(scroller, container) {
  return new Recycler(
    scroller,
    [new MySource(), new MySource()],
    {
      container,
      renderer: new MyRenderer()
    }
  )
}
