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
var game;
(function (game) {
    var SNAPSHOT_KEY = "YYW_G4_PLAYING";
    var Playing = /** @class */ (function (_super) {
        __extends(Playing, _super);
        function Playing() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isGameOver = false;
            /** 单局最大连击数 */
            _this.maxCombo = 0;
            return _this;
        }
        Playing.prototype.exiting = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        Playing.prototype.initialize = function () {
            var _this = this;
            yyw.on("RESTART", function () {
                _this.startGame();
            });
        };
        Playing.prototype.destroy = function () {
            this.setSnapshot(this.isGameOver ? null : undefined);
            this.removeClosest();
        };
        Playing.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot, useSnapshot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _super.prototype.createView.call(this, fromChildrenCreated);
                            if (!!this.isGameOver) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.getSnapshot()];
                        case 1:
                            snapshot = _a.sent();
                            if (!snapshot) return [3 /*break*/, 3];
                            return [4 /*yield*/, yyw.showModal("继续上一次的进度？")];
                        case 2:
                            useSnapshot = _a.sent();
                            _a.label = 3;
                        case 3:
                            this.createClosest();
                            return [4 /*yield*/, this.arena.startGame(useSnapshot)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.tools.startTool(useSnapshot)];
                        case 5:
                            _a.sent();
                            this.isGameOver = false;
                            if (!fromChildrenCreated) return [3 /*break*/, 7];
                            yyw.director.toScene(yyw.USER.score ? "task" : "guide", true);
                            yyw.on("GAME_OVER", this.onGameOver, this);
                            this.initToolsTarget();
                            if (this.stage.stageHeight <= 1334) {
                                this.ctrlGroup3.y = 108;
                                this.ctrlGroup3.scale = 0.75;
                            }
                            this.ctrlGroup3.visible = true;
                            if (yyw.CONFIG.shopStatus) {
                                this.ctrlShop.visible = true;
                            }
                            return [4 /*yield*/, yyw.showBannerAd()];
                        case 6:
                            // 初次进入，刷新广告
                            if (!(_a.sent())) {
                                // 没有广告，显示交叉营销
                                this.boxAll = new box.All();
                                this.boxAll.bottom = 0;
                                this.addChild(this.boxAll);
                            }
                            _a.label = 7;
                        case 7:
                            yyw.analysis.addEvent("7进入场景", { s: "游戏界面" });
                            return [2 /*return*/];
                    }
                });
            });
        };
        Playing.prototype.startGame = function () {
            this.arena.startGame();
            this.createClosest();
        };
        Playing.prototype.getSnapshot = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, yyw.storage.get(SNAPSHOT_KEY)];
                });
            });
        };
        Playing.prototype.setSnapshot = function (value) {
            if (value === null) {
                yyw.storage.set(SNAPSHOT_KEY, null);
            }
            else {
                var maxCombo = this.maxCombo;
                yyw.storage.set(SNAPSHOT_KEY, {
                    maxCombo: maxCombo,
                });
            }
        };
        Playing.prototype.createClosest = function () {
            this.closest = new game.Closest();
            this.closest.x = 15;
            this.closest.y = 132;
            this.body.addChild(this.closest);
        };
        Playing.prototype.removeClosest = function () {
            yyw.removeElement(this.closest);
            this.closest = null;
        };
        Playing.prototype.onGameData = function (_a) {
            var combo = _a.data.combo;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    this.maxCombo = Math.max(combo, this.maxCombo);
                    return [2 /*return*/];
                });
            });
        };
        Playing.prototype.onGameOver = function (_a) {
            var _b = _a.data, level = _b.level, combo = _b.combo, score = _b.score;
            this.isGameOver = true;
            this.setSnapshot(null);
            yyw.pbl.save({
                score: score,
                level: level,
                combo: Math.max(combo, this.maxCombo),
            });
        };
        Playing.prototype.initToolsTarget = function () {
            var _a = this.arena, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            var padding = 15;
            var rect = new egret.Rectangle(x + padding, 
            // 因为 body 限制了高度 1072，且距离底部 262，所以是 1334，也就是界面的设计高度
            y + padding + this.stage.stageHeight - 1334, width - padding * 2, height - padding * 2);
            this.tools.targetRect = rect;
        };
        return Playing;
    }(yyw.Base));
    game.Playing = Playing;
})(game || (game = {}));
