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
    var Award = /** @class */ (function (_super) {
        __extends(Award, _super);
        function Award() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // public async hideModal() {
        //   this.btnOK.visible = false;
        //   this.btnKO.visible = false;
        //   yyw.fadeOut(this.bg);
        //   await yyw.twirlOut(this.modal);
        // }
        Award.prototype.destroy = function () {
            yyw.removeTweens(this.bg);
            yyw.removeTweens(this.modal);
            this.bg.visible = false;
            this.modal.visible = false;
            this.hdr.visible = false;
            this.tfdTip.visible = false;
            this.btnOK.visible = false;
            this.btnEscape.visible = false;
        };
        Award.prototype.createView = function (fromChildrenCreated) {
            return __awaiter(this, void 0, void 0, function () {
                var canVideo;
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.createView.call(this, fromChildrenCreated);
                    if (fromChildrenCreated) {
                        canVideo = yyw.reward.can("coin", "video");
                        this.tfdTip.text = (canVideo ? "观看视频" : "转发到群") + "\u83B7\u5F97 10 \u500D\u5956\u52B1";
                        yyw.onTap(this.btnOK, function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, windowWidth, windowHeight, _b, width, height, _c, x, y, scaleX, scaleY;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _a = yyw.CONFIG.systemInfo, windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
                                        _b = this.main, width = _b.width, height = _b.height;
                                        _c = this.main.localToGlobal(), x = _c.x, y = _c.y;
                                        scaleX = windowWidth / 375;
                                        scaleY = scaleX * windowHeight / 667;
                                        return [4 /*yield*/, yyw.reward.apply("coin", {
                                                share: {
                                                    title: "\u5662\u8036\uFF01\u6211\u6316\u5230\u4E86 " + this.coins + " \u679A\u91D1\u5E01",
                                                    imageUrl: canvas.toTempFilePathSync({
                                                        x: x,
                                                        y: y,
                                                        width: width * scaleX,
                                                        height: height * scaleY,
                                                        destWidth: 500,
                                                        destHeight: 400,
                                                    }),
                                                    ald_desc: "magic",
                                                },
                                            })];
                                    case 1:
                                        if (!_d.sent()) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.saveCoins(10)];
                                    case 2:
                                        _d.sent();
                                        _d.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        yyw.onTap(this.btnEscape, function (e) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        e.stopImmediatePropagation();
                                        return [4 /*yield*/, this.saveCoins()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    this.showModal();
                    return [2 /*return*/];
                });
            });
        };
        Award.prototype.showModal = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            yyw.fadeIn(this.bg);
                            return [4 /*yield*/, yyw.twirlIn(this.modal)];
                        case 1:
                            _a.sent();
                            this.hdr.visible = true;
                            this.tfdTip.visible = true;
                            this.btnOK.visible = true;
                            this.btnEscape.visible = true;
                            this.coins = yyw.random(100) + 100;
                            this.tfdCoins.text = "" + this.coins;
                            return [2 /*return*/];
                    }
                });
            });
        };
        Award.prototype.saveCoins = function (multiple) {
            if (multiple === void 0) { multiple = 1; }
            return __awaiter(this, void 0, void 0, function () {
                var coins;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            yyw.director.escape();
                            game.CoinsSound.play();
                            coins = this.coins * multiple;
                            // TODO 入袋动画
                            return [4 /*yield*/, yyw.award.save({
                                    coins: coins,
                                })];
                        case 1:
                            // TODO 入袋动画
                            _a.sent();
                            yyw.emit("COINS_GOT", {
                                type: "magic",
                                amount: coins,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Award;
    }(yyw.Base));
    game.Award = Award;
})(game || (game = {}));
