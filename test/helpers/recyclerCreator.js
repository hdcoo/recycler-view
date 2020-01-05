import { Recycler, Source, Renderer, LazyLoader } from "src";

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
    return index * this.getHeight();
  }
  
  fetch(recycler) {
    const lastData = this.data[this.data.length - 1] || 0;
    
    for (let i = lastData;i < lastData + 100;i++) {
      this.data.push(i);
    }
    
    return true;
  }
}

export class SourceWithNoData extends MySource {
  async fetch(recycler) {}
}

export class MyRenderer extends Renderer {
  constructor() {
    super();

    this.queue = {
      using: new Set(),
      unused: []
    };
  }

  createElement(data) {
    return document.createElement('div');
  }
  
  update(el, data, recycler) {
    el.renderCount = (el.renderCount || 0) + 1;
    el.textContent = data;
  }
}

export class RendererWithLazyLoader extends Renderer {
  constructor() {
    super();

    this.queue = {
      using: new Set(),
      unused: []
    };

    this.lazyLoader = new LazyLoader();
  }
  
  mount(recycler) {
    this.lazyLoader.mount(recycler);
  }
  
  createElement(data) {
    return document.createElement('div');
  }
  
  update(el, data, recycler) {
    el.renderCount = (el.renderCount || 0) + 1;
    this.lazyLoader.update(el, {
      value: Math.random() > 0.5 ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZSURBVDhPY3hAIhjVQAwY1UAMGHQaHjwAAD9boB9HiJ0WAAAAAElFTkSuQmCC' : 'https://test',
      type: 'background'
    });
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

export function createRecyclerWithLazyLoader(scroller, container) {
  const recycler = new Recycler(scroller, new MySource(), {
    container,
    renderer: new RendererWithLazyLoader()
  });
  
  recycler.on(Recycler.Events.Initialized, () => {
    recycler.renderer.mount(recycler);
    recycler.forceUpdate();
  });
  
  return recycler;
}
