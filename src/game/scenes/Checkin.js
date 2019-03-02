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
var __read = (this && this.__read) || function (o, n) {
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
};
var game;
(function (game) {
    var STORAGE_KEY = "CHECKIN";
    var bonus = [[100], [150], [200], [250, "breaker"], [300], [350], [400, "shuffle"]];
    var Checkin = /** @class */ (function (_super) {
        __extends(Checkin, _super);
        function Checkin() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Checkin.prototype.destroy = function () {
            //
        };
        /**
         * 准备榜单
         */
        Checkin.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var days_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _super.prototype.createView.call(this, fromChildrenCreated);
                            if (!fromChildrenCreated) return [3 /*break*/, 2];
                            return [4 /*yield*/, yyw.checkin.get()];
                        case 1:
                            days_1 = _a.sent();
                            yyw.eachChild(this.groupDays, function (child, index) {
                                var day = days_1[index];
                                if (day.offset > 0) {
                                    // 未来
                                    child.alpha = 0.5;
                                }
                                else if (day.checked) {
                                    // 已签到，显示勾
                                    child.getChildAt(child.numChildren - 1).visible = true;
                                }
                                else {
                                    var isPast_1 = day.offset < 0;
                                    // 过去
                                    if (isPast_1) {
                                        child.alpha = 0.75;
                                    }
                                    // 当日可签到，以前需要判断补签
                                    if (!isPast_1 || yyw.reward.can()) {
                                        var offTap_1 = yyw.onTap(child, function () { return __awaiter(_this, void 0, void 0, function () {
                                            var _a, coins, type;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        if (!isPast_1) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, yyw.reward.apply("checkin")];
                                                    case 1:
                                                        if (!(_b.sent())) {
                                                            return [2 /*return*/];
                                                        }
                                                        _b.label = 2;
                                                    case 2:
                                                        offTap_1();
                                                        _a = __read(bonus[index], 2), coins = _a[0], type = _a[1];
                                                        return [4 /*yield*/, yyw.award.save({ coins: coins })];
                                                    case 3:
                                                        _b.sent();
                                                        yyw.emit("COINS_GOT", {
                                                            type: "checkin",
                                                            amount: coins,
                                                        });
                                                        if (type) {
                                                            yyw.emit("TOOL_GOT", {
                                                                type: type,
                                                                amount: 1,
                                                            });
                                                        }
                                                        yyw.checkin.save(index);
                                                        child.alpha = 1;
                                                        child.getChildAt(child.numChildren - 1).visible = true;
                                                        yyw.showToast((isPast_1 ? "补签" : "签到") + "\u6210\u529F\uFF0C\u5956\u52B1\u5DF2\u53D1\u653E");
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    }
                                }
                            });
                            _a.label = 2;
                        case 2:
                            yyw.analysis.addEvent("7进入场景", { s: "每日签到" });
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Checkin;
    }(yyw.Base));
    game.Checkin = Checkin;
})(game || (game = {}));
