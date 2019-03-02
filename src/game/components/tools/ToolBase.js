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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var ToolBase = /** @class */ (function (_super) {
        __extends(ToolBase, _super);
        function ToolBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.amount = 0;
            _this.message = "获得道具";
            _this.dnd = false;
            return _this;
        }
        Object.defineProperty(ToolBase.prototype, "targetRect", {
            set: function (targetRect) {
                this.rect = targetRect;
            },
            enumerable: true,
            configurable: true
        });
        ToolBase.prototype.setAmount = function (amount) {
            this.amount = amount;
            this.update();
        };
        ToolBase.prototype.getAmount = function () {
            return this.amount;
        };
        ToolBase.prototype.increaseAmount = function (amount) {
            this.amount += amount;
            if (amount > 0) {
                yyw.emit("TOOL_USED", {
                    type: this.type,
                    amount: amount,
                });
            }
            this.update();
        };
        ToolBase.prototype.destroy = function () {
            yyw.removeTweens(this.main);
        };
        ToolBase.prototype.afterGet = function (amount) {
            yyw.showToast(this.message);
        };
        ToolBase.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, x_1, y_1, zIndex_1, startX_1, startY_1, targetXY_1;
                var _this = this;
                return __generator(this, function (_b) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        yyw.on("TOOL_GOT", function (_a) {
                            var _b = _a.data, type = _b.type, amount = _b.amount;
                            if (type === _this.type) {
                                _this.increaseAmount(amount);
                                _this.afterGet(amount);
                            }
                        });
                        yyw.onTap(this, function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        this.zoomOut();
                                        if (!!this.amount) return [3 /*break*/, 2];
                                        this.enabled = false;
                                        return [4 /*yield*/, yyw.reward.apply("tool")];
                                    case 1:
                                        if (_a.sent()) {
                                            this.increaseAmount(1);
                                            this.afterGet(1);
                                        }
                                        this.enabled = true;
                                        return [2 /*return*/];
                                    case 2:
                                        if (!this.dnd) {
                                            yyw.emit("TOOL_USING", {
                                                type: this.type,
                                                confirm: function () {
                                                    _this.increaseAmount(-1);
                                                },
                                            });
                                            return [2 /*return*/];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        if (this.dnd) {
                            _a = this, x_1 = _a.x, y_1 = _a.y;
                            zIndex_1 = yyw.getZIndex(this);
                            targetXY_1 = null;
                            yyw.onDnd(this, function (e, cancel) {
                                if (!_this.amount) {
                                    cancel();
                                    return;
                                }
                                startX_1 = e.stageX;
                                startY_1 = e.stageY;
                                yyw.setZIndex(_this);
                                _this.zoomIn();
                            }, function (e, cancel) {
                                var stageX = e.stageX, stageY = e.stageY;
                                _this.x = x_1 + (stageX - startX_1);
                                _this.y = y_1 + (stageY - startY_1);
                                if (_this.rect.contains(stageX, stageY)) {
                                    targetXY_1 = {
                                        targetX: stageX - _this.rect.x,
                                        targetY: stageY - _this.rect.y,
                                    };
                                    yyw.emit("TOOL_USING", __assign({ type: _this.type }, targetXY_1, { cancel: cancel }));
                                }
                                else {
                                    targetXY_1 = null;
                                }
                            }, function () { return __awaiter(_this, void 0, void 0, function () {
                                var reset;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            reset = function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.zoomOut()];
                                                        case 1:
                                                            _a.sent();
                                                            return [4 /*yield*/, yyw.getTween(this).to({
                                                                    x: x_1,
                                                                    y: y_1,
                                                                }, 500)];
                                                        case 2:
                                                            _a.sent();
                                                            yyw.setZIndex(this, zIndex_1);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); };
                                            if (!targetXY_1) return [3 /*break*/, 1];
                                            yyw.emit("TOOL_USING", __assign({ type: this.type }, targetXY_1, { confirm: function () { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, reset()];
                                                            case 1:
                                                                _a.sent();
                                                                this.increaseAmount(-1);
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); } }));
                                            targetXY_1 = null;
                                            return [3 /*break*/, 3];
                                        case 1:
                                            yyw.showToast("请拖放到棋盘中");
                                            return [4 /*yield*/, reset()];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                    }
                    return [2 /*return*/];
                });
            });
        };
        ToolBase.prototype.update = function () {
            var _a = this, tfd = _a.tfd, img = _a.img, amount = _a.amount;
            tfd.text = "" + amount;
            if (yyw.reward.can("tool")) {
                img.visible = !amount;
            }
        };
        ToolBase.prototype.zoomIn = function () {
            yyw.getTween(this.main).to({
                scale: 1.2,
            });
        };
        ToolBase.prototype.zoomOut = function () {
            yyw.getTween(this.main).to({
                scale: 1,
            });
        };
        return ToolBase;
    }(yyw.Base));
    game.ToolBase = ToolBase;
})(game || (game = {}));
