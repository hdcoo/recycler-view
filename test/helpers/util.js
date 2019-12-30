export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function getTranslateY(el) {
  const { transform } = el.style;
  const match = transform.match(/translate(3d)?\([^,]+,\s*(\d+)/);
  
  return match && match[2] ? Number(match[2]) : 0;
}

export function initBody(el) {
  el && document.body.appendChild(el);
  document.body.style.height = '667px';
  document.body.style.width = '375px';
}
