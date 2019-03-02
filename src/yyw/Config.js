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
    var serverOrigin = SERVER_ORIGIN;
    var systemInfo = wx.getSystemInfoSync();
    var launchOptions = wx.getLaunchOptionsSync();
    // 数字越大，游戏节奏越慢
    var speedRatio = 1.5;
    var coinReward = 0;
    var shopStatus = 0;
    var boxEnabled = true;
    var toolAmount = 3;
    var toolReward = 0;
    var checkinReward = 0;
    var reviveReward = 0;
    var bannerAd = "";
    var rewardAd = "";
    var soundEnabled = true;
    var vibrationEnabled = true;
    yyw.CONFIG = {
        get systemInfo() {
            return systemInfo;
        },
        get launchOptions() {
            return launchOptions;
        },
        get serverOrigin() {
            return serverOrigin;
        },
        /**
         * 游戏动画速率
         */
        get speedRatio() {
            return speedRatio;
        },
        get coinReward() {
            return coinReward;
        },
        set coinReward(value) {
            coinReward = value;
        },
        get shopStatus() {
            return shopStatus;
        },
        set shopStatus(value) {
            shopStatus = value;
        },
        get boxEnabled() {
            return boxEnabled;
        },
        set boxEnabled(value) {
            boxEnabled = value;
        },
        get toolAmount() {
            return toolAmount;
        },
        set toolAmount(value) {
            toolAmount = value;
        },
        get toolReward() {
            return toolReward;
        },
        set toolReward(value) {
            toolReward = value;
        },
        get checkinReward() {
            return checkinReward;
        },
        set checkinReward(value) {
            checkinReward = value;
        },
        get reviveReward() {
            return reviveReward;
        },
        set reviveReward(value) {
            reviveReward = value;
        },
        get bannerAd() {
            return bannerAd;
        },
        set bannerAd(value) {
            bannerAd = value;
        },
        get rewardAd() {
            return rewardAd;
        },
        set rewardAd(value) {
            rewardAd = value;
        },
        get soundEnabled() {
            return soundEnabled;
        },
        set soundEnabled(value) {
            soundEnabled = value;
        },
        get vibrationEnabled() {
            return vibrationEnabled;
        },
        set vibrationEnabled(value) {
            vibrationEnabled = value;
        },
    };
    function initConfig() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, coinReward_1, _c, shopStatus_1, _d, toolAmount_1, _e, toolReward_1, _f, checkinReward_1, _g, reviveReward_1, _h, boxEnabled_1, _j, bannerAd_1, _k, rewardAd_1, error_1;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _l.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, yyw.cloud.call("getConfig")];
                    case 1:
                        _a = _l.sent(), _b = _a.coinReward, coinReward_1 = _b === void 0 ? 0 : _b, _c = _a.shopStatus, shopStatus_1 = _c === void 0 ? 0 : _c, _d = _a.toolAmount, toolAmount_1 = _d === void 0 ? 3 : _d, _e = _a.toolReward, toolReward_1 = _e === void 0 ? 0 : _e, _f = _a.checkinReward, checkinReward_1 = _f === void 0 ? 0 : _f, _g = _a.reviveReward, reviveReward_1 = _g === void 0 ? 0 : _g, _h = _a.boxEnabled, boxEnabled_1 = _h === void 0 ? true : _h, _j = _a.bannerAd, bannerAd_1 = _j === void 0 ? "" : _j, _k = _a.rewardAd, rewardAd_1 = _k === void 0 ? "" : _k;
                        Object.assign(yyw.CONFIG, {
                            coinReward: coinReward_1,
                            shopStatus: shopStatus_1,
                            toolAmount: toolAmount_1,
                            toolReward: toolReward_1,
                            checkinReward: checkinReward_1,
                            reviveReward: reviveReward_1,
                            boxEnabled: boxEnabled_1,
                            bannerAd: bannerAd_1,
                            rewardAd: rewardAd_1,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _l.sent();
                        egret.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    yyw.initConfig = initConfig;
})(yyw || (yyw = {}));
