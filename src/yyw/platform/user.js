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
    var USER_KEY = "USER";
    yyw.USER = {};
    function getUserInfo() {
        return new Promise(function (resolve) {
            wx.getUserInfo({
                withCredentials: false,
                success: function (_a) {
                    var errMsg = _a.errMsg, userInfo = _a.userInfo;
                    if (errMsg === "getUserInfo:ok") {
                        resolve(userInfo);
                    }
                    else {
                        // 用户拒绝，直接登录
                        resolve(null);
                    }
                },
                fail: function () {
                    resolve(null);
                },
            });
        });
    }
    function isScopeAuthorized(scope) {
        if (scope === void 0) { scope = "userInfo"; }
        return new Promise(function (resolve) {
            wx.getSetting({
                success: function (res) {
                    resolve(res.authSetting["scope." + scope] === true);
                },
                fail: function () {
                    resolve(false);
                },
            });
        });
    }
    function login(fullUserInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var isLoggedIn, currentUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isLoggedIn = !!yyw.USER.openid;
                        if (!!fullUserInfo) return [3 /*break*/, 2];
                        return [4 /*yield*/, getUserInfo()];
                    case 1:
                        // 去微信取
                        fullUserInfo = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, yyw.cloud.call("login", { fullUserInfo: fullUserInfo })];
                    case 3:
                        currentUser = _a.sent();
                        // 合入到全局
                        Object.assign(yyw.USER, currentUser);
                        return [4 /*yield*/, yyw.storage.set(USER_KEY, yyw.USER)];
                    case 4:
                        _a.sent();
                        // 如果之前是未登录状态，则通知登录
                        if (!isLoggedIn) {
                            yyw.emit("LOGIN");
                        }
                        return [2 /*return*/, yyw.USER];
                }
            });
        });
    }
    function logout() {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        for (key in yyw.USER) {
                            if (yyw.USER.hasOwnProperty(key)) {
                                delete yyw.USER[key];
                            }
                        }
                        return [4 /*yield*/, yyw.storage.remove(USER_KEY)];
                    case 1:
                        _a.sent();
                        yyw.emit("LOGOUT");
                        return [2 /*return*/];
                }
            });
        });
    }
    yyw.logout = logout;
    function getLogin() {
        return __awaiter(this, void 0, void 0, function () {
            var cachedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!yyw.USER.openid) return [3 /*break*/, 2];
                        return [4 /*yield*/, yyw.storage.get(USER_KEY)];
                    case 1:
                        cachedUser = _a.sent();
                        if (cachedUser) {
                            Object.assign(yyw.USER, cachedUser);
                        }
                        _a.label = 2;
                    case 2:
                        if (!!yyw.USER.openid) return [3 /*break*/, 4];
                        return [4 /*yield*/, login()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, !!yyw.USER.openid];
                }
            });
        });
    }
    yyw.getLogin = getLogin;
    /**
     * 创建一个的获取用户信息的隐形按钮
     */
    function createUserInfoButton(_a) {
        var left = _a.left, top = _a.top, width = _a.width, height = _a.height, onTap = _a.onTap;
        return __awaiter(this, void 0, void 0, function () {
            var authorized, scale, button;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, isScopeAuthorized("userInfo")];
                    case 1:
                        authorized = _b.sent();
                        if (authorized) {
                            return [2 /*return*/];
                        }
                        scale = 750 / yyw.CONFIG.systemInfo.windowWidth;
                        button = wx.createUserInfoButton({
                            type: "text",
                            style: {
                                left: left / scale,
                                top: top / scale,
                                width: width / scale,
                                height: height / scale,
                                lineHeight: 0,
                                backgroundColor: "transparent",
                                color: "transparent",
                                textAlign: "center",
                                fontSize: 0,
                                borderRadius: 0,
                                borderColor: "transparent",
                                borderWidth: 0,
                            },
                            withCredentials: false,
                        });
                        button.onTap(function (_a) {
                            var errMsg = _a.errMsg, userInfo = _a.userInfo;
                            return __awaiter(_this, void 0, void 0, function () {
                                var authorized, isLoggedIn, error_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            button.destroy();
                                            authorized = true;
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 7, , 9]);
                                            if (!(errMsg === "getUserInfo:ok")) return [3 /*break*/, 3];
                                            // 取到加密过的用户信息，丢到服务端去解密
                                            return [4 /*yield*/, login(userInfo)];
                                        case 2:
                                            // 取到加密过的用户信息，丢到服务端去解密
                                            _b.sent();
                                            return [3 /*break*/, 6];
                                        case 3:
                                            authorized = false;
                                            return [4 /*yield*/, getLogin()];
                                        case 4:
                                            isLoggedIn = _b.sent();
                                            if (!!isLoggedIn) return [3 /*break*/, 6];
                                            // 用户拒绝，直接登录
                                            return [4 /*yield*/, login()];
                                        case 5:
                                            // 用户拒绝，直接登录
                                            _b.sent();
                                            _b.label = 6;
                                        case 6: return [3 /*break*/, 9];
                                        case 7:
                                            error_1 = _b.sent();
                                            // 几率性地解码失败，再试一次
                                            return [4 /*yield*/, login()];
                                        case 8:
                                            // 几率性地解码失败，再试一次
                                            _b.sent();
                                            return [3 /*break*/, 9];
                                        case 9:
                                            if (onTap) {
                                                onTap(authorized);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [2 /*return*/, button];
                }
            });
        });
    }
    yyw.createUserInfoButton = createUserInfoButton;
})(yyw || (yyw = {}));
