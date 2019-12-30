export function createNormalScroller() {
  const scroller = document.createElement('div');
  const container = document.createElement('div');
  
  scroller.appendChild(container);
  scroller.style.height = '100%';
  scroller.style.position = 'relative';
  scroller.style.overflowX = 'hidden';
  scroller.style.overflowY = 'scroll';
  
  return {scroller, container};
}

export function createWindowScroller() {
  return {
    scroller: window,
    container: document.createElement('div')
  }
}
