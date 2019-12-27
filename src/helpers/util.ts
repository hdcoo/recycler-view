import { ILoader } from '../interfaces/lazyload';

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

export function loadImage(src: string): ILoader {
  const el = new Image();

  const promise: ILoader = new Promise((resolve, reject) => {
    el.onload = () => {
      delete promise.cancel;
      resolve();
    };
    el.onerror = (err) => {
      delete promise.cancel;
      reject(err);
    };
    el.src = src;
  });

  promise.cancel = () => {
    el.onerror('canceled');
    el.onerror = null;
    el.onload = null;
    el.src = '';
  };

  return promise;
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
