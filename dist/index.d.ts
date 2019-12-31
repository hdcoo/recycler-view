declare enum ImageTypes {
    img = "img",
    background = "background"
}
interface ILazyLoaderOptions {
    speedThreshold?: number;
    loading?: string;
    error?: string;
}
interface IBinding {
    value: string;
    type?: ImageTypes;
}
interface IHTMLElement extends HTMLElement {
    [key: string]: any;
}
interface IEvents {
    on(key: string, handler: (...args: any[]) => void): IEvents;
    emit(key: string): IEvents;
    off(...keys: string[]): IEvents;
}
declare class EventEmitter implements IEvents {
    protected events: {
        [key: string]: Array<(...args: any[]) => void>;
    };
    constructor();
    on(key: string, handler: (...args: any[]) => void): this;
    emit(key: string, ...args: any[]): this;
    off(...keys: string[]): this;
}
declare class ScrollerOperations {
    private target;
    private readonly isWindow;
    private readonly window;
    private readonly document;
    constructor(target: Window | HTMLElement);
    isScrollerValid(): boolean;
    appendChild(el: HTMLElement): HTMLElement;
    removeChild(el: HTMLElement): HTMLElement;
    scrollTo(position: number): void;
    getOffsetHeight(): number;
    getScrollTop(): number;
    getElement(): HTMLElement;
    private hasAncestor;
}
declare abstract class Listener {
    protected target: Window | HTMLElement;
    protected abstract eventType: string;
    private listened;
    private ticking;
    private handlers;
    protected constructor(target: Window | HTMLElement);
    on(fn: (e: Event) => void): void;
    off(): void;
    destroy(): void;
    protected abstract getScrollEventTarget(): Window | HTMLElement;
    private handler;
    private bind;
    private unbind;
}
declare class ScrollListener extends Listener {
    protected eventType: string;
    constructor(target: Window | HTMLElement);
    protected getScrollEventTarget(): Window | HTMLElement;
}
declare class ResizeListener extends Listener {
    protected eventType: string;
    constructor(target?: Window);
    protected getScrollEventTarget(): Window | HTMLElement;
}
declare type IChangedNodes = Array<{
    node: HTMLElement;
    index: number;
}>;
interface IOptions<T> {
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
interface IRunway<T> {
    scrollTop: number;
    firstAttachedItem: number;
    lastAttachedItem: number;
    firstScreenItem: number;
    lastScreenItem: number;
    requestInProgress: boolean;
    runwayMaxScrollTop: number;
    nodes: {
        [key: string]: HTMLElement;
    };
    screenNodes: Set<HTMLElement>;
    source: ISource<T>;
}
interface IRunwayMap<T> {
    [key: string]: IRunway<T>;
}
interface IRecycler<T> extends IEvents {
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
    scrollTo(position: number): Promise<void>;
    getScrollTop(): number;
    update(disableRender?: boolean): void;
    forceUpdate(): void;
    inPlaceUpdate(): void;
    destroy(): void;
    updatePreservedSpace(preserved: {
        top: number;
        bottom: number;
    }): void;
    cleanScreen(): void;
    checkout(name: string, disableRender?: boolean): Promise<void>;
    addRunway(source: ISource<T>): void;
    resetRunway(name?: string): void;
    getCurrentRunway(): IRunway<T>;
}
interface IQueue {
    unused: HTMLElement[];
    using: Set<HTMLElement>;
}
interface IRenderer<T> {
    render(data: T, recycler: IRecycler<T>): HTMLElement;
    update(el: HTMLElement, data: T, recycler: IRecycler<T>): void;
    release?(el: HTMLElement, recycler: IRecycler<T>): void;
    releaseAll?(recycler: IRecycler<T>): void;
    clear?(recycler: IRecycler<T>): void;
}
interface ISource<T> {
    key: string;
    getScrollTop(index: number, recycler: IRecycler<T>): number;
    getHeight(index: number, recycler: IRecycler<T>): number;
    getWidth(index: number, recycler: IRecycler<T>): string;
    getMaxScrollHeight(recycler: IRecycler<T>): number;
    getData(index: number, recycler: IRecycler<T>): T;
    getLength(recycler: IRecycler<T>): number;
    fetch?(recycler: IRecycler<T>): Promise<boolean>;
    getRenderer?(index: number, recycler: IRecycler<T>): IRenderer<T>;
    getOffset?(index: number, recycler: IRecycler<T>): {
        x: string;
        y: number;
    };
    getColumn?(index: number, recycler: IRecycler<T>): number;
    clean?(recycler: IRecycler<T>): void;
    refresh?(recycler: IRecycler<T>): Promise<boolean>;
    mount?(recycler: IRecycler<T>): void;
}
declare enum RecyclerEvents {
    Initialized = "Initialized",
    RunwaySwitched = "RunwaySwitched",
    Resized = "Resized",
    Scrolling = "Scrolling",
    ScrollAtStart = "ScrollAtStart",
    ScrollAtEnd = "ScrollAtEnd",
    Update = "Update"
}
declare class Recycler<T> extends EventEmitter implements IRecycler<T> {
    static readonly Events: typeof RecyclerEvents;
    scroller: Window | HTMLElement;
    container: HTMLElement;
    topPreserved: number;
    bottomPreserved: number;
    runwayItems: number;
    runwayItemsOpposite: number;
    threshold: number;
    isForceUpdate: boolean;
    isInPlaceUpdate: boolean;
    isResizeUpdate: boolean;
    protected scrollerHeight: number;
    protected activatedRunway: string;
    protected runways: IRunwayMap<T>;
    protected readonly scrollerOperations: ScrollerOperations;
    protected readonly scrollListener: ScrollListener;
    protected readonly resizeListener: ResizeListener;
    protected readonly renderer: IRenderer<T>;
    protected readonly sentinel: HTMLDivElement;
    protected readonly transformTemplate: (x: string, y: number) => string;
    constructor(scroller: Window | HTMLElement, sources: ISource<T> | Array<ISource<T>>, options: IOptions<T>);
    scrollTo(position: number): Promise<void>;
    forceUpdate(): void;
    inPlaceUpdate(): void;
    update(disableRender?: boolean): void;
    destroy(): void;
    updatePreservedSpace(preserved: {
        top: number;
        bottom: number;
    }): void;
    cleanScreen(name?: string): IRunway<T>;
    checkout(name: string, disableRender?: boolean): Promise<void>;
    addRunway(source: ISource<T>): void;
    resetRunway(name?: string): void;
    getScrollTop(): number;
    getCurrentRunway(): IRunway<T>;
    protected onScroll(): void;
    protected onResize(): void;
    protected fill(start: number, end: number): void;
    protected attachContent(start: number, end: number): void;
    protected freeUnusedNodes(start: number, end?: number, force?: boolean): void;
    protected freeNodesFromStart(start: number, end: number): void;
    protected freeNodesFromEnd(start: number, end: number): void;
    protected freeNode(index: number, runway: IRunway<T>): void;
    protected setSentinelPosition(): void;
    protected setNodesStyles(nodes: IChangedNodes): void;
    protected getFirstScreenItem(initialAnchorItem: number, scrollTop: number): number;
    protected getLastScreenItem(initialAnchorItem: number, scrollTop: number): number;
    protected getRunway(): IRunway<T>;
    protected getRunwayMaxScrollTop(): number;
    protected getMaxScrollHeight(): number;
    protected maybeLoadMore(end: number): Promise<void>;
    protected getRenderer(index: number): IRenderer<T>;
    protected initRunways(sources: ISource<T> | Array<ISource<T>>): void;
    protected static getDefaultRunwayKey<U>(sources: ISource<U> | Array<ISource<U>>): string;
    protected static getInitialRunway<U>(source: ISource<U>): IRunway<U>;
    protected static removeScreenNodes<U>(runway: IRunway<U>): void;
}
declare abstract class Source<T> implements ISource<T> {
    abstract key: string;
    abstract getHeight(index: number, recycler: IRecycler<T>): number;
    abstract getWidth(index: number, recycler: IRecycler<T>): string;
    abstract getData(index: number, recycler: IRecycler<T>): T;
    abstract getLength(recycler: IRecycler<T>): number;
    abstract getScrollTop(index: number, recycler: IRecycler<T>): number;
    abstract getMaxScrollHeight(recycler: IRecycler<T>): number;
}
declare abstract class Renderer<T> implements IRenderer<T> {
    protected queue: IQueue;
    render(data: T, recycler: IRecycler<T>): HTMLElement;
    abstract update(el: HTMLElement, data: T, recycler: IRecycler<T>): void;
    abstract createElement(data?: T): HTMLElement;
    release(el: HTMLElement, recycler: IRecycler<T>): void;
    releaseAll(recycler: IRecycler<T>): void;
    clear(recycler: IRecycler<T>): void;
    protected mapUsing(fn: (el: HTMLElement) => void): void;
}
declare class LazyLoader {
    static DEFAULT_PLACEHOLDER: string;
    private readonly elementsInfo;
    private readonly speedThreshold;
    private readonly placeholders;
    constructor(options?: ILazyLoaderOptions);
    mount(recycler: IRecycler<any>): void;
    update(el: IHTMLElement, binding: IBinding): void;
    protected flush(): void;
    private getElementInfo;
    private static setSrc;
    private static attemptCancel;
}
export { Recycler, Source, Renderer, LazyLoader, IRecycler, ISource, IRenderer };
