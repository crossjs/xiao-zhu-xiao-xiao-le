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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var game;
(function (game) {
    var Cell = /** @class */ (function (_super) {
        __extends(Cell, _super);
        function Cell(col, row, width, height, num) {
            if (num === void 0) { num = 0; }
            var _this = _super.call(this) || this;
            /**
             * 99 魔法数，可以触发其它数 + 1
             * -1 不可用
             */
            _this.ax = 0;
            _this.ay = 0;
            _this.num = 0;
            _this.num = num;
            _this.ax = width / 2;
            _this.ay = height / 2;
            _this.x = col * width + _this.ax;
            _this.y = row * height + _this.ay;
            _this.anchorOffsetX = _this.ax;
            _this.anchorOffsetY = _this.ay;
            return _this;
        }
        Cell.prototype.setNumber = function (num) {
            if (num === this.num) {
                return;
            }
            if (this.numImage) {
                this.numImage.visible = false;
            }
            this.num = num;
            this.showCurrent();
        };
        Cell.prototype.getNumber = function () {
            return this.num;
        };
        Cell.prototype.flashScore = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tween;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.tfdScore.text = "+" + this.num * 10;
                            this.tfdScore.visible = true;
                            this.tfdScore.alpha = 0;
                            return [4 /*yield*/, yyw.getTween(this.tfdScore)];
                        case 1:
                            tween = _a.sent();
                            return [4 /*yield*/, tween.to({
                                    y: 72,
                                    alpha: 1,
                                }, 300)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, tween.to({
                                    y: 36,
                                    alpha: 0,
                                    scaleX: 1.5,
                                    scaleY: 1.5,
                                }, 200)];
                        case 3:
                            _a.sent();
                            this.tfdScore.visible = false;
                            this.tfdScore.alpha = 1;
                            this.tfdScore.y = 108;
                            this.tfdScore.scaleX = 1;
                            this.tfdScore.scaleY = 1;
                            return [2 /*return*/];
                    }
                });
            });
        };
        Cell.prototype.tweenUp = function (duration) {
            if (duration === void 0) { duration = 300; }
            return __awaiter(this, void 0, void 0, function () {
                var numImage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            numImage = this.numImage;
                            // 淡出当前
                            return [4 /*yield*/, yyw.fadeOut(numImage, duration)];
                        case 1:
                            // 淡出当前
                            _a.sent();
                            numImage.source = "numbers_json." + (this.num === game.BIGGEST_NUMBER ? game.MAGIC_NUMBER : this.num + 1);
                            // 淡入下张
                            return [4 /*yield*/, yyw.fadeIn(numImage, duration)];
                        case 2:
                            // 淡入下张
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Cell.prototype.zoomOut = function (duration) {
            if (duration === void 0) { duration = 100; }
            yyw.removeTweens(this);
            return yyw.getTween(this)
                .to({
                scale: 1,
            }, duration);
        };
        Cell.prototype.zoomIn = function (duration) {
            if (duration === void 0) { duration = 100; }
            yyw.removeTweens(this);
            return yyw.getTween(this)
                .to({
                scale: 1.2,
            }, duration);
        };
        Cell.prototype.tweenTo = function (increases, duration, onResolve) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1, _a, numGroup, oX, oY, oRotation, oAlpha, tween, tX, tY, tRotation, tAlpha, increases_1, increases_1_1, _b, _c, x, _d, y, _e, rotation, _f, alpha, e_1_1;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            numGroup = this.numGroup;
                            oX = numGroup.x, oY = numGroup.y, oRotation = numGroup.rotation, oAlpha = numGroup.alpha;
                            tween = yyw.getTween(numGroup);
                            duration /= increases.length;
                            tX = oX;
                            tY = oY;
                            tRotation = oRotation;
                            tAlpha = oAlpha;
                            _g.label = 1;
                        case 1:
                            _g.trys.push([1, 6, 7, 8]);
                            increases_1 = __values(increases), increases_1_1 = increases_1.next();
                            _g.label = 2;
                        case 2:
                            if (!!increases_1_1.done) return [3 /*break*/, 5];
                            _b = increases_1_1.value, _c = _b.x, x = _c === void 0 ? 0 : _c, _d = _b.y, y = _d === void 0 ? 0 : _d, _e = _b.rotation, rotation = _e === void 0 ? 0 : _e, _f = _b.alpha, alpha = _f === void 0 ? 0 : _f;
                            tX += x;
                            tY += y;
                            tRotation += rotation;
                            tAlpha += alpha;
                            return [4 /*yield*/, tween.to({
                                    x: tX,
                                    y: tY,
                                    rotation: tRotation,
                                    alpha: tAlpha,
                                }, duration)];
                        case 3:
                            _g.sent();
                            _g.label = 4;
                        case 4:
                            increases_1_1 = increases_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _g.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (increases_1_1 && !increases_1_1.done && (_a = increases_1.return)) _a.call(increases_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8:
                            if (!(typeof onResolve === "function")) return [3 /*break*/, 10];
                            return [4 /*yield*/, onResolve()];
                        case 9:
                            _g.sent();
                            _g.label = 10;
                        case 10:
                            numGroup.x = oX;
                            numGroup.y = oY;
                            numGroup.rotation = oRotation;
                            numGroup.alpha = oAlpha;
                            return [2 /*return*/];
                    }
                });
            });
        };
        Cell.prototype.fadeOut = function (duration) {
            if (duration === void 0) { duration = 300; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, yyw.getTween(this.numGroup)
                                .to({
                                scaleX: 0,
                                scaleY: 0,
                                alpha: 0,
                                rotation: 1080,
                            }, duration)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Cell.prototype.fadeIn = function (duration) {
            if (duration === void 0) { duration = 200; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, yyw.getTween(this.numGroup)
                                .to({
                                scaleX: 1,
                                scaleY: 1,
                                alpha: 1,
                                rotation: 0,
                            }, duration)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Cell.prototype.reset = function () {
            yyw.removeTweens(this);
            this.scaleX = this.scaleY = 1;
            yyw.removeTweens(this.tfdScore);
            yyw.removeTweens(this.numGroup);
            yyw.removeTweens(this.numImage);
            this.tfdScore.visible = false;
            this.tfdScore.alpha = 1;
            this.tfdScore.y = 36;
            this.numGroup.scaleX = this.numGroup.scaleY = this.numGroup.alpha = 1;
            this.numGroup.rotation = 0;
        };
        Cell.prototype.destroy = function () {
            this.reset();
        };
        Cell.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        this.numGroup.x
                            = this.numGroup.anchorOffsetX
                                = this.ax;
                        this.numGroup.y
                            = this.numGroup.anchorOffsetY
                                = this.ay;
                    }
                    this.showCurrent();
                    return [2 /*return*/];
                });
            });
        };
        Cell.prototype.showCurrent = function () {
            if (this.num) {
                this.numImage.source = "numbers_json." + this.num;
                this.numImage.visible = true;
            }
            yyw.removeTweens(this.sugar);
            if (game.MAGIC_NUMBER === this.num) {
                this.sugar.rotation = 0;
                yyw.getTween(this.sugar, true)
                    .to({
                    rotation: 360,
                }, 1000, null);
                this.sugar.visible = true;
            }
            else {
                this.sugar.visible = false;
            }
        };
        return Cell;
    }(yyw.Base));
    game.Cell = Cell;
})(game || (game = {}));
