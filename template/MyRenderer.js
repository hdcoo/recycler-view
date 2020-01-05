import { Renderer, LazyLoader } from 'dist';

export default class MyRenderer extends Renderer {
  constructor() {
    super();

    this.queue = {
      using: new Set(),
      unused: []
    };
    
    this.lazyload = new LazyLoader({
      loading: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAZSURBVDhPY3hAIhjVQAwY1UAMGHQaHjwAAD9boB9HiJ0WAAAAAElFTkSuQmCC'
    });
  }
  
  mount(recycler) {
    this.lazyload.mount(recycler);
  }
  
  createElement(data) {
    const el = document.createElement('div');
    
    el.classList.add('recycle-item');
    el.innerHTML = '<div class="photo"></div>';
    
    return el;
  }
  
  update(el, data, recycler) {
    this.lazyload.update(el.children[0], {
      value: data.src,
      type: 'background'
    });
    return el;
  }
}
