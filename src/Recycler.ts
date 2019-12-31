import EventEmitter from './helpers/EventEmitter';
import ScrollerOperations from './helpers/ScrollerOperations';
import ScrollListener from './eventListeners/ScrollListener';
import ResizeListener from './eventListeners/ResizeListener';
import {
  Exceptions,
  execute,
} from './helpers/util';
import {
  IRecycler,
  ISource,
  IOptions,
  IRunway,
  IRunwayMap,
  IChangedNodes,
  RecyclerEvents,
  IRenderer
} from './interfaces/recycler';

export default class Recycler<T> extends EventEmitter implements IRecycler<T> {
  public static readonly Events = RecyclerEvents;

  public scroller: Window | HTMLElement;
  public container: HTMLElement;
  public topPreserved: number;
  public bottomPreserved: number;
  public runwayItems: number;
  public runwayItemsOpposite: number;
  public threshold: number;
  public isForceUpdate: boolean = false;
  public isInPlaceUpdate: boolean = false;
  public isResizeUpdate: boolean = false;

  protected scrollerHeight: number;
  protected activatedRunway: string;
  protected runways: IRunwayMap<T>;

  protected readonly scrollerOperations: ScrollerOperations;
  protected readonly scrollListener: ScrollListener;
  protected readonly resizeListener: ResizeListener;
  protected readonly renderer: IRenderer<T>;
  protected readonly sentinel: HTMLDivElement;
  protected readonly transformTemplate: (x: string, y: number) => string;

  constructor(scroller: Window | HTMLElement, sources: ISource<T> | Array<ISource<T>>, options: IOptions<T>) {
    super();

    // 初始化统一 scroller 操作接口
    this.scrollerOperations = new ScrollerOperations(scroller);

    if (!this.scrollerOperations.isScrollerValid()) {
      throw Exceptions.TypeError('Invalid scroller, must be window or inside document.body');
    }

    // 滚动容器
    this.scroller = scroller;
    this.scrollerHeight = this.scrollerOperations.getOffsetHeight();

    // 默认渲染器
    this.renderer = options.renderer;

    // 容纳元素的容器
    this.container = options.container || this.scrollerOperations.getElement();

    // 顶部和底部预留空间
    this.topPreserved = Math.max(options.topPreserved || 0, 0);
    this.bottomPreserved = Math.max(options.bottomPreserved || 0, 0);

    // 滚动正反方向预渲染元素个数
    this.runwayItems = options.runwayItems || 5;
    this.runwayItemsOpposite = options.runwayItemsOpposite || 2;

    // 距离底部多少个元素时触发加载更多
    this.threshold = options.threshold || 5;

    // 允许多个实例，可以在实例之间切换（为了能在同一个 scroller 中切换不同的内容，比如搜索结果和原列表之间切换）
    this.initRunways(sources);
    this.activatedRunway = Recycler.getDefaultRunwayKey(sources);

    // 初始化 Dom 事件监听器
    this.scrollListener = new ScrollListener(this.scroller);
    this.resizeListener = new ResizeListener();

    // 撑开滚动容器
    this.sentinel = document.createElement('div');
    this.sentinel.style.position = 'absolute';
    this.sentinel.style.width = '1px';
    this.sentinel.style.height = '1px';
    this.scrollerOperations.appendChild(this.sentinel);

    // 根据是否启用硬件加速选择模板
    if (options.enableAcceleration) {
      this.transformTemplate = (x, y) => `translate3d(${x}, ${y}px, 0)`;
    } else {
      this.transformTemplate = (x, y) => `translate(${x}, ${y}px)`;
    }

    // 初始化 container position style
    if (window.getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }

    // 初始化哨兵位置
    this.setSentinelPosition();

    // 监听事件，根据 scroller 需要不同的监听方式
    this.scrollListener.on(this.onScroll.bind(this));
    if (options.handleWindowResize) {
      this.resizeListener.on(this.onResize.bind(this));
    }

    // 遍历 runways，并调用对应的 source.mount() 方法，可以在此监听一些事件（比如配置 lazyload）
    for (const [, runway] of Object.entries(this.runways)) {
      execute(() => runway.source.mount(this));
    }

    // 渲染视图（如果 sources 不为空的话）
    if (this.getRunway().source.getLength(this) > 0) {
      this.update();
    }

    // 调用 onInitialized
    Promise.resolve().then(() => {
      this.emit(Recycler.Events.Initialized, this);
    });
  }

  public scrollTo(position: number): Promise<void> {
    const maxScrollTop = this.getRunwayMaxScrollTop();

    if (position > maxScrollTop) {
      position = maxScrollTop;
    }

    this.scrollerOperations.scrollTo(position);

    return new Promise((resolve) => {
      setTimeout(() => resolve(this.update()));
    });
  }

  public forceUpdate() {
    try {
      this.isForceUpdate = true;
      this.update();
    } catch (err) {
      throw err;
    } finally {
      this.isForceUpdate = false;
    }
  }

  public inPlaceUpdate() {
    try {
      const runway = this.getRunway();

      this.isInPlaceUpdate = true;

      for (const [i, $el] of Object.entries(runway.nodes)) {
        const index = Number(i);
        const renderer = this.getRenderer(index);
        const data = runway.source.getData(index, this);

        renderer.update($el, data, this);
      }
    } catch (err) {
      throw err;
    } finally {
      this.isInPlaceUpdate = false;
    }
  }

  public update(disableRender?: boolean) {
    this.scrollerHeight = this.scrollerOperations.getOffsetHeight();
    this.getRunway().runwayMaxScrollTop = this.getRunwayMaxScrollTop();
    this.setSentinelPosition();
    this.emit(Recycler.Events.Update, this, disableRender);
    !disableRender && this.onScroll();
  }

  public destroy() {
    this.scrollListener.destroy();
    this.resizeListener.destroy();
    this.cleanScreen();
    this.scrollerOperations.removeChild(this.sentinel);
    this.scrollerOperations.scrollTo(0);
    this.runways = null;
  }

  public updatePreservedSpace(preserved: {top: number, bottom: number}) {
    const { top, bottom } = preserved;

    top != null && (this.topPreserved = top);
    bottom != null && (this.bottomPreserved = bottom);
    this.update();
  }

  public cleanScreen(name?: string) {
    const runway = this.runways[name] || this.getRunway();

    // 从屏幕上移除所有元素
    Recycler.removeScreenNodes(runway);

    // 清屏时，我们需要释放所有在屏幕上的元素
    // 根据 freeUnusedNodes 的逻辑，当 start > runway.lastAttachedItem 时释放所有位于 runway.firstAttachedItem 和 runway.lastAttachedItem 之间的元素
    // 因此可以设定 start = runway.lastAttachedItem + 1，一定大于 runway.lastAttachedItem，以此达到释放所有正在使用元素的目的
    this.freeUnusedNodes(runway.lastAttachedItem + 1);

    return runway;
  }

  public async checkout(name: string, disableRender: boolean = false) {
    let runway;

    if (!this.runways[name]) {
      throw Exceptions.Error(`${name} is not exists in runways`);
    }

    this.cleanScreen();
    this.activatedRunway = name;
    runway = this.getRunway();

    this.update(true);

    if (!disableRender) {
      await this.scrollTo(runway.scrollTop);
    }

    this.emit(Recycler.Events.RunwaySwitched, this);
  }

  public addRunway(source: ISource<T>) {
    let { key } = source;

    if (!key) {
      key = String(Object.keys(this.runways).length);
    }

    if (this.runways[key]) {
      throw Exceptions.Error(`${source.key} is already exists`);
    }

    this.runways[key] = Recycler.getInitialRunway<T>(source);
  }

  public resetRunway(name?: string) {
    const key = this.runways[name] ? name : this.activatedRunway;
    const runway = this.runways[key];

    this.cleanScreen(key);
    execute(() => runway.source.clean(this));
    Object.assign(runway, Recycler.getInitialRunway<T>(runway.source));
  }

  public getScrollTop(): number {
    return Math.ceil(this.scrollerOperations.getScrollTop());
  }

  public getCurrentRunway(): IRunway<T> {
    return {...this.getRunway()};
  }

  protected onScroll() {
    const runway = this.getRunway();
    const currentScrollTop = this.getScrollTop();
    const delta = currentScrollTop - runway.scrollTop; // delta > 0 说明向下滚动，delta < 0 说明向上滚动
    const runwayScrollTop = Math.max(0, Math.min(currentScrollTop, runway.runwayMaxScrollTop));

    // 记录 scrollTop
    runway.scrollTop = currentScrollTop;

    // 计算在屏幕内的第一个元素
    if (currentScrollTop === 0) {
      runway.firstScreenItem = 0;
    } else {
      runway.firstScreenItem = this.getFirstScreenItem(runway.firstScreenItem, Math.max(runwayScrollTop - this.topPreserved, 0));
    }

    // 计算在屏幕内的最后一个元素
    runway.lastScreenItem = this.getLastScreenItem(runway.lastScreenItem, Math.max(runwayScrollTop - this.topPreserved + this.scrollerHeight, 0));

    // 发送事件
    this.emit(Recycler.Events.Scrolling, this, delta);
    if (currentScrollTop === 0) {
      this.emit(Recycler.Events.ScrollAtStart, this);
    } else if (currentScrollTop >= runway.runwayMaxScrollTop) {
      this.emit(Recycler.Events.ScrollAtEnd, this);
    }

    // 根据 delta 不同，选择不同的渲染起始点和终止点
    if (delta < 0) {
      this.fill(runway.firstScreenItem - this.runwayItems, runway.lastScreenItem + this.runwayItemsOpposite);
    } else {
      this.fill(runway.firstScreenItem - this.runwayItemsOpposite, runway.lastScreenItem + this.runwayItems);
    }
  }

  protected onResize() {
    try {
      this.isResizeUpdate = true;
      this.forceUpdate();
      this.emit(Recycler.Events.Resized, this);
    } catch (err) {
      throw err;
    } finally {
      this.isResizeUpdate = false;
    }
  }

  protected fill(start: number, end: number) {
    const runway = this.getRunway();

    // 限制渲染起止点和终止点在安全范围内（即有意义的范围内）
    const fixedStart = Math.max(0, start);
    const fixedEnd = Math.min(runway.source.getLength(this) - 1, end);

    // 开始渲染
    this.attachContent(fixedStart, fixedEnd);

    // 缓存渲染起始点和终止点
    runway.firstAttachedItem = fixedStart;
    runway.lastAttachedItem = fixedEnd;
  }

  protected attachContent(start: number, end: number) {
    const runway = this.getRunway();
    const benchNodes = []; // 板凳元素，即等待被放到 DOM tree 里的节点
    const changedNodes: IChangedNodes = []; // 有变化的节点

    // 重点是释放在屏幕外的元素
    this.freeUnusedNodes(start, end, this.isForceUpdate);

    // 从渲染起始点到渲染终止点进行遍历
    for (let i = start; i <= end; i++) {
      // 如果 node 存在于缓存中，说明元素本来就在屏幕上，不需要做什么（除非指定强制更新）
      if (!this.isForceUpdate && runway.nodes[i]) {
        continue;
      }

      const renderer = this.getRenderer(i);
      const data = runway.source.getData(i, this);

      // 调用渲染函数，获得一个节点
      // 这个节点可能在屏幕上，也可能不在，取决于渲染器的设计（是否有缓存）和当前滚动的深度
      // 如果该节点在屏幕上，性能会最佳，因为只需要改变一下 translate 就行了，不需要 layout
      const node = runway.nodes[i] = renderer.render(data, this);

      // 向缓存中存入一个节点，用于移除
      runway.screenNodes.add(node);

      // 向变化的节点数组中加入一项，等待改变样式（translate, height, etc...）
      changedNodes.push({node, index: i});

      // 如果该节点的父元素不是指定的容器，则加入板凳元素数组中
      if (node.parentNode !== this.container) {
        benchNodes.push(node);
      }
    }

    // 批量修改节点样式
    this.setNodesStyles(changedNodes);

    // 批量加入元素到容器中
    while (benchNodes.length) {
      this.container.appendChild(benchNodes.pop());
    }

    // 也许可以加载更多
    this.maybeLoadMore(end);
  }

  protected freeUnusedNodes(start: number, end?: number, force?: boolean) {
    const runway = this.getRunway();

    if (force || start > runway.lastAttachedItem || end < runway.firstAttachedItem) {
      return this.freeNodesFromStart(runway.firstAttachedItem, Math.min(runway.source.getLength(this), runway.lastAttachedItem + 1));
    }

    this.freeNodesFromStart(runway.firstAttachedItem, start);
    this.freeNodesFromEnd(end, runway.lastAttachedItem);
  }

  protected freeNodesFromStart(start: number, end: number) {
    const runway = this.getRunway();

    for (let i = start; i < end; i++) {
      this.freeNode(i, runway);
    }
  }

  protected freeNodesFromEnd(start: number, end: number) {
    const runway = this.getRunway();

    for (let i = end; i > start; i--) {
      this.freeNode(i, runway);
    }
  }

  protected freeNode(index: number, runway: IRunway<T>) {
    if (!runway.nodes[index]) {
      return;
    }

    const renderer = this.getRenderer(index);
    const node = runway.nodes[index];

    execute(() => renderer.release(node, this));
    delete runway.nodes[index];
    if (!node.parentNode) {
      runway.screenNodes.delete(node);
    }
  }

  protected setSentinelPosition() {
    this.sentinel.style.top = this.getMaxScrollHeight() + 'px';
  }

  protected setNodesStyles(nodes: IChangedNodes) {
    const runway = this.getRunway();

    for (const { node, index } of nodes) {
      const {x, y} = execute(() => runway.source.getOffset(index, this), {x: '0', y: 0});

      node.dataset.index = String(index);
      node.style.position = 'absolute';
      node.style.top = node.style.left = '0';
      node.style.height = `${runway.source.getHeight(index, this)}px`;
      node.style.width = runway.source.getWidth(index, this);
      node.dataset.column = execute(() => String(runway.source.getColumn(index, this)), '1');
      node.style.transform = node.style.webkitTransform = this.transformTemplate(x, runway.source.getScrollTop(index, this) + y);
    }
  }

  protected getFirstScreenItem(initialAnchorItem: number, scrollTop: number): number {
    let i = initialAnchorItem;
    const runway = this.getRunway();
    const sourceLastIndex = runway.source.getLength(this) - 1;

    if (runway.source.getScrollTop(i, this) + runway.source.getHeight(i, this) < scrollTop) {
      while (i < sourceLastIndex && runway.source.getScrollTop(++i, this) + runway.source.getHeight(i, this) < scrollTop) {
        // do nothing
      }
    } else {
      while (i > 0 && runway.source.getScrollTop(--i, this) + runway.source.getHeight(i, this) > scrollTop) {
        // do nothing
      }
      // 上面的循环得到的 i 的意义是在屏幕之上的最后一个元素
      // 我们需要的是 在屏幕内的第一个元素
      // 故加 1
      i < sourceLastIndex && i > 0 && ++i;
    }

    return i;
  }

  protected getLastScreenItem(initialAnchorItem: number, scrollTop: number): number {
    let i = initialAnchorItem;
    const runway = this.getRunway();
    const sourceLastIndex = runway.source.getLength(this) - 1;

    if (runway.source.getScrollTop(i, this) > scrollTop) {
      while (i > 0 && runway.source.getScrollTop(--i, this) > scrollTop) {
        // do nothing
      }
    } else {
      while (i < sourceLastIndex && runway.source.getScrollTop(++i, this) < scrollTop) {
        // do nothing
      }
      // 上面的循环得到的 i 的意义是首个 scrollTop >= 给定 scrollTop 的 item
      // 我们需要的是 最后一个 scrollTop <= 给定 scrollTop 的 item
      // 故减 1
      i > 0 && i < sourceLastIndex && --i;
    }

    return i;
  }

  protected getRunway(): IRunway<T> {
    return this.runways[this.activatedRunway];
  }

  protected getRunwayMaxScrollTop(): number {
    return Math.max(0, this.getMaxScrollHeight() - this.scrollerHeight);
  }

  protected getMaxScrollHeight(): number {
    return this.getRunway().source.getMaxScrollHeight(this) + this.bottomPreserved + this.topPreserved;
  }

  protected async maybeLoadMore(end: number): Promise<void> {
    const runway = this.getRunway();
    const isInitial = !runway.source.getLength(this);

    if (
      (runway.source.getLength(this) - end <= this.threshold || isInitial) &&
      !runway.requestInProgress &&
      runway.source.fetch
    ) {
      const activatedRunwayCache = this.activatedRunway;
      runway.requestInProgress = true;

      try {
        const data = await runway.source.fetch(this);

        if (!data) {
          return;
        }
        if (this.activatedRunway === activatedRunwayCache) {
          this.update();
        }
      } catch (e) {
        // keep silence
      } finally {
        runway.requestInProgress = false;
      }
    }
  }

  protected getRenderer(index: number): IRenderer<T> {
    const source = this.getRunway().source;
    return (source.getRenderer && source.getRenderer(index, this)) || this.renderer;
  }

  protected initRunways(sources: ISource<T> | Array<ISource<T>>) {
    this.runways = {};

    if (Array.isArray(sources)) {
      for (const source of sources) {
        this.addRunway(source);
      }
    } else if (sources) {
      this.addRunway(sources as ISource<T>);
    } else {
      throw Exceptions.TypeError('sources is invalid');
    }
  }

  protected static getDefaultRunwayKey<U>(sources: ISource<U> | Array<ISource<U>>): string {
    if (!sources) {
      throw Exceptions.TypeError('sources is not defined');
    }

    if (Array.isArray(sources)) {
      return sources[0].key || '0';
    }

    return sources.key || '0';
  }

  protected static getInitialRunway<U>(source: ISource<U>): IRunway<U> {
    return {
      scrollTop: 0,
      firstAttachedItem: 0,
      lastAttachedItem: 0,
      firstScreenItem: 0,
      lastScreenItem: 0,
      requestInProgress: false,
      runwayMaxScrollTop: 0,
      nodes: {},
      screenNodes: new Set(),
      source,
    };
  }

  protected static removeScreenNodes<U>(runway: IRunway<U>) {
    for (const node of runway.screenNodes.values()) {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
        runway.screenNodes.delete(node);
      }
    }
  }
}
