'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function makeMessage(message) {
    return "[ recycler ] " + message;
}
function log(message, method) {
    return method(makeMessage(message));
}
function error(message, Error) {
    return new Error(makeMessage(message));
}
var logger = {
    info: function (message) {
        // tslint:disable-next-line
        return log(message, console.info);
    },
    error: function (message) {
        // tslint:disable-next-line
        return log(message, console.error);
    }
};
var Exceptions = {
    Error: function (message) {
        return error(message, Error);
    },
    TypeError: function (message) {
        return error(message, TypeError);
    }
};
function isElementNode(target) {
    return target instanceof HTMLElement && target.nodeType === Node.ELEMENT_NODE;
}
function execute(fn, defaultReturn) {
    try {
        return fn();
    }
    catch (e) {
        return defaultReturn;
    }
}
function throttle(fn, threshold) {
    if (threshold === void 0) { threshold = 200; }
    var lastExecTime = Date.now();
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
        if (now - lastExecTime > threshold) {
            lastExecTime = now;
            fn.apply(void 0, __spread(args));
        }
    };
}
function loadImage(src) {
    var el = new Image();
    var promise = new Promise(function (resolve, reject) {
        el.onload = function () {
            delete promise.cancel;
            resolve();
        };
        el.onerror = function (err) {
            delete promise.cancel;
            reject(err);
        };
        el.src = src;
    });
    promise.cancel = function () {
        el.onerror('canceled');
        el.onerror = null;
        el.onload = null;
        el.src = '';
    };
    return promise;
}
function getAnimationEndEventName() {
    var $el = document.createElement('div');
    if ($el.style.animation !== undefined) {
        return 'animationend';
    }
    if ($el.style.webkitAnimation !== undefined) {
        return 'webkitAnimationEnd';
    }
    return 'animationend';
}
function getRAFExecutor() {
    return requestAnimationFrame || webkitRequestAnimationFrame || setTimeout;
}

var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (key, handler) {
        if (this.events[key]) {
            this.events[key].push(handler);
        }
        else {
            this.events[key] = [handler];
        }
        return this;
    };
    EventEmitter.prototype.emit = function (key) {
        var e_1, _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handlers = this.events[key];
        if (!handlers) {
            return this;
        }
        try {
            for (var handlers_1 = __values(handlers), handlers_1_1 = handlers_1.next(); !handlers_1_1.done; handlers_1_1 = handlers_1.next()) {
                var handler = handlers_1_1.value;
                try {
                    handler.apply(void 0, __spread(args));
                }
                catch (e) {
                    logger.error(e.stack);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (handlers_1_1 && !handlers_1_1.done && (_a = handlers_1.return)) _a.call(handlers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    EventEmitter.prototype.off = function () {
        var e_2, _a;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        if (!keys || keys.length === 0) {
            this.events = {};
            return this;
        }
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                delete this.events[key];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this;
    };
    return EventEmitter;
}());

var ScrollerOperations = /** @class */ (function () {
    function ScrollerOperations(target) {
        this.target = target;
        this.window = window;
        this.document = document;
        if (target === this.window) {
            this.isWindow = true;
        }
        else if (isElementNode(target)) {
            this.isWindow = false;
        }
        else {
            throw Exceptions.TypeError('target must be window or an ElementNode');
        }
    }
    ScrollerOperations.prototype.isScrollerValid = function () {
        return this.isWindow || this.hasAncestor(this.target, this.document.body);
    };
    ScrollerOperations.prototype.appendChild = function (el) {
        if (this.isWindow) {
            return this.document.body.appendChild(el);
        }
        return this.target.appendChild(el);
    };
    ScrollerOperations.prototype.removeChild = function (el) {
        try {
            if (this.isWindow) {
                return this.document.body.removeChild(el);
            }
            return this.target.removeChild(el);
        }
        catch (e) {
            // keep silence
        }
    };
    ScrollerOperations.prototype.scrollTo = function (position) {
        if (this.isWindow) {
            return this.window.scrollTo(0, position);
        }
        this.target.scrollTop = position;
    };
    ScrollerOperations.prototype.getOffsetHeight = function () {
        if (this.isWindow) {
            return this.document.body.offsetHeight;
        }
        return this.target.offsetHeight;
    };
    ScrollerOperations.prototype.getScrollTop = function () {
        if (this.isWindow) {
            return this.window.pageYOffset;
        }
        return this.target.scrollTop;
    };
    ScrollerOperations.prototype.getElement = function () {
        if (this.isWindow) {
            return this.document.body;
        }
        return this.target;
    };
    ScrollerOperations.prototype.hasAncestor = function (target, refer) {
        if (target.parentNode && target.parentNode !== refer) {
            return this.hasAncestor(target.parentNode, refer);
        }
        return !!target.parentNode;
    };
    return ScrollerOperations;
}());

var requestAnimationFrame$1 = getRAFExecutor();
var Listener = /** @class */ (function () {
    function Listener(target) {
        this.target = target;
        this.listened = false;
        this.ticking = false;
        this.handlers = [];
        this.handler = this.handler.bind(this);
    }
    Listener.prototype.on = function (fn) {
        this.handlers.push(fn);
        if (!this.listened) {
            this.bind(this.handler);
            this.listened = true;
        }
    };
    Listener.prototype.off = function () {
        this.listened && this.unbind(this.handler);
    };
    Listener.prototype.destroy = function () {
        this.off();
        this.handlers = [];
    };
    Listener.prototype.handler = function (e) {
        var _this = this;
        if (!this.ticking) {
            requestAnimationFrame$1(function () {
                var e_1, _a;
                try {
                    try {
                        for (var _b = __values(_this.handlers), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var handler = _c.value;
                            handler(e);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                catch (e) {
                    // keep silence
                }
                finally {
                    _this.ticking = false;
                }
            });
            this.ticking = true;
        }
    };
    Listener.prototype.bind = function (fn) {
        this.getScrollEventTarget().addEventListener(this.eventType, fn);
    };
    Listener.prototype.unbind = function (fn) {
        this.getScrollEventTarget().removeEventListener(this.eventType, fn);
    };
    return Listener;
}());

var ScrollListener = /** @class */ (function (_super) {
    __extends(ScrollListener, _super);
    function ScrollListener(target) {
        var _this = _super.call(this, target) || this;
        _this.eventType = 'scroll';
        return _this;
    }
    ScrollListener.prototype.getScrollEventTarget = function () {
        return this.target;
    };
    return ScrollListener;
}(Listener));

var ResizeListener = /** @class */ (function (_super) {
    __extends(ResizeListener, _super);
    function ResizeListener(target) {
        if (target === void 0) { target = window; }
        var _this = _super.call(this, target) || this;
        _this.eventType = 'resize';
        return _this;
    }
    ResizeListener.prototype.getScrollEventTarget = function () {
        return window;
    };
    return ResizeListener;
}(Listener));

var RecyclerEvents;
(function (RecyclerEvents) {
    RecyclerEvents["Initialized"] = "Initialized";
    RecyclerEvents["RunwaySwitched"] = "RunwaySwitched";
    RecyclerEvents["Resized"] = "Resized";
    RecyclerEvents["Scrolling"] = "Scrolling";
    RecyclerEvents["ScrollAtStart"] = "ScrollAtStart";
    RecyclerEvents["ScrollAtEnd"] = "ScrollAtEnd";
    RecyclerEvents["Update"] = "Update";
})(RecyclerEvents || (RecyclerEvents = {}));

var Recycler = /** @class */ (function (_super) {
    __extends(Recycler, _super);
    function Recycler(scroller, sources, options) {
        var e_1, _a;
        var _this = _super.call(this) || this;
        _this.isForceUpdate = false;
        _this.isInPlaceUpdate = false;
        _this.isResizeUpdate = false;
        // 初始化统一 scroller 操作接口
        _this.scrollerOperations = new ScrollerOperations(scroller);
        if (!_this.scrollerOperations.isScrollerValid()) {
            throw Exceptions.TypeError('Invalid scroller, must be window or inside document.body');
        }
        // 滚动容器
        _this.scroller = scroller;
        _this.scrollerHeight = _this.scrollerOperations.getOffsetHeight();
        // 默认渲染器
        _this.renderer = options.renderer;
        // 容纳元素的容器
        _this.container = options.container || _this.scrollerOperations.getElement();
        // 顶部和底部预留空间
        _this.topPreserved = Math.max(options.topPreserved || 0, 0);
        _this.bottomPreserved = Math.max(options.bottomPreserved || 0, 0);
        // 滚动正反方向预渲染元素个数
        _this.runwayItems = options.runwayItems || 5;
        _this.runwayItemsOpposite = options.runwayItemsOpposite || 2;
        // 距离底部多少个元素时触发加载更多
        _this.threshold = options.threshold || 5;
        // 允许多个实例，可以在实例之间切换（为了能在同一个 scroller 中切换不同的内容，比如搜索结果和原列表之间切换）
        _this.initRunways(sources);
        _this.activatedRunway = Recycler.getDefaultRunwayKey(sources);
        // 初始化 Dom 事件监听器
        _this.scrollListener = new ScrollListener(_this.scroller);
        _this.resizeListener = new ResizeListener();
        // 撑开滚动容器
        _this.sentinel = document.createElement('div');
        _this.sentinel.style.position = 'absolute';
        _this.sentinel.style.width = '1px';
        _this.sentinel.style.height = '1px';
        _this.scrollerOperations.appendChild(_this.sentinel);
        // 根据是否启用硬件加速选择模板
        if (options.enableAcceleration) {
            _this.transformTemplate = function (x, y) { return "translate3d(" + x + ", " + y + "px, 0)"; };
        }
        else {
            _this.transformTemplate = function (x, y) { return "translate(" + x + ", " + y + "px)"; };
        }
        // 初始化 container position style
        if (window.getComputedStyle(_this.container).position === 'static') {
            _this.container.style.position = 'relative';
        }
        // 初始化哨兵位置
        _this.setSentinelPosition();
        // 监听事件，根据 scroller 需要不同的监听方式
        _this.scrollListener.on(_this.onScroll.bind(_this));
        if (options.handleWindowResize) {
            _this.resizeListener.on(_this.onResize.bind(_this));
        }
        var _loop_1 = function (runway) {
            execute(function () { return runway.source.mount(_this); });
        };
        try {
            // 遍历 runways，并调用对应的 source.mount() 方法，可以在此监听一些事件（比如配置 lazyload）
            for (var _b = __values(Object.entries(_this.runways)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), runway = _d[1];
                _loop_1(runway);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // 渲染视图（如果 sources 不为空的话）
        if (_this.getRunway().source.getLength(_this) > 0) {
            _this.update();
        }
        // 调用 onInitialized
        Promise.resolve().then(function () {
            _this.emit(Recycler.Events.Initialized, _this);
        });
        return _this;
    }
    Recycler.prototype.scrollTo = function (position) {
        var _this = this;
        var maxScrollTop = this.getRunwayMaxScrollTop();
        if (position > maxScrollTop) {
            position = maxScrollTop;
        }
        this.scrollerOperations.scrollTo(position);
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(_this.update()); });
        });
    };
    Recycler.prototype.forceUpdate = function () {
        try {
            this.isForceUpdate = true;
            this.update();
        }
        catch (err) {
            throw err;
        }
        finally {
            this.isForceUpdate = false;
        }
    };
    Recycler.prototype.inPlaceUpdate = function () {
        var e_2, _a;
        try {
            var runway = this.getRunway();
            this.isInPlaceUpdate = true;
            try {
                for (var _b = __values(Object.entries(runway.nodes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), i = _d[0], $el = _d[1];
                    var index = Number(i);
                    var renderer = this.getRenderer(index);
                    var data = runway.source.getData(index, this);
                    renderer.update($el, data, this);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            this.isInPlaceUpdate = false;
        }
    };
    Recycler.prototype.update = function (disableRender) {
        this.scrollerHeight = this.scrollerOperations.getOffsetHeight();
        this.getRunway().runwayMaxScrollTop = this.getRunwayMaxScrollTop();
        this.setSentinelPosition();
        this.emit(Recycler.Events.Update, this, disableRender);
        !disableRender && this.onScroll();
    };
    Recycler.prototype.destroy = function () {
        this.scrollListener.destroy();
        this.resizeListener.destroy();
        this.cleanScreen();
        this.scrollerOperations.removeChild(this.sentinel);
        this.scrollerOperations.scrollTo(0);
        this.runways = null;
    };
    Recycler.prototype.updatePreservedSpace = function (preserved) {
        var top = preserved.top, bottom = preserved.bottom;
        top != null && (this.topPreserved = top);
        bottom != null && (this.bottomPreserved = bottom);
        this.update();
    };
    Recycler.prototype.cleanScreen = function (name) {
        var runway = this.runways[name] || this.getRunway();
        // 从屏幕上移除所有元素
        Recycler.removeScreenNodes(runway);
        // 清屏时，我们需要释放所有在屏幕上的元素
        // 根据 freeUnusedNodes 的逻辑，当 start > runway.lastAttachedItem 时释放所有位于 runway.firstAttachedItem 和 runway.lastAttachedItem 之间的元素
        // 因此可以设定 start = runway.lastAttachedItem + 1，一定大于 runway.lastAttachedItem，以此达到释放所有正在使用元素的目的
        this.freeUnusedNodes(runway.lastAttachedItem + 1);
        return runway;
    };
    Recycler.prototype.checkout = function (name, disableRender) {
        if (disableRender === void 0) { disableRender = false; }
        return __awaiter(this, void 0, void 0, function () {
            var runway;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.runways[name]) {
                            throw Exceptions.Error(name + " is not exists in runways");
                        }
                        this.cleanScreen();
                        this.activatedRunway = name;
                        runway = this.getRunway();
                        this.update(true);
                        if (!!disableRender) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.scrollTo(runway.scrollTop)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.emit(Recycler.Events.RunwaySwitched, this);
                        return [2 /*return*/];
                }
            });
        });
    };
    Recycler.prototype.addRunway = function (source) {
        var key = source.key;
        if (!key) {
            key = String(Object.keys(this.runways).length);
        }
        if (this.runways[key]) {
            throw Exceptions.Error(source.key + " is already exists");
        }
        this.runways[key] = Recycler.getInitialRunway(source);
    };
    Recycler.prototype.resetRunway = function (name) {
        var _this = this;
        var key = this.runways[name] ? name : this.activatedRunway;
        var runway = this.runways[key];
        this.cleanScreen(key);
        execute(function () { return runway.source.clean(_this); });
        Object.assign(runway, Recycler.getInitialRunway(runway.source));
    };
    Recycler.prototype.getScrollTop = function () {
        return Math.ceil(this.scrollerOperations.getScrollTop());
    };
    Recycler.prototype.getCurrentRunway = function () {
        return __assign({}, this.getRunway());
    };
    Recycler.prototype.onScroll = function () {
        var runway = this.getRunway();
        var currentScrollTop = this.getScrollTop();
        var delta = currentScrollTop - runway.scrollTop; // delta > 0 说明向下滚动，delta < 0 说明向上滚动
        var runwayScrollTop = Math.max(0, Math.min(currentScrollTop, runway.runwayMaxScrollTop));
        // 记录 scrollTop
        runway.scrollTop = currentScrollTop;
        // 计算在屏幕内的第一个元素
        if (currentScrollTop === 0) {
            runway.firstScreenItem = 0;
        }
        else {
            runway.firstScreenItem = this.getFirstScreenItem(runway.firstScreenItem, Math.max(runwayScrollTop - this.topPreserved, 0));
        }
        // 计算在屏幕内的最后一个元素
        runway.lastScreenItem = this.getLastScreenItem(runway.lastScreenItem, Math.max(runwayScrollTop - this.topPreserved + this.scrollerHeight, 0));
        // 发送事件
        this.emit(Recycler.Events.Scrolling, this, delta);
        if (currentScrollTop === 0) {
            this.emit(Recycler.Events.ScrollAtStart, this);
        }
        else if (currentScrollTop >= runway.runwayMaxScrollTop) {
            this.emit(Recycler.Events.ScrollAtEnd, this);
        }
        // 根据 delta 不同，选择不同的渲染起始点和终止点
        if (delta < 0) {
            this.fill(runway.firstScreenItem - this.runwayItems, runway.lastScreenItem + this.runwayItemsOpposite);
        }
        else {
            this.fill(runway.firstScreenItem - this.runwayItemsOpposite, runway.lastScreenItem + this.runwayItems);
        }
    };
    Recycler.prototype.onResize = function () {
        try {
            this.isResizeUpdate = true;
            this.forceUpdate();
            this.emit(Recycler.Events.Resized, this);
        }
        catch (err) {
            throw err;
        }
        finally {
            this.isResizeUpdate = false;
        }
    };
    Recycler.prototype.fill = function (start, end) {
        var runway = this.getRunway();
        // 限制渲染起止点和终止点在安全范围内（即有意义的范围内）
        var fixedStart = Math.max(0, start);
        var fixedEnd = Math.min(runway.source.getLength(this) - 1, end);
        // 开始渲染
        this.attachContent(fixedStart, fixedEnd);
        // 缓存渲染起始点和终止点
        runway.firstAttachedItem = fixedStart;
        runway.lastAttachedItem = fixedEnd;
    };
    Recycler.prototype.attachContent = function (start, end) {
        var runway = this.getRunway();
        var benchNodes = []; // 板凳元素，即等待被放到 DOM tree 里的节点
        var changedNodes = []; // 有变化的节点
        // 重点是释放在屏幕外的元素
        this.freeUnusedNodes(start, end, this.isForceUpdate);
        // 从渲染起始点到渲染终止点进行遍历
        for (var i = start; i <= end; i++) {
            // 如果 node 存在于缓存中，说明元素本来就在屏幕上，不需要做什么（除非指定强制更新）
            if (!this.isForceUpdate && runway.nodes[i]) {
                continue;
            }
            var renderer = this.getRenderer(i);
            var data = runway.source.getData(i, this);
            // 调用渲染函数，获得一个节点
            // 这个节点可能在屏幕上，也可能不在，取决于渲染器的设计（是否有缓存）和当前滚动的深度
            // 如果该节点在屏幕上，性能会最佳，因为只需要改变一下 translate 就行了，不需要 layout
            var node = runway.nodes[i] = renderer.render(data, this);
            // 向缓存中存入一个节点，用于移除
            runway.screenNodes.add(node);
            // 向变化的节点数组中加入一项，等待改变样式（translate, height, etc...）
            changedNodes.push({ node: node, index: i });
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
    };
    Recycler.prototype.freeUnusedNodes = function (start, end, force) {
        var runway = this.getRunway();
        if (force || start > runway.lastAttachedItem || end < runway.firstAttachedItem) {
            return this.freeNodesFromStart(runway.firstAttachedItem, Math.min(runway.source.getLength(this), runway.lastAttachedItem + 1));
        }
        this.freeNodesFromStart(runway.firstAttachedItem, start);
        this.freeNodesFromEnd(end, runway.lastAttachedItem);
    };
    Recycler.prototype.freeNodesFromStart = function (start, end) {
        var runway = this.getRunway();
        for (var i = start; i < end; i++) {
            this.freeNode(i, runway);
        }
    };
    Recycler.prototype.freeNodesFromEnd = function (start, end) {
        var runway = this.getRunway();
        for (var i = end; i > start; i--) {
            this.freeNode(i, runway);
        }
    };
    Recycler.prototype.freeNode = function (index, runway) {
        var _this = this;
        if (!runway.nodes[index]) {
            return;
        }
        var renderer = this.getRenderer(index);
        var node = runway.nodes[index];
        execute(function () { return renderer.release(node, _this); });
        delete runway.nodes[index];
        if (!node.parentNode) {
            runway.screenNodes.delete(node);
        }
    };
    Recycler.prototype.setSentinelPosition = function () {
        this.sentinel.style.top = this.getMaxScrollHeight() + 'px';
    };
    Recycler.prototype.setNodesStyles = function (nodes) {
        var e_3, _a;
        var _this = this;
        var runway = this.getRunway();
        var _loop_2 = function (node, index) {
            var _a = execute(function () { return runway.source.getOffset(index, _this); }, { x: '0', y: 0 }), x = _a.x, y = _a.y;
            node.dataset.index = String(index);
            node.style.position = 'absolute';
            node.style.top = node.style.left = '0';
            node.style.height = runway.source.getHeight(index, this_1) + "px";
            node.style.width = runway.source.getWidth(index, this_1);
            node.dataset.column = execute(function () { return String(runway.source.getColumn(index, _this)); }, '1');
            node.style.transform = node.style.webkitTransform = this_1.transformTemplate(x, runway.source.getScrollTop(index, this_1) + y);
        };
        var this_1 = this;
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var _b = nodes_1_1.value, node = _b.node, index = _b.index;
                _loop_2(node, index);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    Recycler.prototype.getFirstScreenItem = function (initialAnchorItem, scrollTop) {
        var i = initialAnchorItem;
        var runway = this.getRunway();
        var sourceLastIndex = runway.source.getLength(this) - 1;
        if (runway.source.getScrollTop(i, this) + runway.source.getHeight(i, this) < scrollTop) {
            while (i < sourceLastIndex && runway.source.getScrollTop(++i, this) + runway.source.getHeight(i, this) < scrollTop) {
                // do nothing
            }
        }
        else {
            while (i > 0 && runway.source.getScrollTop(--i, this) + runway.source.getHeight(i, this) > scrollTop) {
                // do nothing
            }
            // 上面的循环得到的 i 的意义是在屏幕之上的最后一个元素
            // 我们需要的是 在屏幕内的第一个元素
            // 故加 1
            i < sourceLastIndex && i > 0 && ++i;
        }
        return i;
    };
    Recycler.prototype.getLastScreenItem = function (initialAnchorItem, scrollTop) {
        var i = initialAnchorItem;
        var runway = this.getRunway();
        var sourceLastIndex = runway.source.getLength(this) - 1;
        if (runway.source.getScrollTop(i, this) > scrollTop) {
            while (i > 0 && runway.source.getScrollTop(--i, this) > scrollTop) {
                // do nothing
            }
        }
        else {
            while (i < sourceLastIndex && runway.source.getScrollTop(++i, this) < scrollTop) {
                // do nothing
            }
            // 上面的循环得到的 i 的意义是首个 scrollTop >= 给定 scrollTop 的 item
            // 我们需要的是 最后一个 scrollTop <= 给定 scrollTop 的 item
            // 故减 1
            i > 0 && i < sourceLastIndex && --i;
        }
        return i;
    };
    Recycler.prototype.getRunway = function () {
        return this.runways[this.activatedRunway];
    };
    Recycler.prototype.getRunwayMaxScrollTop = function () {
        return Math.max(0, this.getMaxScrollHeight() - this.scrollerHeight);
    };
    Recycler.prototype.getMaxScrollHeight = function () {
        return this.getRunway().source.getMaxScrollHeight(this) + this.bottomPreserved + this.topPreserved;
    };
    Recycler.prototype.maybeLoadMore = function (end) {
        return __awaiter(this, void 0, void 0, function () {
            var runway, isInitial, activatedRunwayCache, data, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runway = this.getRunway();
                        isInitial = !runway.source.getLength(this);
                        if (!((runway.source.getLength(this) - end <= this.threshold || isInitial) &&
                            !runway.requestInProgress &&
                            runway.source.fetch)) return [3 /*break*/, 5];
                        activatedRunwayCache = this.activatedRunway;
                        runway.requestInProgress = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, runway.source.fetch(this)];
                    case 2:
                        data = _a.sent();
                        if (!data) {
                            return [2 /*return*/];
                        }
                        if (this.activatedRunway === activatedRunwayCache) {
                            this.update();
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        e_4 = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        runway.requestInProgress = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Recycler.prototype.getRenderer = function (index) {
        var source = this.getRunway().source;
        return (source.getRenderer && source.getRenderer(index, this)) || this.renderer;
    };
    Recycler.prototype.initRunways = function (sources) {
        var e_5, _a;
        this.runways = {};
        if (Array.isArray(sources)) {
            try {
                for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                    var source = sources_1_1.value;
                    this.addRunway(source);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (sources_1_1 && !sources_1_1.done && (_a = sources_1.return)) _a.call(sources_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        else if (sources) {
            this.addRunway(sources);
        }
        else {
            throw Exceptions.TypeError('sources is invalid');
        }
    };
    Recycler.getDefaultRunwayKey = function (sources) {
        if (!sources) {
            throw Exceptions.TypeError('sources is not defined');
        }
        if (Array.isArray(sources)) {
            return sources[0].key || '0';
        }
        return sources.key || '0';
    };
    Recycler.getInitialRunway = function (source) {
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
            source: source,
        };
    };
    Recycler.removeScreenNodes = function (runway) {
        var e_6, _a;
        try {
            for (var _b = __values(runway.screenNodes.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var node = _c.value;
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                    runway.screenNodes.delete(node);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    Recycler.Events = RecyclerEvents;
    return Recycler;
}(EventEmitter));

var Source = /** @class */ (function () {
    function Source() {
    }
    return Source;
}());

var Renderer = /** @class */ (function () {
    function Renderer() {
        this.queue = {
            unused: [],
            using: new Set()
        };
    }
    Renderer.prototype.render = function (data, recycler) {
        // 从 queue.unused 中弹出一个节点
        var el = this.queue.unused.pop();
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
    };
    Renderer.prototype.release = function (el, recycler) {
        this.queue.using.delete(el);
        this.queue.unused.push(el);
    };
    Renderer.prototype.releaseAll = function (recycler) {
        var _this = this;
        this.mapUsing(function (el) { return _this.release(el, recycler); });
    };
    Renderer.prototype.clear = function (recycler) {
        var _this = this;
        this.mapUsing(function (el) {
            _this.release(el, recycler);
            el.remove();
        });
    };
    Renderer.prototype.mapUsing = function (fn) {
        var e_1, _a;
        try {
            for (var _b = __values(this.queue.using.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var el = _c.value;
                fn(el);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return Renderer;
}());

var ImageTypes;
(function (ImageTypes) {
    ImageTypes["img"] = "img";
    ImageTypes["background"] = "background";
})(ImageTypes || (ImageTypes = {}));

var ANIMATION_END = getAnimationEndEventName();
var LazyLoader = /** @class */ (function () {
    function LazyLoader(options) {
        if (options === void 0) { options = {}; }
        this.elementsInfo = new Map();
        this.speedThreshold = options.speedThreshold || 100;
        this.placeholders = {
            loading: options.loading || LazyLoader.DEFAULT_PLACEHOLDER,
            error: options.error || LazyLoader.DEFAULT_PLACEHOLDER
        };
    }
    LazyLoader.prototype.mount = function (recycler) {
        var _this = this;
        recycler.on(RecyclerEvents.Scrolling, throttle(function (r, speed) {
            if (Math.abs(speed) < _this.speedThreshold) {
                setTimeout(function () { return _this.flush(); });
            }
        }));
        recycler.on(RecyclerEvents.ScrollAtStart, function () { return setTimeout(function () { return _this.flush(); }); });
        recycler.on(RecyclerEvents.ScrollAtEnd, function () { return setTimeout(function () { return _this.flush(); }); });
    };
    LazyLoader.prototype.update = function (el, binding) {
        var elementInfo = this.getElementInfo(el);
        if (!el.__recycler_lazy_loading__) {
            el.setAttribute('lazy', 'loading');
            el.__recycler_lazy_loading__ = true;
            LazyLoader.setSrc(el, {
                value: this.placeholders.loading,
                type: binding.type
            });
        }
        LazyLoader.attemptCancel(elementInfo);
        elementInfo.binding = binding;
        elementInfo.render = function () {
            var _this = this;
            if (el.dataset.src === this.binding.value &&
                !el.__recycler_lazy_loading__) {
                return;
            }
            var cache = this.binding;
            LazyLoader.attemptCancel(this);
            this.loader = loadImage(this.binding.value);
            this.render = null;
            this.loader.then(function () {
                if (cache.value === _this.binding.value) {
                    el.removeEventListener(ANIMATION_END, el.__recycler_lazy_animationend__);
                    el.__recycler_lazy_animationend__ = function () {
                        el.setAttribute('lazy', 'complete');
                    };
                    el.addEventListener(ANIMATION_END, el.__recycler_lazy_animationend__);
                    el.setAttribute('lazy', 'loaded');
                    LazyLoader.setSrc(el, _this.binding);
                }
            }).catch(function (err) {
                if (err !== 'canceled') {
                    el.setAttribute('lazy', 'error');
                }
            }).finally(function () {
                el.__recycler_lazy_loading__ = false;
            });
        };
    };
    LazyLoader.prototype.flush = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.elementsInfo.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elementInfo = _c.value;
                if (elementInfo.render) {
                    elementInfo.render();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    LazyLoader.prototype.getElementInfo = function (el) {
        var elementInfo = this.elementsInfo.get(el);
        if (!elementInfo) {
            elementInfo = {
                loader: null
            };
            this.elementsInfo.set(el, elementInfo);
        }
        return elementInfo;
    };
    LazyLoader.setSrc = function (el, binding) {
        if (binding.type === ImageTypes.background) {
            el.style.backgroundImage = "url(" + binding.value + ")";
        }
        else {
            el.src = binding.value;
        }
        el.dataset.src = binding.value;
    };
    LazyLoader.attemptCancel = function (elementInfo) {
        elementInfo.loader && elementInfo.loader.cancel && elementInfo.loader.cancel();
        elementInfo.loader = null;
    };
    LazyLoader.DEFAULT_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    return LazyLoader;
}());

exports.LazyLoader = LazyLoader;
exports.Recycler = Recycler;
exports.Renderer = Renderer;
exports.Source = Source;
