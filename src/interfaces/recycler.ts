import { IEvents } from './events';

export type IChangedNodes = Array<{node: HTMLElement, index: number}>;

export interface IOptions<T> {
  container?: HTMLElement;
  topPreserved?: number;
  bottomPreserved?: number;
  runwayItems?: number;
  runwayItemsOpposite?: number;
  threshold?: number;
  enableAcceleration?: boolean;
  handleWindowResize?: boolean;
  renderer?: IRenderer<T>;
}

export interface IRunway<T> {
  scrollTop: number;
  firstAttachedItem: number;
  lastAttachedItem: number;
  firstScreenItem: number;
  lastScreenItem: number;
  requestInProgress: boolean;
  runwayMaxScrollTop: number;
  nodes: {[key: string]: HTMLElement};
  screenNodes: Set<HTMLElement>;
  source: ISource<T>;
}

export interface IRunwayMap<T> {
  [key: string]: IRunway<T>;
}

export interface IRecycler<T> extends IEvents {
  scroller: Window | HTMLElement;
  container: HTMLElement;
  isForceUpdate: boolean;
  isInPlaceUpdate: boolean;
  isResizeUpdate: boolean;
  topPreserved: number;
  bottomPreserved: number;
  runwayItems: number;
  runwayItemsOpposite: number;
  threshold: number;

  scrollTo(position: number, done?: () => void): void | Promise<void>;
  getScrollTop(): number;
  update(disableRender?: boolean): void;
  forceUpdate(): void;
  inPlaceUpdate(): void;
  destroy(): void;
  updatePreservedSpace(preserved: {top: number, bottom: number}): void;
  cleanScreen(): void;
  checkout(name: string, done?: () => void): void | Promise<void>;
  addRunway(source: ISource<T>): void;
  resetRunway(name?: string): void;
  getCurrentRunway(): IRunway<T>;
}

export interface IQueue {
  unused: HTMLElement[];
  using: Set<HTMLElement>;
}

export interface IRenderer<T> {
  render(data: T, recycler: IRecycler<T>): HTMLElement;
  update(el: HTMLElement, data: T, recycler: IRecycler<T>): void;

  release?(el: HTMLElement, recycler: IRecycler<T>): void;
  releaseAll?(recycler: IRecycler<T>): void;
  clear?(recycler: IRecycler<T>): void;
}

export interface ISource<T> {
  key: string;
  getScrollTop(index: number, recycler: IRecycler<T>): number;
  getHeight(index: number, recycler: IRecycler<T>): number;
  getWidth(index: number, recycler: IRecycler<T>): string;
  getMaxScrollHeight(recycler: IRecycler<T>): number;
  getData(index: number, recycler: IRecycler<T>): T;
  getLength(recycler: IRecycler<T>): number;

  fetch?(recycler: IRecycler<T>, done: (moreLoaded: boolean) => void): any;
  getRenderer?(index: number, recycler: IRecycler<T>): IRenderer<T>;
  getOffset?(index: number, recycler: IRecycler<T>): {x: string, y: number};
  getColumn?(index: number, recycler: IRecycler<T>): number;
  clean?(recycler: IRecycler<T>): void;
  refresh?(recycler: IRecycler<T>, done: () => void): any;
  mount?(recycler: IRecycler<T>): void;
}

export enum RecyclerEvents {
  Initialized = 'Initialized',
  RunwaySwitched = 'RunwaySwitched',
  Resized = 'Resized',
  Scrolling = 'Scrolling',
  ScrollAtStart = 'ScrollAtStart',
  ScrollAtEnd = 'ScrollAtEnd',
  Update = 'Update'
}
