var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.created = false;
        return _this;
        /**
         * 创建游戏场景
         */
        // private createP2Scene(): void {
        //   // egret.Profiler.getInstance().run();
        //   const factor: number = 50;
        //   // 创建 world
        //   const world: p2.World = new p2.World();
        //   world.sleepMode = p2.World.BODY_SLEEPING;
        //   // 创建 plane
        //   const planeShape: p2.Plane = new p2.Plane();
        //   const planeBody: p2.Body = new p2.Body();
        //   planeBody.addShape(planeShape);
        //   planeBody.displays = [];
        //   world.addBody(planeBody);
        //   egret.Ticker.getInstance().register((dt: number) => {
        //     if (dt < 10) {
        //       return;
        //     }
        //     if (dt > 1000) {
        //       return;
        //     }
        //     world.step(dt / 1000);
        //     const stageHeight: number = egret.MainContext.instance.stage.stageHeight;
        //     const l = world.bodies.length;
        //     for (let i: number = 0; i < l; i++) {
        //       const boxBody: p2.Body = world.bodies[i];
        //       const box: egret.DisplayObject = boxBody.displays[0];
        //       if (box) {
        //         box.x = boxBody.position[0] * factor;
        //         box.y = stageHeight - boxBody.position[1] * factor;
        //         box.rotation =
        //           360 - ((boxBody.angle + boxBody.shapes[0].angle) * 180) / Math.PI;
        //         if (boxBody.sleepState === p2.Body.SLEEPING) {
        //           box.alpha = 0.5;
        //         } else {
        //           box.alpha = 1;
        //         }
        //       }
        //     }
        //   }, this);
        //   // 鼠标点击添加刚体
        //   this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent): void => {
        //     const positionX: number = Math.floor(e.stageX / factor);
        //     const positionY: number = Math.floor(
        //       (egret.MainContext.instance.stage.stageHeight - e.stageY) / factor,
        //     );
        //     let display: egret.DisplayObject;
        //     let boxBody: p2.Body;
        //     if (Math.random() > 0.5) {
        //       // 添加方形刚体
        //       // var boxShape: p2.Shape = new p2.Rectangle(2, 1);
        //       const boxShape: p2.Shape = new p2.Box({ width: 2, height: 1 });
        //       boxBody = new p2.Body({
        //         mass: 1,
        //         position: [positionX, positionY],
        //         angularVelocity: 1,
        //       });
        //       boxBody.addShape(boxShape);
        //       world.addBody(boxBody);
        //       if (this.isDebug) {
        //         display = this.createBox(
        //           (boxShape as p2.Box).width * factor,
        //           (boxShape as p2.Box).height * factor,
        //         );
        //       } else {
        //         display = this.createBitmapByName("rect");
        //       }
        //       display.width = (boxShape as p2.Box).width * factor;
        //       display.height = (boxShape as p2.Box).height * factor;
        //     } else {
        //       // 添加圆形刚体
        //       // var boxShape: p2.Shape = new p2.Circle(1);
        //       const boxShape: p2.Shape = new p2.Circle({ radius: 1 });
        //       boxBody = new p2.Body({
        //         mass: 1,
        //         position: [positionX, positionY],
        //       });
        //       boxBody.addShape(boxShape);
        //       world.addBody(boxBody);
        //       if (this.isDebug) {
        //         display = this.createBall((boxShape as p2.Circle).radius * factor);
        //       } else {
        //         display = this.createBitmapByName("circle");
        //       }
        //       display.width = (boxShape as p2.Circle).radius * 2 * factor;
        //       display.height = (boxShape as p2.Circle).radius * 2 * factor;
        //     }
        //     display.anchorOffsetX = display.width / 2;
        //     display.anchorOffsetY = display.height / 2;
        //     boxBody.displays = [display];
        //     this.addChild(display);
        //   }, this);
        // }
        /**
         * 根据 name 关键字创建一个 Bitmap 对象。
         * name 属性请参考 resources/resource.json 配置文件的内容。
         */
        // private createBitmapByName(name: string): egret.Bitmap {
        //   const result: egret.Bitmap = new egret.Bitmap();
        //   const texture: egret.Texture = RES.getRes(name);
        //   result.texture = texture;
        //   return result;
        // }
        /**
         * 创建一个圆形
         */
        // private createBall(r: number): egret.Shape {
        //   const shape = new egret.Shape();
        //   shape.graphics.beginFill(0xfff000);
        //   shape.graphics.drawCircle(r, r, r);
        //   shape.graphics.endFill();
        //   return shape;
        // }
        /**
         * 创建一个方形
         */
        // private createBox(width: number, height: number): egret.Shape {
        //   const shape = new egret.Shape();
        //   shape.graphics.beginFill(0xfff000);
        //   shape.graphics.drawRect(0, 0, width, height);
        //   shape.graphics.endFill();
        //   return shape;
        // }
    }
    // debug 模式，使用图形绘制
    // private isDebug: boolean = true;
    /**
     * 埋点
     * 1、开始资源加载
     * 2、资源加载完成
     * 3、开始游戏（授权）
     * 4、进入游戏（确认授权）
     */
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        // egret.lifecycle.addLifecycleListener((context) => {
        //   // custom lifecycle plugin
        // });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        try {
            this.runGame();
        }
        catch (error) {
            egret.error(error);
        }
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loaded;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, yyw.checkUpdate()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, yyw.applyUpdate()];
                    case 2:
                        if (_a.sent()) {
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3:
                        loaded = false;
                        egret.setTimeout(function () {
                            if (!loaded) {
                                yyw.analysis.addEvent("2加载超时");
                                _this.createGameScene();
                            }
                        }, null, 10000);
                        yyw.analysis.addEvent("1开始加载");
                        return [4 /*yield*/, this.loadResource()];
                    case 4:
                        _a.sent();
                        loaded = true;
                        yyw.analysis.addEvent("2加载完成");
                        return [4 /*yield*/, this.createGameScene()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("loading", 0)];
                    case 3:
                        _a.sent();
                        this.loadingView = new LoadingUI();
                        this.stage.addChild(this.loadingView);
                        return [4 /*yield*/, RES.loadGroup("preload", 0, this.loadingView)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        egret.error(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // 加载皮肤主题配置文件。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.once(eui.UIEvent.COMPLETE, resolve, _this);
        });
    };
    /**
     * 创建场景界面
     */
    Main.prototype.createGameScene = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.created) {
                            return [2 /*return*/];
                        }
                        this.created = true;
                        yyw.analysis.addEvent("3加载配置");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // 初始化全局配置
                        return [4 /*yield*/, yyw.initConfig()];
                    case 2:
                        // 初始化全局配置
                        _a.sent();
                        // 先自动登录
                        return [4 /*yield*/, yyw.getLogin()];
                    case 3:
                        // 先自动登录
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        egret.error(error_2);
                        return [3 /*break*/, 5];
                    case 5:
                        yyw.director.setStage(this);
                        // 初始化场景
                        this.initScenes();
                        // 跳转到着陆页
                        yyw.director.toScene("landing");
                        // 移除加载界面
                        yyw.removeElement(this.loadingView);
                        // 初始化音频
                        this.initSounds();
                        // 初始化转发参数
                        yyw.initShare();
                        // 初始化子域资源
                        yyw.sub.postMessage({
                            command: "initRanking",
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.initScenes = function () {
        yyw.director.init({
            alarm: new game.Alarm(),
            award: new game.Award(),
            checkin: new game.Checkin(),
            ending: new game.Ending(),
            guide: new game.Guide(),
            landing: new game.Landing(),
            pbl: new game.Pbl(),
            playing: new game.Playing(),
            ranking: new game.Ranking(),
            reviving: new game.Reviving(),
            shop: new game.Shop(),
            task: new game.Task(),
            words: new game.Words(),
        });
        // 启用道具奖励
        if (yyw.reward.can("tool")) {
            // 体力过低
            yyw.on("LIVES_LEAST", function () {
                yyw.director.toScene("alarm", true);
            });
        }
        var canRevive = yyw.reward.can("revive");
        // 体力耗尽
        yyw.on("LIVES_EMPTY", function () {
            yyw.director.toScene(canRevive ? "reviving" : "ending", true);
        });
        // 启用金币奖励
        if (yyw.reward.can("coin")) {
            // 获得魔法数字
            yyw.on("MAGIC_GOT", function () {
                yyw.director.toScene("award", true);
                yyw.analysis.onRunning("award", "magic");
            });
        }
        // 获得道具
        yyw.on("TOOL_GOT", function (_a) {
            var _b = _a.data, type = _b.type, amount = _b.amount;
            yyw.analysis.onRunning("award", type, amount);
        });
        // 使用道具
        yyw.on("TOOL_USED", function (_a) {
            var _b = _a.data, type = _b.type, amount = _b.amount;
            yyw.analysis.onRunning("tools", type, amount);
        });
        // 获得金币
        yyw.on("COINS_GOT", function (_a) {
            var amount = _a.data.amount;
            yyw.analysis.onRunning("award", "coins", amount);
        });
        // 使用金币
        yyw.on("COINS_USED", function (_a) {
            var type = _a.data.type;
            yyw.analysis.onRunning("paySuccess", type);
        });
    };
    Main.prototype.initSounds = function () {
        // tslint:disable
        new game.AmazingSound();
        new game.ClickSound();
        new game.CoinsSound();
        new game.ExcellentSound();
        new game.GoodSound();
        new game.GreatSound();
        new game.MagicSound();
        new game.PointSound();
        new game.SwapSound();
        // tslint:enable
    };
    return Main;
}(eui.UILayer));
