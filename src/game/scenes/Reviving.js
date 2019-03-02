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
    var Reviving = /** @class */ (function (_super) {
        __extends(Reviving, _super);
        function Reviving() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.score = 0;
            return _this;
        }
        Reviving.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // 放在这里注册，确保优先级
                    yyw.on("GAME_DATA", function (_a) {
                        var score = _a.data.score;
                        _this.score = score;
                    });
                    return [2 /*return*/];
                });
            });
        };
        Reviving.prototype.destroy = function () {
            this.removeTop3();
        };
        Reviving.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var canVideo;
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        canVideo = yyw.reward.can("revive", "video");
                        this.tfdTip.text = (canVideo ? "观看视频" : "转发到群") + "\u83B7\u5F97\u590D\u6D3B\u673A\u4F1A";
                        yyw.onTap(this.btnOK, function () { return __awaiter(_this, void 0, void 0, function () {
                            var type;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, yyw.reward.apply("revive")];
                                    case 1:
                                        type = _a.sent();
                                        if (!type) return [3 /*break*/, 3];
                                        return [4 /*yield*/, yyw.director.escape()];
                                    case 2:
                                        _a.sent();
                                        yyw.emit("TOOL_GOT", {
                                            type: "livesUp",
                                            amount: 1,
                                        });
                                        yyw.analysis.onRunning("revive", type);
                                        return [3 /*break*/, 5];
                                    case 3:
                                        yyw.showToast("复活失败");
                                        return [4 /*yield*/, yyw.director.escape()];
                                    case 4:
                                        _a.sent();
                                        yyw.director.toScene("ending", true);
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        yyw.onTap(this.btnEscape, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, yyw.director.escape()];
                                    case 1:
                                        _a.sent();
                                        yyw.director.toScene("ending", true);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    this.tfdScore.text = "\u672C\u5C40\u5F97\u5206\uFF1A" + this.score;
                    this.createTop3();
                    return [2 /*return*/];
                });
            });
        };
        Reviving.prototype.createTop3 = function () {
            if (!this.bmpTop3) {
                var _a = this.board, width = _a.width, height = _a.height;
                this.bmpTop3 = yyw.sub.createDisplayObject(null, width, height);
                this.board.addChild(this.bmpTop3);
                // 主域向子域发送自定义消息
                yyw.sub.postMessage({
                    command: "openTop3",
                    width: width,
                    height: height,
                });
            }
        };
        Reviving.prototype.removeTop3 = function () {
            yyw.removeElement(this.bmpTop3);
            this.bmpTop3 = null;
            yyw.sub.postMessage({
                command: "closeTop3",
            });
        };
        return Reviving;
    }(yyw.Base));
    game.Reviving = Reviving;
})(game || (game = {}));
