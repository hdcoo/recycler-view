import { Recycler, Source, Renderer } from "src";

class MySource extends Source {
  constructor() {
    super();
    
    this.data = [];
    
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

class MyRenderer extends Renderer {
  createElement(data) {
    return document.createElement('div');
  }
  
  update(el, data, recycler) {
    el.textContent = data;
  }
}

export default function createRecycler(scroller, container) {
  return new Recycler(scroller, new MySource(), {
    container,
    renderer: new MyRenderer()
  })
}
