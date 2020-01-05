function makeMessage(message: string): string {
  return `[ recycler ] ${message}`;
}

function log(message: string, method: (...args: any[]) => void) {
  return method(makeMessage(message));
}

function error(message: string, Error: ErrorConstructor | TypeErrorConstructor): Error {
  return new Error(makeMessage(message));
}

export const logger = {
  info(message: string) {
    // tslint:disable-next-line
    return log(message, console.info);
  },
  error(message: string) {
    // tslint:disable-next-line
    return log(message, console.error);
  }
};

export const Exceptions = {
  Error(message: string) {
    return error(message, Error);
  },
  TypeError(message: string) {
    return error(message, TypeError);
  }
};

export function isElementNode(target: any): boolean {
  return target instanceof HTMLElement && target.nodeType === Node.ELEMENT_NODE;
}

export function execute<T>(fn: () => T, defaultReturn?: T): T {
  try {
    return fn();
  } catch (e) {
    return defaultReturn;
  }
}

export function throttle(fn: (...args: any[]) => any, threshold: number = 200) {
  let lastExecTime = Date.now();

  return (...args: any[]) => {
    const now = Date.now();

    if (now - lastExecTime > threshold) {
      lastExecTime = now;
      fn(...args);
    }
  };
}

export function loadImage(src: string, onload: () => void, onerror: () => void) {
  const el = new Image();

  const cancel = () => {
    el.onerror('canceled');
    el.onerror = null;
    el.onload = null;
    el.src = '';
  };

  el.onload = onload;
  el.onerror = onerror;
  el.src = src;

  return cancel;
}

export function getAnimationEndEventName() {
  const $el = document.createElement('div');

  if ($el.style.animation !== undefined) {
    return 'animationend';
  }

  if ($el.style.webkitAnimation !== undefined) {
    return 'webkitAnimationEnd';
  }

  return 'animationend';
}

export function getRAFExecutor() {
  return requestAnimationFrame || webkitRequestAnimationFrame || setTimeout;
}

export function isFunction(target: any) {
  return typeof target === 'function';
}

export function mapObject<T>(obj: {[key: string]: T}, handler: (value: T, key: string) => void) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      handler(obj[key], key);
    }
  }
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // tslint:disable-next-line
    const r = Math.random() * 16 | 0;
    // tslint:disable-next-line
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
