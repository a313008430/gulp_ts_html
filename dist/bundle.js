(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Core_1 = require("./core/Core");
/**
 * 入口
 */
var Main = /** @class */ (function () {
    function Main() {
        this.init();
        window['core'] = Core_1.default;
    }
    /**
     * 初始化
     */
    Main.prototype.init = function () {
        Core_1.default.root = document.querySelector('#root'); //设置主场景
        Core_1.default.route.init();
    };
    return Main;
}());
new Main();
},{"./core/Core":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexLogic_1 = require("../logic/view_logic/IndexLogic");
var AlertLogic_1 = require("../logic/view_logic/AlertLogic");
var GameLogic_1 = require("../logic/view_logic/GameLogic");
/**
 * 界面配置，路径，对应的类等等
 */
var ViewConfig = /** @class */ (function () {
    function ViewConfig() {
    }
    /**首页 */
    ViewConfig.index = { name: 'index', class: IndexLogic_1.default, skin: 'view/main.html' };
    /**游戏 */
    ViewConfig.game = { name: 'game', class: GameLogic_1.default, skin: 'view/game.html' };
    /**测试页 */
    ViewConfig.alert = { name: 'alert', class: AlertLogic_1.default, skin: 'view/alert.html' };
    return ViewConfig;
}());
exports.default = ViewConfig;
},{"../logic/view_logic/AlertLogic":10,"../logic/view_logic/GameLogic":11,"../logic/view_logic/IndexLogic":12}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 基类
 */
var Base = /** @class */ (function () {
    function Base() {
        Base.instance = this;
        this.onAwake();
    }
    /**
     * 构造
     */
    Base.prototype.onAwake = function () {
    };
    /**
     * 销毁
     */
    Base.prototype.onDestroy = function () { };
    return Base;
}());
exports.default = Base;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ViewManager_1 = require("./ViewManager");
var EventDispatcher_1 = require("./EventDispatcher");
var Utils_1 = require("./Utils");
var Route_1 = require("./Route");
var Core = /** @class */ (function () {
    function Core() {
    }
    /** 界面管理 */
    Core.viewManager = ViewManager_1.default;
    /**事件管理 */
    Core.eventManager = EventDispatcher_1.default;
    /**工具类 */
    Core.utils = Utils_1.default;
    /** 路由 */
    Core.route = Route_1.default;
    return Core;
}());
exports.default = Core;
},{"./EventDispatcher":5,"./Route":6,"./Utils":7,"./ViewManager":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 事件分发
 */
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
    }
    /**
     * 派发事件
     * @param type 事件类型
     * @param (可选) 回调数据
     */
    EventDispatcher.event = function (type, data) {
        var list = this.list[type];
        if (list) {
            for (var x = list.length - 1; x > -1; x--) {
                list[x](data);
            }
        }
    };
    /**
     * 对象注册指定类型的事件侦听器对象，以使侦听器能够接收事件通知
     * @param type type 事件类型
     * @param listener 事件侦听函数
     */
    EventDispatcher.on = function (type, listener) {
        if (!this.list[type]) { //检测是否已经绑定过事件
            this.list[type] = [];
        }
        this.list[type].push(listener);
    };
    /**
     * 对象移除指定类型的事件侦听器对象，
     * @param type
     * @param listener
     */
    EventDispatcher.off = function (type, listener) {
        var list = this.list[type];
        if (list) {
            for (var x = list.length - 1; x > -1; x--) {
                if (list[x] == listener)
                    list.splice(x, 1);
            }
        }
    };
    /** 已经绑定事件列表 */
    EventDispatcher.list = {};
    return EventDispatcher;
}());
exports.default = EventDispatcher;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ViewConfig_1 = require("../common/ViewConfig");
var Core_1 = require("./Core");
/**
 * 路由
 */
var Route = /** @class */ (function () {
    function Route() {
    }
    Route.init = function () {
        var _this = this;
        this.listen();
        if ("onhashchange" in window) {
            $(window).on('hashchange', function () {
                _this.listen();
            });
        }
        else {
            alert("浏览器版本过低，请换个浏览器!");
        }
    };
    /**
     * 监听地址栏变化
     */
    Route.listen = function () {
        var hash = location.hash;
        this.dispatcher(hash.match(/[^#]\w+/));
    };
    /**
     * 解析地址 打开对应的界面
     * @param src
     */
    Route.dispatcher = function (src) {
        if (!src)
            src = ['index'];
        // switch (src[0]) {
        //     default:
        //         console.error('界面不存在，现在还未做处理')
        //         return;
        // }
        if (!ViewConfig_1.default[src[0]]) {
            console.error('模板不存在，现在还未做处理');
            return;
        }
        if (Core_1.default.preView)
            Core_1.default.preView.remove();
        Core_1.default.viewManager.openView(ViewConfig_1.default[src[0]]);
        Core_1.default.preView = ViewConfig_1.default[src[0]].class.instance;
    };
    return Route;
}());
exports.default = Route;
},{"../common/ViewConfig":2,"./Core":4}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.ajax = function (d) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            $.ajax({
                                type: d.type,
                                url: d.url,
                                data: d.data,
                                dataType: d.dataType,
                                success: function (data) {
                                    resolve(data);
                                }
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Utils;
}());
exports.default = Utils;
},{}],8:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Base_1 = require("./Base");
var ViewBase = /** @class */ (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        /**
         * 生命周期
         * 名称 异步模板 添加到场景
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.animation = true;
        return _this;
    }
    Object.defineProperty(ViewBase.prototype, "template", {
        get: function () {
            return this._template;
        },
        set: function (d) {
            this._template = d.replace(/\<div/, "<div id=" + this.name + " "); ///^\<div/
            this.onCreate();
        },
        enumerable: true,
        configurable: true
    });
    ViewBase.prototype.onAwake = function () {
        console.log(222);
    };
    /**
     * 已经获取到模板，未添加到场景 可在这里进行数据添加
     */
    ViewBase.prototype.onCreate = function (data) {
    };
    /**
     * 添加到场景
     */
    ViewBase.prototype.add = function (parent) {
        parent.innerHTML = this._template;
        // this.node = parent.querySelector(`#${this.name}`);
        this.node = $("#" + this.name);
        if (this.node)
            this.node.on('click', this.onClick); //绑定点击事件
        this.onEnable();
        this.update();
    };
    /**
     * 打开界面时的动画
     */
    ViewBase.prototype.openAnimation = function () {
        this.node.css({ opacity: 0, transform: 'translateX(1.5rem)' });
        this.node.animate({
            opacity: 1,
            transform: 'translateX(0)'
        }, 400, 'ease-out');
    };
    /**
     * 点击事件
     */
    ViewBase.prototype.onClick = function (e) {
    };
    /**
     * 已经添加到场景
     */
    ViewBase.prototype.onEnable = function () {
    };
    ViewBase.prototype.update = function () {
        var _this = this;
        //每帧执行一次
        requestAnimationFrame(function () {
            _this.update();
        });
        this.onUpdate();
    };
    /**
     * 每帧执行一次
     */
    ViewBase.prototype.onUpdate = function () {
    };
    /**
     * 场景删除
     */
    ViewBase.prototype.remove = function () {
        this.onRemove();
    };
    /**
     * 从场景移除
     */
    ViewBase.prototype.onRemove = function () {
        this.node.off('click', this.onClick); //绑定点击事件
    };
    return ViewBase;
}(Base_1.default));
exports.default = ViewBase;
},{"./Base":3}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var Core_1 = require("./Core");
/**
 * 界面管理器
 */
var ViewManager = /** @class */ (function () {
    function ViewManager() {
    }
    /**
     * 打开界面
     */
    ViewManager.openView = function (viewConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var view, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        view = this.viewCache[viewConfig.name];
                        if (!!view) return [3 /*break*/, 2];
                        view = new viewConfig.class();
                        this.viewCache[viewConfig.name] = view;
                        view.name = viewConfig.name;
                        _a = view;
                        return [4 /*yield*/, Core_1.default.utils.ajax({
                                url: viewConfig.skin
                            })];
                    case 1:
                        _a.template = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (view.add)
                            view.add(Core_1.default.root);
                        // Core.root.innerHTML = view.template;
                        if (view.openAnimation && view.animation)
                            view.openAnimation();
                        console.log('%c ==> ', 'color:#fff;font-weight:700;background-color:rgba(27, 144, 4, 0.7)', " open " + viewConfig.name);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**已经打开界面缓存 => 后期如果需要批量处理界面可以用到 */
    ViewManager.viewCache = {};
    return ViewManager;
}());
exports.default = ViewManager;
},{"./Core":4}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ViewBase_1 = require("../../core/ViewBase");
var AlertLogic = /** @class */ (function (_super) {
    __extends(AlertLogic, _super);
    function AlertLogic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AlertLogic.prototype.onClick = function (e) {
        console.log(e);
    };
    return AlertLogic;
}(ViewBase_1.default));
exports.default = AlertLogic;
},{"../../core/ViewBase":8}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ViewBase_1 = require("../../core/ViewBase");
/**
 * 游戏逻辑
 */
var GameLogic = /** @class */ (function (_super) {
    __extends(GameLogic, _super);
    function GameLogic() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.x = 0;
        return _this;
    }
    GameLogic.prototype.onEnable = function () {
        this.dial = $('#dial');
        this.dial.css({ transform: "rotate(" + this.x++ + "deg)" });
        console.log(this.dial);
    };
    GameLogic.prototype.onClick = function () {
        console.log(111);
    };
    GameLogic.prototype.onUpdate = function () {
        if (this.dial)
            this.dial.css({ transform: "rotate(" + (this.x += 1) + "deg)" });
    };
    return GameLogic;
}(ViewBase_1.default));
exports.default = GameLogic;
},{"../../core/ViewBase":8}],12:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ViewBase_1 = require("../../core/ViewBase");
var IndexLogic = /** @class */ (function (_super) {
    __extends(IndexLogic, _super);
    function IndexLogic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndexLogic.prototype.onAwake = function () {
    };
    IndexLogic.prototype.onEnable = function () {
    };
    IndexLogic.prototype.onClick = function (e) {
        console.log(e.target);
    };
    IndexLogic.prototype.onUpdate = function () {
        // console.log(this.node)
    };
    IndexLogic.prototype.onRemove = function () {
        console.log('删除首页');
    };
    return IndexLogic;
}(ViewBase_1.default));
exports.default = IndexLogic;
},{"../../core/ViewBase":8}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFwcC9NYWluLnRzIiwiYXBwL2NvbW1vbi9WaWV3Q29uZmlnLnRzIiwiYXBwL2NvcmUvQmFzZS50cyIsImFwcC9jb3JlL0NvcmUudHMiLCJhcHAvY29yZS9FdmVudERpc3BhdGNoZXIudHMiLCJhcHAvY29yZS9Sb3V0ZS50cyIsImFwcC9jb3JlL1V0aWxzLnRzIiwiYXBwL2NvcmUvVmlld0Jhc2UudHMiLCJhcHAvY29yZS9WaWV3TWFuYWdlci50cyIsImFwcC9sb2dpYy92aWV3X2xvZ2ljL0FsZXJ0TG9naWMudHMiLCJhcHAvbG9naWMvdmlld19sb2dpYy9HYW1lTG9naWMudHMiLCJhcHAvbG9naWMvdmlld19sb2dpYy9JbmRleExvZ2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxvQ0FBK0I7QUFHL0I7O0dBRUc7QUFDSDtJQUNJO1FBQ0ksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGNBQUksQ0FBQztJQUMxQixDQUFDO0lBRUQ7O09BRUc7SUFDSyxtQkFBSSxHQUFaO1FBQ0ksY0FBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUEsT0FBTztRQUNuRCxjQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRXRCLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FkQSxBQWNDLElBQUE7QUFFRCxJQUFJLElBQUksRUFBRSxDQUFDOzs7O0FDdEJYLDZEQUF3RDtBQUN4RCw2REFBd0Q7QUFDeEQsMkRBQXNEO0FBRXREOztHQUVHO0FBQ0g7SUFBQTtJQU9BLENBQUM7SUFORyxRQUFRO0lBQ0QsZ0JBQUssR0FBZSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLG9CQUFVLEVBQUUsSUFBSSxFQUFFLGdC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LENBQUE7SUFDMUUsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0FuQkEsQUFtQkMsQ0FuQnNDLGtCQUFRLEdBbUI5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJELGdEQUEyQztBQUkzQztJQUF3Qyw4QkFBUTtJQUFoRDs7SUF1QkEsQ0FBQztJQXJCRyw0QkFBTyxHQUFQO0lBRUEsQ0FBQztJQUVELDZCQUFRLEdBQVI7SUFFQSxDQUFDO0lBRUQsNEJBQU8sR0FBUCxVQUFRLENBQWE7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELDZCQUFRLEdBQVI7UUFDSSx5QkFBeUI7SUFDN0IsQ0FBQztJQUVELDZCQUFRLEdBQVI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFHTCxpQkFBQztBQUFELENBdkJBLEFBdUJDLENBdkJ1QyxrQkFBUSxHQXVCL0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQ29yZSBmcm9tIFwiLi9jb3JlL0NvcmVcIjtcclxuXHJcblxyXG4vKipcclxuICog5YWl5Y+jXHJcbiAqL1xyXG5jbGFzcyBNYWluIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIHdpbmRvd1snY29yZSddID0gQ29yZTsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgICAgIENvcmUucm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb290Jyk7Ly/orr7nva7kuLvlnLrmma9cclxuICAgICAgICBDb3JlLnJvdXRlLmluaXQoKTtcclxuICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5uZXcgTWFpbigpOyIsImltcG9ydCBJbmRleExvZ2ljIGZyb20gXCIuLi9sb2dpYy92aWV3X2xvZ2ljL0luZGV4TG9naWNcIjtcclxuaW1wb3J0IEFsZXJ0TG9naWMgZnJvbSBcIi4uL2xvZ2ljL3ZpZXdfbG9naWMvQWxlcnRMb2dpY1wiO1xyXG5pbXBvcnQgR2FtZUxvZ2ljIGZyb20gXCIuLi9sb2dpYy92aWV3X2xvZ2ljL0dhbWVMb2dpY1wiO1xyXG5cclxuLyoqXHJcbiAqIOeVjOmdoumFjee9ru+8jOi3r+W+hO+8jOWvueW6lOeahOexu+etieetiVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0NvbmZpZyB7XHJcbiAgICAvKirpppbpobUgKi9cclxuICAgIHN0YXRpYyBpbmRleDogdmlld0NvbmZpZyA9IHsgbmFtZTogJ2luZGV4JywgY2xhc3M6IEluZGV4TG9naWMsIHNraW46ICd2aWV3L21haW4uaHRtbCcgfTtcclxuICAgIC8qKua4uOaIjyAqL1xyXG4gICAgc3RhdGljIGdhbWU6IHZpZXdDb25maWcgPSB7IG5hbWU6ICdnYW1lJywgY2xhc3M6IEdhbWVMb2dpYywgc2tpbjogJ3ZpZXcvZ2FtZS5odG1sJyB9O1xyXG4gICAgLyoq5rWL6K+V6aG1ICovXHJcbiAgICBzdGF0aWMgYWxlcnQ6IHZpZXdDb25maWcgPSB7IG5hbWU6ICdhbGVydCcsIGNsYXNzOiBBbGVydExvZ2ljLCBza2luOiAndmlldy9hbGVydC5odG1sJyB9O1xyXG59IiwiLyoqXHJcbiAqIOWfuuexu1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZSB7XHJcblxyXG4gICAgLyoq5Y2V5L6LICovXHJcbiAgICBzdGF0aWMgaW5zdGFuY2U6QmFzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBCYXNlLmluc3RhbmNlID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uQXdha2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaehOmAoFxyXG4gICAgICovXHJcbiAgICBvbkF3YWtlKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmUgOavgVxyXG4gICAgICovXHJcbiAgICBvbkRlc3Ryb3koKSB7IH1cclxufSIsImltcG9ydCBWaWV3TWFuYWdlciBmcm9tIFwiLi9WaWV3TWFuYWdlclwiO1xyXG5pbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuL0V2ZW50RGlzcGF0Y2hlclwiO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSBcIi4vVXRpbHNcIjtcclxuaW1wb3J0IFJvdXRlIGZyb20gXCIuL1JvdXRlXCI7XHJcbmltcG9ydCBWaWV3QmFzZSBmcm9tIFwiLi9WaWV3QmFzZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29yZSB7XHJcbiAgICAvKirkuLvlnLrmma8gKi9cclxuICAgIHN0YXRpYyByb290OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIC8qKuW3sue7j+aJk+W8gOeahOeVjOmdou+8jOS7hemZkOebtOaOpea3u+WKoOWIsOS4u+WcuuaZr+eahO+8jOW8ueepv+S4jeeulyAqL1xyXG4gICAgc3RhdGljIHByZVZpZXc6Vmlld0Jhc2U7XHJcbiAgICAvKiog55WM6Z2i566h55CGICovXHJcbiAgICBzdGF0aWMgdmlld01hbmFnZXIgPSBWaWV3TWFuYWdlcjtcclxuICAgIC8qKuS6i+S7tueuoeeQhiAqL1xyXG4gICAgc3RhdGljIGV2ZW50TWFuYWdlciA9IEV2ZW50RGlzcGF0Y2hlcjtcclxuICAgIC8qKuW3peWFt+exuyAqL1xyXG4gICAgc3RhdGljIHV0aWxzID0gVXRpbHM7XHJcbiAgICAvKiog6Lev55SxICovXHJcbiAgICBzdGF0aWMgcm91dGUgPSBSb3V0ZTtcclxufSIsIi8qKlxyXG4gKiDkuovku7bliIblj5FcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RGlzcGF0Y2hlciB7XHJcblxyXG4gICAgLyoqIOW3sue7j+e7keWumuS6i+S7tuWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbGlzdDogYW55ID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmtL7lj5Hkuovku7ZcclxuICAgICAqIEBwYXJhbSB0eXBlIOS6i+S7tuexu+Wei1xyXG4gICAgICogQHBhcmFtICjlj6/pgIkpIOWbnuiwg+aVsOaNrlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZXZlbnQodHlwZTogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGxpc3Q6IGFueVtdID0gdGhpcy5saXN0W3R5cGVdO1xyXG4gICAgICAgIGlmIChsaXN0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBsaXN0Lmxlbmd0aCAtIDE7IHggPiAtMTsgeC0tKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W3hdKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a+56LGh5rOo5YaM5oyH5a6a57G75Z6L55qE5LqL5Lu25L6m5ZCs5Zmo5a+56LGh77yM5Lul5L2/5L6m5ZCs5Zmo6IO95aSf5o6l5pS25LqL5Lu26YCa55+lXHJcbiAgICAgKiBAcGFyYW0gdHlwZSB0eXBlIOS6i+S7tuexu+Wei1xyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOS6i+S7tuS+puWQrOWHveaVsFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgb24odHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RbdHlwZV0pIHsvL+ajgOa1i+aYr+WQpuW3sue7j+e7keWumui/h+S6i+S7tlxyXG4gICAgICAgICAgICB0aGlzLmxpc3RbdHlwZV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5saXN0W3R5cGVdLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5a+56LGh56e76Zmk5oyH5a6a57G75Z6L55qE5LqL5Lu25L6m5ZCs5Zmo5a+56LGh77yMXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG9mZih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgICAgIGxldCBsaXN0OiBhbnlbXSA9IHRoaXMubGlzdFt0eXBlXTtcclxuICAgICAgICBpZiAobGlzdCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gbGlzdC5sZW5ndGggLSAxOyB4ID4gLTE7IHgtLSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RbeF0gPT0gbGlzdGVuZXIpIGxpc3Quc3BsaWNlKHgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFZpZXdDb25maWcgZnJvbSBcIi4uL2NvbW1vbi9WaWV3Q29uZmlnXCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuL0NvcmVcIjtcclxuXHJcblxyXG4vKipcclxuICog6Lev55SxXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm91dGUge1xyXG5cclxuICAgIHN0YXRpYyBpbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubGlzdGVuKCk7XHJcblxyXG4gICAgICAgIGlmIChcIm9uaGFzaGNoYW5nZVwiIGluIHdpbmRvdykge1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbigpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi5rWP6KeI5Zmo54mI5pys6L+H5L2O77yM6K+35o2i5Liq5rWP6KeI5ZmoIVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55uR5ZCs5Zyw5Z2A5qCP5Y+Y5YyWXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsaXN0ZW4oKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGhhc2g6IGFueSA9IGxvY2F0aW9uLmhhc2g7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaGVyKGhhc2gubWF0Y2goL1teI11cXHcrLykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kej5p6Q5Zyw5Z2AIOaJk+W8gOWvueW6lOeahOeVjOmdolxyXG4gICAgICogQHBhcmFtIHNyYyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRpc3BhdGNoZXIoc3JjOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXNyYykgc3JjID0gWydpbmRleCddO1xyXG5cclxuICAgICAgICAvLyBzd2l0Y2ggKHNyY1swXSkge1xyXG4gICAgICAgIC8vICAgICBkZWZhdWx0OlxyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5lcnJvcign55WM6Z2i5LiN5a2Y5Zyo77yM546w5Zyo6L+Y5pyq5YGa5aSE55CGJylcclxuICAgICAgICAvLyAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGlmICghVmlld0NvbmZpZ1tzcmNbMF1dKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+aooeadv+S4jeWtmOWcqO+8jOeOsOWcqOi/mOacquWBmuWkhOeQhicpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKENvcmUucHJlVmlldykgQ29yZS5wcmVWaWV3LnJlbW92ZSgpO1xyXG4gICAgICAgIENvcmUudmlld01hbmFnZXIub3BlblZpZXcoVmlld0NvbmZpZ1tzcmNbMF1dKTtcclxuICAgICAgICBDb3JlLnByZVZpZXcgPSBWaWV3Q29uZmlnW3NyY1swXV0uY2xhc3MuaW5zdGFuY2U7XHJcbiAgICAgXHJcbiAgICB9XHJcbn0iLCJcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbHMge1xyXG4gICAgc3RhdGljIGFzeW5jIGFqYXgoZDogWmVwdG9BamF4U2V0dGluZ3MpIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogZC50eXBlLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBkLnVybCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGQuZGF0YSxcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBkLmRhdGFUeXBlLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZSBmcm9tIFwiLi9CYXNlXCI7XHJcbmltcG9ydCB7IHRocm93cyB9IGZyb20gXCJhc3NlcnRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdCYXNlIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIHZpZXdCYXNlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUn+WRveWRqOacn1xyXG4gICAgICog5ZCN56ewIOW8guatpeaooeadvyDmt7vliqDliLDlnLrmma9cclxuICAgICAqL1xyXG5cclxuICAgIC8qKuaooeadv+WQjeensOWQjeensCAo6KaB5piv54us5LiA55qE77yM6Ziy5q2iaWTlhrLnqoEpICovXHJcbiAgICBuYW1lOiBhbnk7XHJcblxyXG4gICAgYW5pbWF0aW9uOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKirmqKHmnb/mlbDmja4gKi9cclxuICAgIHByaXZhdGUgX3RlbXBsYXRlOiBzdHJpbmc7XHJcbiAgICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlO1xyXG4gICAgfVxyXG4gICAgc2V0IHRlbXBsYXRlKGQ6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlID0gZC5yZXBsYWNlKC9cXDxkaXYvLCBgPGRpdiBpZD0ke3RoaXMubmFtZX0gYCk7Ly8vXlxcPGRpdi9cclxuICAgICAgICB0aGlzLm9uQ3JlYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIOW9k+WJjeiKgueCuSAqL1xyXG4gICAgbm9kZTogWmVwdG9Db2xsZWN0aW9uO1xyXG5cclxuICAgIG9uQXdha2UoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coMjIyKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bey57uP6I635Y+W5Yiw5qih5p2/77yM5pyq5re75Yqg5Yiw5Zy65pmvIOWPr+WcqOi/memHjOi/m+ihjOaVsOaNrua3u+WKoFxyXG4gICAgICovXHJcbiAgICBvbkNyZWF0ZShkYXRhPzogYW55KSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg5Yiw5Zy65pmvXHJcbiAgICAgKi9cclxuICAgIGFkZChwYXJlbnQ6IEhUTUxEaXZFbGVtZW50KSB7XHJcbiAgICAgICAgcGFyZW50LmlubmVySFRNTCA9IHRoaXMuX3RlbXBsYXRlO1xyXG4gICAgICAgIC8vIHRoaXMubm9kZSA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKGAjJHt0aGlzLm5hbWV9YCk7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gJChgIyR7dGhpcy5uYW1lfWApO1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGUpIHRoaXMubm9kZS5vbignY2xpY2snLCB0aGlzLm9uQ2xpY2spOy8v57uR5a6a54K55Ye75LqL5Lu2XHJcbiAgICAgICAgdGhpcy5vbkVuYWJsZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiZPlvIDnlYzpnaLml7bnmoTliqjnlLtcclxuICAgICAqL1xyXG4gICAgb3BlbkFuaW1hdGlvbigpIHtcclxuICAgICAgICB0aGlzLm5vZGUuY3NzKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgxLjVyZW0pJyB9KTtcclxuICAgICAgICB0aGlzLm5vZGUuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknXHJcbiAgICAgICAgfSwgNDAwLCAnZWFzZS1vdXQnKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDngrnlh7vkuovku7ZcclxuICAgICAqL1xyXG4gICAgb25DbGljayhlOiBhbnkpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW3sue7j+a3u+WKoOWIsOWcuuaZr1xyXG4gICAgICovXHJcbiAgICBvbkVuYWJsZSgpIHtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlKCkge1xyXG4gICAgICAgIC8v5q+P5bin5omn6KGM5LiA5qyhXHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmr4/luKfmiafooYzkuIDmrKFcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGUoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWcuuaZr+WIoOmZpFxyXG4gICAgICovXHJcbiAgICByZW1vdmUoKSB7XHJcbiAgICAgICAgdGhpcy5vblJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LuO5Zy65pmv56e76ZmkXHJcbiAgICAgKi9cclxuICAgIG9uUmVtb3ZlKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoJ2NsaWNrJywgdGhpcy5vbkNsaWNrKTsvL+e7keWumueCueWHu+S6i+S7tlxyXG4gICAgfVxyXG59IiwiaW1wb3J0IENvcmUgZnJvbSBcIi4vQ29yZVwiO1xyXG5cclxuLyoqXHJcbiAqIOeVjOmdoueuoeeQhuWZqFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld01hbmFnZXIge1xyXG4gICAgLyoq5bey57uP5omT5byA55WM6Z2i57yT5a2YID0+IOWQjuacn+WmguaenOmcgOimgeaJuemHj+WkhOeQhueVjOmdouWPr+S7peeUqOWIsCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdmlld0NhY2hlOiBhbnkgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJk+W8gOeVjOmdolxyXG4gICAgICovXHJcblxyXG4gICAgc3RhdGljIGFzeW5jIG9wZW5WaWV3KHZpZXdDb25maWc6YW55KSB7XHJcbiAgICAgICAgbGV0IHZpZXc6IHZpZXdCYXNlID0gdGhpcy52aWV3Q2FjaGVbdmlld0NvbmZpZy5uYW1lXTtcclxuICAgICAgICBpZiAoIXZpZXcpIHsvL+ajgOa1i+eVjOmdouaYr+WQpuW3sue7j+e8k+WtmOWunuS+i1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3ID0gbmV3IHZpZXdDb25maWcuY2xhc3MoKTtcclxuICAgICAgICAgICAgdGhpcy52aWV3Q2FjaGVbdmlld0NvbmZpZy5uYW1lXSA9IHZpZXc7XHJcbiAgICAgICAgICAgIHZpZXcubmFtZSA9IHZpZXdDb25maWcubmFtZTtcclxuICAgICAgICAgICAgdmlldy50ZW1wbGF0ZSA9IGF3YWl0IENvcmUudXRpbHMuYWpheCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHZpZXdDb25maWcuc2tpblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZpZXcuYWRkKSB2aWV3LmFkZChDb3JlLnJvb3QpO1xyXG4gICAgICAgIC8vIENvcmUucm9vdC5pbm5lckhUTUwgPSB2aWV3LnRlbXBsYXRlO1xyXG4gICAgICAgIGlmICh2aWV3Lm9wZW5BbmltYXRpb24gJiYgdmlldy5hbmltYXRpb24pIHZpZXcub3BlbkFuaW1hdGlvbigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCclYyA9PT4gJywgJ2NvbG9yOiNmZmY7Zm9udC13ZWlnaHQ6NzAwO2JhY2tncm91bmQtY29sb3I6cmdiYSgyNywgMTQ0LCA0LCAwLjcpJywgYCBvcGVuICR7dmlld0NvbmZpZy5uYW1lfWApO1xyXG5cclxuICAgIH1cclxufSIsImltcG9ydCBWaWV3QmFzZSBmcm9tIFwiLi4vLi4vY29yZS9WaWV3QmFzZVwiO1xyXG5pbXBvcnQgQ29yZSBmcm9tIFwiLi4vLi4vY29yZS9Db3JlXCI7XHJcbmltcG9ydCBWaWV3Q29uZmlnIGZyb20gXCIuLi8uLi9jb21tb24vVmlld0NvbmZpZ1wiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFsZXJ0TG9naWMgZXh0ZW5kcyBWaWV3QmFzZSB7XHJcbiAgICBvbkNsaWNrKGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgfVxyXG59ICAgIiwiaW1wb3J0IFZpZXdCYXNlIGZyb20gXCIuLi8uLi9jb3JlL1ZpZXdCYXNlXCI7XHJcblxyXG4vKipcclxuICog5ri45oiP6YC76L6RXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lTG9naWMgZXh0ZW5kcyBWaWV3QmFzZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBkaWFsOiBaZXB0b0NvbGxlY3Rpb247XHJcbiAgICBwcml2YXRlIHg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgb25FbmFibGUoKSB7XHJcbiAgICAgICAgdGhpcy5kaWFsID0gJCgnI2RpYWwnKTtcclxuICAgICAgICB0aGlzLmRpYWwuY3NzKHsgdHJhbnNmb3JtOiBgcm90YXRlKCR7dGhpcy54Kyt9ZGVnKWAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5kaWFsKVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ2xpY2soKXtcclxuICAgICAgICBjb25zb2xlLmxvZygxMTEpXHJcbiAgICB9XHJcblxyXG4gICAgb25VcGRhdGUoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpYWwpIHRoaXMuZGlhbC5jc3MoeyB0cmFuc2Zvcm06IGByb3RhdGUoJHt0aGlzLngrPTF9ZGVnKWAgfSlcclxuICAgIH1cclxufSIsImltcG9ydCBWaWV3QmFzZSBmcm9tIFwiLi4vLi4vY29yZS9WaWV3QmFzZVwiO1xyXG5pbXBvcnQgQ29yZSBmcm9tIFwiLi4vLi4vY29yZS9Db3JlXCI7XHJcbmltcG9ydCBWaWV3Q29uZmlnIGZyb20gXCIuLi8uLi9jb21tb24vVmlld0NvbmZpZ1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kZXhMb2dpYyBleHRlbmRzIFZpZXdCYXNlIHtcclxuXHJcbiAgICBvbkF3YWtlKCkge1xyXG4gICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgb25FbmFibGUoKSB7XHJcbiAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgb25DbGljayhlOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uVXBkYXRlKCl7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5ub2RlKVxyXG4gICAgfVxyXG5cclxuICAgIG9uUmVtb3ZlKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ+WIoOmZpOmmlumhtScpXHJcbiAgICB9XHJcblxyXG4gICBcclxufSJdfQ==
