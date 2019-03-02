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
    var Ending = /** @class */ (function (_super) {
        __extends(Ending, _super);
        function Ending() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.gameData = {
                level: 0,
                combo: 0,
                score: 0,
            };
            return _this;
        }
        Ending.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // 放在这里注册，确保优先级
                    yyw.on("GAME_DATA", function (_a) {
                        var _b = _a.data, score = _b.score, level = _b.level, combo = _b.combo;
                        _this.gameData = {
                            score: score,
                            level: level,
                            combo: Math.max(combo, _this.gameData.combo),
                        };
                    });
                    return [2 /*return*/];
                });
            });
        };
        Ending.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        yyw.onTap(this.btnOK, function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, windowWidth, windowHeight, _b, score, combo, _c, width, height, _d, x, y, scaleX, scaleY;
                            return __generator(this, function (_e) {
                                _a = yyw.CONFIG.systemInfo, windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
                                _b = this.gameData, score = _b.score, combo = _b.combo;
                                _c = this.main, width = _c.width, height = _c.height;
                                _d = this.main.localToGlobal(), x = _d.x, y = _d.y;
                                scaleX = windowWidth / 375;
                                scaleY = scaleX * windowHeight / 667;
                                yyw.share({
                                    title: "\u5662\u8036\uFF01\u6211\u5F97\u5230\u4E86 " + score + " \u5206\u4E0E " + combo + " \u6B21\u8FDE\u51FB",
                                    imageUrl: canvas.toTempFilePathSync({
                                        x: x,
                                        y: y,
                                        width: width * scaleX,
                                        height: height * scaleY,
                                        destWidth: 500,
                                        destHeight: 400,
                                    }),
                                    ald_desc: "ending",
                                });
                                return [2 /*return*/];
                            });
                        }); });
                        yyw.onTap(this.btnEscape, function () {
                            yyw.emit("RESTART");
                        });
                    }
                    Object.entries(this.gameData).forEach(function (_a) {
                        var _b = __read(_a, 2), key = _b[0], value = _b[1];
                        var field = _this["tfd" + key.replace(/^\w/, function ($0) { return $0.toUpperCase(); })];
                        if (field) {
                            field.text = "" + value;
                        }
                    });
                    yyw.emit("GAME_OVER", this.gameData);
                    yyw.analysis.onEnd();
                    return [2 /*return*/];
                });
            });
        };
        return Ending;
    }(yyw.Base));
    game.Ending = Ending;
})(game || (game = {}));
