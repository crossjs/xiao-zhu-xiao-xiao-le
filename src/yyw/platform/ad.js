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
var yyw;
(function (yyw) {
    yyw.BANNER_HEIGHT = 262;
    var bannerAd;
    var onBannerAdResize = function (_a) {
        var width = _a.width, height = _a.height;
        // 居中
        bannerAd.style.left = (yyw.CONFIG.systemInfo.windowWidth - width) / 2;
        // 贴底
        bannerAd.style.top = yyw.CONFIG.systemInfo.windowHeight - height;
    };
    function showBannerAd(adUnitId) {
        if (adUnitId === void 0) { adUnitId = yyw.CONFIG.bannerAd; }
        return __awaiter(this, void 0, void 0, function () {
            var promised;
            return __generator(this, function (_a) {
                if (!adUnitId) {
                    return [2 /*return*/, false];
                }
                if (bannerAd) {
                    bannerAd.offResize(onBannerAdResize);
                    bannerAd.destroy();
                }
                bannerAd = wx.createBannerAd({
                    adUnitId: adUnitId,
                    style: {
                        left: 0,
                        top: yyw.CONFIG.systemInfo.windowHeight - yyw.BANNER_HEIGHT / 2,
                        width: yyw.CONFIG.systemInfo.windowWidth,
                        height: yyw.BANNER_HEIGHT / 2,
                    },
                });
                bannerAd.onResize(onBannerAdResize);
                promised = new Promise(function (resolve, reject) {
                    bannerAd.onLoad(function () {
                        bannerAd.show();
                        resolve(true);
                    });
                    bannerAd.onError(function () {
                        resolve(false);
                    });
                });
                return [2 /*return*/, promised];
            });
        });
    }
    yyw.showBannerAd = showBannerAd;
    function hideBannerAd() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!bannerAd) {
                    return [2 /*return*/];
                }
                return [2 /*return*/, bannerAd.hide()];
            });
        });
    }
    yyw.hideBannerAd = hideBannerAd;
    var videoAd;
    /**
     * true: 播放完成
     * false: 用户取消
     * undefined: 调起失败
     */
    function showVideoAd(adUnitId) {
        if (adUnitId === void 0) { adUnitId = yyw.CONFIG.rewardAd; }
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!adUnitId) {
                            return [2 /*return*/];
                        }
                        if (!videoAd) {
                            videoAd = wx.createRewardedVideoAd({
                                adUnitId: adUnitId,
                            });
                            videoAd.onError(function (_a) {
                                var errMsg = _a.errMsg;
                                // showToast(errMsg);
                            });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, videoAd.show()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/];
                    case 4: return [2 /*return*/, new Promise(function (resolve, reject) {
                            var callback = function (_a) {
                                var _b = (_a === void 0 ? {} : _a).isEnded, isEnded = _b === void 0 ? false : _b;
                                videoAd.offClose(callback);
                                resolve(isEnded);
                            };
                            videoAd.onClose(callback);
                        })];
                }
            });
        });
    }
    yyw.showVideoAd = showVideoAd;
})(yyw || (yyw = {}));
