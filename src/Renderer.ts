import newSet from './helpers/TinySet';
import { IRenderer, IRecycler, IQueue } from './interfaces/Recycler';

export default abstract class Renderer<T> implements IRenderer<T> {
  protected queue: IQueue = {
    using: newSet(),
    unused: []
  };

  public render(data: T, recycler: IRecycler<T>): HTMLElement {
    // 从 queue.unused 中弹出一个节点
    let el = this.queue.unused.pop();

    // 如果 el 不存在则创建一个新的节点。createNewElement 自行实现，返回一个 HTMLElement
    // 推荐 createNewElement 与 data 无关，这样速度比较快，而且可以统一用 update 更新这个节点
    if (!el) {
      el = this.createElement(data);
    }

    // 无论是刚创建的元素还是原来就有的元素，都走 update 更新
    this.update(el, data, recycler);

    // 向 queue.using 中添加一个节点
    this.queue.using.add(el);

    // 返回节点
    return el;
  }

  public abstract update(el: HTMLElement, data: T, recycler: IRecycler<T>): void;

  public abstract createElement(data?: T): HTMLElement;

  public release(el: HTMLElement, recycler: IRecycler<T>): void {
    this.queue.using.delete(el);
    this.queue.unused.push(el);
  }

  public releaseAll(recycler: IRecycler<T>): void {
    this.mapUsing((el) => this.release(el, recycler));
  }

  public clear(recycler: IRecycler<T>): void {
    this.mapUsing((el) => {
      this.release(el, recycler);
      el.remove();
    });
  }

  protected mapUsing(fn: (el: HTMLElement) => void) {
    this.queue.using.forEach((el) => fn(el));
  }
}
