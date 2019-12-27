# recycler-view

recycler 提供一个高性能、高度定制、Dom 元素可复用的滚动列表。主要包括三个部分，Recycler（核心控制）、Source（数据源）、Renderer（渲染器）。使用时需注意以下几点：

1. 滚动列表里的每一个项目高度必须是已知的，且单位只能是 px；可以动态改变，下文会介绍如何改变。
2. 滚动列表里的每一个项目的 scrollTop 必须是已知的；可动态改变，一般会跟随高度改变而改变。
3. Recycler 并不实现 Dom 复用，该逻辑在 Renderer 中实现，这部分下文会做介绍。
4. 图片列表最好搭配 LazyLoader 一起使用，否则可能会有大片白屏。
5. Renderer 可以搭配任何框架，但是推荐使用原生 js 进行 Dom 创建和变更，一般框架使用的 Virtual Dom 在这样的场景下比较损耗性能。
6. 性能瓶颈大概率出现在 Renderer 上，所以请小心控制您的 Renderer 渲染时间，包括 js 执行和 layout、paint、compute style 等步骤所消耗时间。

## 基本概念

**项目：** 以下简称称滚动列表里的每一个滚动项目为「项目」

**渲染范围：** 由当前的 scrollTop 和各项目高度计算得出，当前应渲染 n~m 的项目，并放在对应的位置。

## 基本用法

你需要实现 Source 类和 Renderer 类，源码提供了它们的抽象类，可以直接继承；当然也可以重新实现，只要暴露必须的接口就行。

最后实例化 Recycler，传入自行实现的 Source 实例和 Renderer 实例。

**NOTE:  renderer 可以在 Recycler 第三个参数 options 中提供，也可以在 Source 的 getRenderer() 方法中返回，两者至少要提供一个。**

```html
<style>
  #scroller, #container {
    position: relative;
  }
</style>

<div id="scroller">
  <div id="container"></div>
</div>
```

```typescript
import { Recycler, Source, Renderer } from 'recycler';

declare type DataType = number;

const data: DataType[] = [1, 2, 3, 4, 5];

// 继承 Renderer 抽象类，实现 MyRenderer 类
class MyRenderer extends Renderer<DataType> {
  public createElement(data?: DataType): HTMLElement {
    return document.createElement('div');
  }
  
  public update(el: HTMLElement, data: DataType): HTMLElement {
    el.textContent = data;
    return el;
  }
}

// 继承 Source 抽象类，实现 MySource 类
class MySource extends Source<DataType> {
  private renderer: MyRenderer = new MyRenderer(); // 此项根据需要决定是否提供
  
  public getWidth(index: number): string {
    return '100%';
  }
  
  public getHeight(index: number): number {
    return 100;
  }
  
  public getScrollTop(index: number): number {
    return Math.max(index - 1, 0) * this.getHeight();
  }
  
  public getMaxScrollHeight(): number {
    return this.getLength() * this.getHeight();
  }
  
  public getLength(): number {
    return data.length;
  }
  
  public getData(index: number): DataType {
    return data[index];
  }
  
  // 此方法可以没有，如果没有，在 Recycler Options 中就必须提供
  public getRenderer(index: number): MyRenderer {
    return this.renderer;
  }
  
  // 此方法可以没有，如果没有就不会尝试加载更多
  public fetch(): Promise<boolean> {
    const newData = [1, 2, 3, 4, 5];
    data = data.concat(newData);
    return Promise.resolve(true);
  }
}

// 绑定 scroller、Source 和 Renderer，启动监听和视图更新
const recycler = new Recycler<DataType>(
  document.getElementById('scroller'),
  new MySource(),
  { 
    container: document.getElementById('container'),
    renderer: new MyRenderer() // 此项可以没有，如果没有，在 Renderer 中就必须实现 getRenderer 方法
  }
);
```

## Recycler

核心模块，决定渲染范围、调用用户实现的 release 方法释放 Dom 元素、提供几种视图更新方法。

```javascript
const recycler = new Recycler(scroller: HTMLElement, sources: ISource | ISource[], options?: IOptions);
```

<h3>1. runway</h3>

runway 代表一个数据源（source）所创建出的滚动列表，它包含该列表目前的状态，比如目前的 scrollTop、在屏幕上首个项目在所有项目中的 index、数据源、屏幕上的节点集合等信息。

一个 recycler 可以包含多个 runway，可由 recycler 创建时传入的 sources 数组自动创建，也可在 recycler 创建后调用 recycler.addRunway(source) 动态添加。调用 recycler.switchRunway(key) 可切换当前 runway，即在屏幕上渲染另外一组视图

switchRunway(key: string)：key 由 source 中的 key 字段指定。若由 sources 数组创建，且 source 不包含 key 字段，则会根据 source 在 sources 数组中的位置确定 key 值；若由 addRunway(source: ISource) 创建，且 source 不包含 key 字段，则把当前 runways.length + 1 作为此 runway 的 key 值

<h3>2. 参数说明</h3>
<h3>scroller</h3>

滚动容器节点，HTMLElement 实例

<h3>sources</h3>

数据源（详细信息见下文 Source 模块）。可为 Source 实例或一个每一项都为 Source 实例的数组。

如果该参数为数组，则会根据该数组创建多个 runway，用户可以根据 source 中提供的 key 自由切换 runway；若未提供 key，则会以其在数组中的位置自动生成 key

<h3>options</h3>

一些可选项目

|         Name         |    Type     | Default  | Description                                                  |
| :------------------: | :---------: | :------: | ------------------------------------------------------------ |
|      container?      | HTMLElement | Scroller | 项目容器，如果不指定，默认在 scroller 下创建一个 div 作为 container |
|    topPreserved?     |   number    |    0     | scroller 顶部预留高度，即在 scroller 顶部和 container 顶部之间的距离。此处可以规划一些顶部常驻内容 |
|   bottomPreserved?   |   number    |    0     | scroller 底部预留高度，即在 scroller 底部和 container 底部之间的距离。此处可规划一些常驻内容，例如「加载更多」的 loading |
|     runwayItems?     |   number    |    5    | 滚动方向上预加载的项目个数，此值越大越不容易白屏             |
| runwayItemsOpposite? |   number    |    2     | 滚动反方向上保留的项目个数                                   |
|      threshold?      |   number    |    5     | 滚动方向上还有多少项目未加载出来时触发 fetch                 |
| enableAcceleration?  |   boolean   |  false   | 是否启用硬件加速，启用后每一个项目是一个图层                 |
|    handleResize?     |   boolean   |  false   | 是否处理浏览器窗口 resize 事件。如果为 true，则会在 window 上监听 resize 事件，每次触发会调用 forceUpdate |
|      renderer?       |  IRenderer  |   null   | 默认渲染器，如果 source.getRenderer 不存在或返回空，则会使用此 renderer 进行渲染 |

<h3>3.属性与方法</h3>

|         Name         |                        Type                        | Default | Description                                                  |
| :------------------: | :------------------------------------------------: | :-----: | ------------------------------------------------------------ |
|       scroller       |               Window \| HTMLElement                |  null   | 滚动容器，可以是 window 或位于 body 之内的 Dom 节点          |
|      container       |                    HTMLElement                     |  null   | 项目容器，如果 scroller === window，则该项为 body            |
|    isForceUpdate     |                      boolean                       |  false  | 当前是否为强制渲染                                           |
|   isInPlaceUpdate    |                      boolean                       |  false  | 当前是否为原地渲染                                           |
|    isResizeUpdate    |                      boolean                       |  false  | 当前是否处于 window.resize 触发的渲染中                      |
|     topPreserved     |                       number                       |    0    | 顶部预留空间，单位 px                                        |
|   bottomPreserved    |                       number                       |    0    | 底部预留空间，单位 px                                        |
|     runwayItems      |                       number                       |   10    | 滚动方向上预渲染项目个数                                     |
| runwayItemsOpposite  |                       number                       |    5    | 滚动反方向上保留的项目个数                                   |
|      threshold       |                       number                       |    3    | 启动 loadMore 的阈值                                         |
|       scrollTo       |             (position: number) => void             |         | 滚动到 position 位置，position 的单位是 px                   |
|        update        |         (disableRender?: boolean) => void          |         | 更新视图                                                     |
|     forceUpdate      |                     () => void                     |         | 强制更新视图                                                 |
|    inPlaceUpdate     |                     () => void                     |         | 原地更新视图                                                 |
|       destroy        |                     () => void                     |         | 销毁 Recycler 实例，这里不会销毁 Source 与 Renderer，请自行销毁 |
| updatePreservedSpace | (preserved: {top: number, bottom: number}) => void |         | 更新预留空间。预留空间推荐用这个方法进行更新，因为有一些后置动作需要处理 |
|     cleanScreen      |                     () => void                     |         | 清屏。移除屏幕上所有节点，并调用 renderer.release 释放它们   |
|     switchRunway     |  (name: string, disableRender?: boolean) => void   |         | 切换 runway                                                  |
|      addRunway       |              (source: Source) => void              |         | 增加一个 runway                                              |
|     resetRunway      |              (name?: string) => void               |         | 重置 runway。如果 name 为空，则重置当前正在使用的 runway     |
|     getScrollTop     |                    () => number                    |         | 获取 scroller 的真实 scrollTop                               |
|   getCurrentRunway   |                    () => Runway                    |         | 获取当前正在使用的 runway 的副本                             |



<h3>4. 事件</h3>

Recycler 继承了一个轻量的 EventEmitter，向外派发了一些事件

```javascript
const recycler = new Recycler();

recycler.on(Recycler.Events.Initialized, (recycler: IRecycler) => {});
recycler.on(Recycler.Events.RunwaySwitched, (recycler: IRecycler) => {});
recycler.on(Recycler.Events.Resized, (recycler: IRecycler) => {});
recycler.on(Recycler.Events.Scrolling, (recycler: IRecycler, delta: number) => {});
recycler.on(Recycler.Events.ScrollAtStart, (recycler: IRecycler) => {});
recycler.on(Recycler.Events.ScrollAtEnd, (recycler: IRecycler) => {});
recycler.on(Recycler.Events.Update, (recycler: IRecycler, disableRenderer: boolean) => {});
```

|      Name      |    opportunity     | Description                                                  |
| :------------: | :----------------: | ------------------------------------------------------------ |
|  Initialized   |      初始化时      | 只会触发一次                                                 |
| RunwaySwitched |   切换 runway 时   | 每次调用 switchRunway 时触发，在视图更新之后触发             |
|    Resized     |  浏览器窗口变化时  | 如果 handleReize===true，则在 window.resize 时触发           |
|   Scrolling    |   滚动过程中触发   | delta 参数为本次触发与上次触发之间滚动的距离，可以近似看成滚动速度 |
| ScrollAtStart  |  滚动到顶部时触发  |                                                              |
|  ScrollAtEnd   |  滚动到底部时触发  |                                                              |
|     Update     | 调用 update 时触发 | 在视图更新之前触发，disalbeRenderer 代表本次更新是否进行渲染 |

## Source

数据源，提供 **项目渲染所需数据** 和 **项目的几何信息**

|        Name        |                             Type                             | Description                                                  |
| :----------------: | :----------------------------------------------------------: | :----------------------------------------------------------- |
|        key?        |                            string                            | 数据源标识，可用于切换视图                                   |
|     getHeight      |        (index: number, recycler: IRecycler) => number        | 获取第 index 个项目的高度                                    |
|      getWidth      |        (index: number, recycler: IRecycler) => string        | 获取第 index 个项目的宽度，返回 css 单位，比如 '100%'        |
|     getLength      |               (recycler: IRecycler) => number                | 获取数据总长度                                               |
| getMaxScrollHeight |               (recycler: IRecycler) => number                | 获取最大滚动高度，仅包含滚动项目                             |
|    getScrollTop    |        (index: number, recycler: IRecycler) => number        | 获取第 index 个项目到项目容器顶端的距离                      |
|      getData       |         (Index: number, recycler: IRecycler) => any          | 获取第 index 个项目所需的数据，返回任意值                    |
|    getRenderer?    |      (Index: number, recycler: IRecycler) => IRenderer       | 获取第 index 个项目所需的 renderer                           |
|       fetch?       |          (Recycler: IRecycler) => Promise<boolean>           | 获取更多数据，如果返回 false，代表没有新数据；如果返回 true，则代表有新数据加入，Recycler会更新视图 |
|     getOffset?     | (index: number, recycler: IRecycler) => {x: string, y: number} | 获取第 index 个项目与原位置的偏移，体现在 transform 中       |
|     getColumn?     |        (index: number, recycler: IRecycler) => number        | 获取第 index 个项目所处的列数，这个值会被设置在 项目的 data-column 上，可以做一些 css 操作 |
|       clean?       |                 (recycler: Recycler) => void                 | 清空缓存（比如 scrollTop 的缓存）                            |
|      refresh?      |           (recycler: Recycler) => Promise<boolean>           | 重新获取数据（从第一页开始）                                 |
|       mount?       |                (recycler: IRecycler) => void                 | Recycler 初始化时会调用此方法，在这里可以做一些初始化工作    |

## Renderer

渲染器，用于项目创建和更新

|    Name     |                             Type                             | Description                                                  |
| :---------: | :----------------------------------------------------------: | ------------------------------------------------------------ |
|   render    |        (data: any, recycler: Recycler) => HTMLElement        | 根据 data 创建或更新 Dom 元素，最后返回一个 Dom 节点         |
|   update    | (el: HTMLElement, data: any, recycler: Recycler) => HTMLElement | 根据 data 更新传入的 el 元素，并把更新后的 el 返回           |
|  release?   |        (el: HTMLElement, recycler: Recycler) => void         | 该方法被调用时说明 el 已在渲染范围之外，需要被释放，用户可选择从 Dom 树种删除或不删除；不删除直接复用效率会更高 |
| releaseAll? |                 (recycler: Recycler) => void                 | 释放所有正在使用中的节点                                     |
|   clear?    |                 (Recycler: Recycler) => void                 | 释放并把所有节点从 Dom 树中删除                              |

## Dom 复用

源码中提供了 Renderer 的抽象类，该类实现了render、release、releaseAll、clear 函数，createElement 和 update 需由用户来实现。而 Dom 复用的其中一个要点就在 render 中。下面介绍 render 如何实现 Dom 复用。

```typescript
/* at Renderer.ts */

// 这里贴出一部分关于 Renderer 抽象类的源码，以便对照

interface IQueue {
  unused: HTMLElement[];
  using: Set<HTMLElement>
}

abstract class Renderer<T> {
  // 该对象包含 using（使用中的节点）和 unused（未在使用中的节点）
  protected queue: IQueue = {
    unused: [],
    using: new Set()
  };
  
  // 释放使用中的节点
  public release(el: HTMLElement, recycler: Recycler): void {
    this.queue.using.delete(el);
    this.queue.unused.push(el);
  }
  
  // 渲染函数
  public render(data: T, recycler: Recycler): HTMLElement {
    // 从 queue.unused 中弹出一个节点
    let el = this.queue.unused.pop();
    
    // 如果 el 不存在则创建一个新的节点。createNewElement 自行实现，返回一个 HTMLElement
    if (!el) {
      el = this.createNewElement(data);
    }
    
    // 无论是刚创建的元素还是原来就有的元素，都走 update 更新
    this.update(el, data, recycler);
    
    // 向 queue.using 中添加一个节点
    this.queue.using.add(el);
    
    // 返回节点
    return el;
  }
  
  // createElement 抽象方法
  public abstract createElement(data?: T): HTMLElement;
  
  // update 抽象方法
  public abstract update(el: HTMLElement, data: T, recycler: IRecycler): HTMLElement;
}
```

```typescript
/* at MyRenderer.ts */

// 继承 Renderer 抽象类，并实现 createElement 和 update 方法
class MyRenderer extends Renderer<MyDataType> {
  // 创建新节点，这里推荐创建的节点与 data 无关
  // 只创建一个架子，接下来由 update 方法更新视图，这样不用写重复逻辑，速度也快
  public createElement(data?: MyDataType) {
    const el = document.createElement('div');
    
    el.innerHTML = '....';
    
    return el;
  }
  
  public update(el: HTMLElement, data: MyDataType, recycler: Recycler) {
    // Do some udpate to el...
    return el;
  }
  
  // 这里可以根据需要改造，比如移除 el 节点
  @Override
  public release(el: HTMLElement, recycler: Recycler) {
    super.release(el, recycler);
    
    el.remove(); // 把 el 从 Dom 树中移除
  }
}
```

上面的代码实现了一种 Dom 复用的方式，即使用原生 js 创建和更新节点，直接复用节点。如果想要使用框架也没问题，这里以 Vue 举个例子。

```typescript
import MyComponent from 'my-component';

class MyRenderer extends Renderer<MyDataType> {
  public createElement(data?: MyDataType): HTMLElement {
    // 创建 Vue 实例
    const vm = new Vue(MyComponent);

    // 把 Vue 实例绑定到真实 Dom 元素上
    vm.$el.vm = vm;
    
    // 返回真实 Dom 元素
    return vm.$el;
  }
  
  public update(el: HTMLElement, data: MyDataType, recycler: Recycler): HTMLElement {
    // 拿到绑定在真实 Dom 元素上的 Vue 实例，并更新
    Object.assign(el.vm.props, data);
    
    // 返回更新后的 Dom 元素
    return el;
  }
}
```

上面代码使用了一些骚操作，达到复用 Vue 实例的目的。但是一来更新的时候需要做 diff，所以 Virtual Dom 更新视图肯定比手动更新慢（除非手动更新时做了很多触发回流的操作，比如反复读取几何属性等）；二来在滚动场景下性能十分重要，特别是在中低端移动设备上，cpu 性能不足。所以并不推荐使用框架进行渲染。

另外，如果有特殊需要，可以自行实现 Renderer 类，只要暴露必须的接口即可，接口定义在 src/interfaces/recycler#IRenderer

## 视图更新方法

**onScroll：** 最普通的更新，即在滚动过程中对视图的更新，释放**渲染范围**之外的元素，并且只重新渲染这些释放了的元素

**update：** 直接更新。会更新 sentinal 的位置，并调用一次 onScroll

**forceUpdate：** 强制更新。调用一次 update，但不同点在于现存屏幕上的元素都会被释放，并重新渲染

**inPlaceUpdate：** 原地更新。不走 onScroll，而是直接对缓存中屏幕上的元素重新渲染。也就是说不会计算**渲染范围**，直接对当前已经计算出的 **渲染范围** 内的所有元素做一次重新渲染

**特殊更新 resize：** 由 window.resize 触发的视图更新，内部调用 forceUpdate。触发时会把 recycler.isResizeUpdate 置为 true，render 函数可以判断这个值，对于图片就不需要做懒加载了

## 动态改变项目高度

假设有这样的场景，项目高度是随滚动容器的宽度变化而变化，这时确实需要动态改变项目高度

基本方案是监听滚动容器宽度的变化，在变化时变更 source.getHeight 方法的依赖，然后调用一次 **forceUpdate**

```typescript
let ratio = 1;

window.onresize = function() {
  ratio = window.innerWidth / 375;
  recycler.forceUpdate();
}

class MySource extends Source {
  getHeight(index: number): number {
    return ratio * 100;
  }
  
  getScrollTop(index: number): number {
    return this.getHeight() * index;
  }
}
```

具体如何做根据需求而定，这里只给出思路

## 几种列表效果的实现

**项目高度一致，n 列**

```typescript
const columns = 3;

class MySource extends Source<MyDataType> {
  private columns: number = columns;
  private width: number = 1 / columns * 100 + '%';
  
  public getHeight(index: number): number {
    return 100;
  }
  
  public getWidth(): number {
    return this.width;
  }
  
  public getScrollTop(index: number): number {
    return this.getHeight() * Math.floor(index / this.columns);
  }
}
```

**项目高度不一致，n 列（瀑布流）**

```typescript
// 首先我们需要每一项的高度，这个值在实际项目中需要想办法知道

let ratio = 1;

window.onresize = function() {
  ratio = window.innerWidth / 375;
}

class MySource extends Source<MyDataType> {
  // 缓存每一项的 scrollTop
  private scrollTopCollector: number[] = [];
  private columns: number = 3;
  
  public getData(index: number): MyDataType {
    return {}
  }
  
  public getHeight(index: number): number {
    // 这里乘一个系数，用于动态改变高度
    return ((this.getData(index) || {}).height || 0) * ratio;
  }
  
  public getScrollTop(index: number): number {
    // 这里乘一个系数，用于动态改变高度时，scrollTop 也要跟着变
    return (this.scrollTopCollector[index] || 0) * ratio;
  }
  
  // 此方法向 scrollTopCollector 中添加新的 scrollTop 缓存
  private collectScrollTop(/*新增数据的长度*/newDataLength: number) {
    const collector = this.scrollTopCollector;
    
    for (let i = 0;i < newDataLength;i++) {
      const topItemIndex = collector.length - this.columns;
      const topItemHeight = this.getHeight(topItemIndex);
      const topItemScrollTop = this.getScrollTop(topItemIndex);
      
      collector.push(topItemScrollTop + topItemHeight);
    }
  }
}
```

上面瀑布流的实现存在问题，没有自适应填充，可能造成某一列很长，下面是自适应实现

```typescript
let ratio = 1;
const columns = 3;

window.onresize = function() {
  ratio = window.innerWidth / 375;
}

class MySource extends Source<MyDataType> {
  // 缓存每一项的 scrollHeight 和 column（处于第几列）
  private positions: {scrollHeight: number, column: number}[] = [];
  // 当前 n 列，每列最大 scrollHeight 集合
  private maxScrollHeightOfPerColumn: number[] = (new Array(co)).fill(0);
  // 列数
  private columns: number = columns;
  
  public getData(index: number): MyDataType {
    return {
      height: (index % 5 + 1) * 30
    }
  }
  
  public getHeight(index: number): number {
    // 这里乘一个系数，用于动态改变高度
    return ((this.getData(index) || {}).height || 0) * ratio;
  }
  
  // 宽度假设为平均分配
  public getWidth(): string {
    return 1 / this.columns * 100 + '%';
  }
  
  // 这里获取 x 方向偏移
  public getOffset(index: number): {x: string, y: number} {
    const position = this.positions[index];
    const x = position.column / this.columns * 100;
    
    return {
      x: x > 0 ? x + '%' : x + '',
      y: 0
    }
  }
  
  public getScrollTop(index: number): number {
    // 这里乘一个系数，用于动态改变高度时，scrollTop 也要跟着变
    // 之所以要减掉一个 height 是因为缓存的是 scrollHeight，包括了元素本身的高度
    return (this.position[index].scrollHeight - this.getData(index).height) * ratio;
  }
  
  // 此方法向 positions 中添加新的 position 缓存
  // 由于循环体中使用了 indexOf 和 Math.min，因此每次添加的 data 不宜过多
  private collectPositions(/*新增的数据*/datas: MyDataType[]) {
    const maxScrollHeightOfPerColumn = this.maxScrollHeightOfPerColumn;
    const length = datas.length;
    
    for (let i = 0;i < length;i++) {
      const minScrollHeight = Math.min(...maxScrollHeightOfPerColumn);
      const index = maxScrollHeightOfPerColumn.indexOf(minScrollHeight);
      const scrollHeight = minScrollHeight + datas[i].height;
      
      this.positions.push({
        scrollHeight,
        column: index
      });
      
      maxScrollHeightOfPerColumn[index] = scrollHeight;
    }
  }
}
```

## 结语

Recycler 搭配不同的 Source 和 Renderer 可以实现多种效果。目前作者也在探索和改进中，下一步目标是省略 height 和 scrollTop，让使用更加方便（虽然毫无头绪）
