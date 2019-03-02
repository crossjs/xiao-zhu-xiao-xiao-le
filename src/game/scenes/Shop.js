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
    var Shop = /** @class */ (function (_super) {
        __extends(Shop, _super);
        function Shop() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // private btn0: eui.Button;
            // private btn1: eui.Button;
            // private btn2: eui.Button;
            // private items: eui.Group;
            _this.prices = [1000, 2000, 1500];
            _this.goods = ["valueUp", "shuffle", "breaker"];
            return _this;
        }
        Shop.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var i;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _super.prototype.createView.call(this, fromChildrenCreated);
                            if (fromChildrenCreated) {
                                // yyw.showToast("请访问公众号「游鱼玩」，发送消息「兑换」");
                                for (i = 0; i < this.goods.length; i++) {
                                    (function (index) {
                                        yyw.onTap(_this["btn" + index], function () { return __awaiter(_this, void 0, void 0, function () {
                                            var type, coins;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        type = this.goods[index];
                                                        coins = this.prices[index];
                                                        return [4 /*yield*/, yyw.award.save({
                                                                coins: -coins,
                                                            })];
                                                    case 1:
                                                        _a.sent();
                                                        yyw.emit("COINS_USED", {
                                                            type: type,
                                                            amount: coins,
                                                        });
                                                        yyw.showToast("兑换成功");
                                                        yyw.emit("TOOL_GOT", {
                                                            type: type,
                                                            amount: 1,
                                                        });
                                                        // 刷新
                                                        return [4 /*yield*/, this.update()];
                                                    case 2:
                                                        // 刷新
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    })(i);
                                }
                            }
                            return [4 /*yield*/, this.update()];
                        case 1:
                            _a.sent();
                            yyw.analysis.addEvent("7进入场景", { s: "道具兑换" });
                            return [2 /*return*/];
                    }
                });
            });
        };
        Shop.prototype.update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var coins, i, enabled, btn, grp, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, yyw.pbl.me()];
                        case 1:
                            coins = (_a.sent()).coins;
                            for (i = 0; i < this.goods.length; i++) {
                                enabled = coins >= this.prices[i];
                                btn = this["btn" + i];
                                grp = this["grp" + i];
                                btn.enabled = enabled;
                                if (enabled) {
                                    grp.filters = null;
                                }
                                else {
                                    yyw.gray(grp);
                                }
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            egret.error(error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return Shop;
    }(yyw.Base));
    game.Shop = Shop;
})(game || (game = {}));
