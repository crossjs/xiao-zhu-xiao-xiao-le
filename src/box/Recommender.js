var box;
(function (box) {
    var ACTION_INIT = 0;
    var ACTION_JUMP = 1;
    var ACTION_FAIL = 2;
    var defaultOrigins = {
        box: "https://box.minipx.cn",
        log: "https://log.minipx.cn",
    };
    function noop() {
        // empty
    }
    function caniuse(ability) {
        return typeof wx !== "undefined" && Boolean(wx[ability]);
    }
    function request(_a) {
        var url = _a.url, data = _a.data, _b = _a.method, method = _b === void 0 ? "GET" : _b;
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url,
                data: data || {},
                method: method,
                success: function (res) {
                    resolve(res.data);
                },
                fail: function (res) {
                    reject(res);
                },
            });
        });
    }
    function makeArray(length, value) {
        var a = [];
        while (length--) {
            a.push(value);
        }
        return a;
    }
    function weightedRandom(items, indexes) {
        indexes =
            indexes ||
                items.reduce(function (arr, _a, idx) {
                    var _b = _a.weight, weight = _b === void 0 ? 1 : _b;
                    return arr.concat(makeArray(weight, idx));
                }, []);
        var index = indexes[Math.floor(Math.random() * indexes.length)];
        return {
            item: items[index],
            indexes: indexes.filter(function (i) { return i !== index; }),
        };
    }
    var Recommender = /** @class */ (function () {
        function Recommender(_a) {
            var appId = _a.appId, openid = _a.openid, _b = _a.onReady, onReady = _b === void 0 ? noop : _b, _c = _a.onChange, onChange = _c === void 0 ? noop : _c, _d = _a.delay, delay = _d === void 0 ? 8 : _d, _e = _a.origins, origins = _e === void 0 ? defaultOrigins : _e;
            var _this = this;
            if (!appId) {
                console.error("请传入当前游戏的 appId");
                return;
            }
            // 只允许存在一个
            if (Recommender.instance) {
                if (Recommender.instance.openid === openid
                    && Recommender.instance.appId === appId) {
                    Recommender.instance.onReady(onReady);
                    Recommender.instance.onChange(onChange);
                    return Recommender.instance;
                }
                Recommender.instance.destroy();
            }
            Recommender.instance = this;
            if (!openid) {
                console.warn("请传入当前玩家的 openid");
            }
            this.isReady = false;
            this.readyHandlers = [];
            this.changeHandlers = [];
            this.sessionId = Math.random()
                .toString(16)
                .substring(2);
            this.loopHandler = 0;
            this.nextIndex = 0;
            this.appId = appId;
            this.openid = openid;
            // 循环间隔
            this.delay = delay;
            this.origins = origins;
            // 订阅
            this.onReady(onReady);
            this.onChange(onChange);
            this.games = [];
            if (caniuse("navigateToMiniProgram")) {
                request({
                    url: this.origins.box + "/api/client/unions?appId=" + this.appId,
                })
                    .then(function (data) {
                    if (data && data.items && data.items.length) {
                        _this.unionid = data.id;
                        _this.games = data.items.map(function (item) {
                            return Object.assign(item, {
                                iconUrl: "" + _this.origins.box + item.iconUrl,
                            });
                        });
                        _this.dispatchReady(_this.games);
                        _this.start();
                    }
                    else {
                        _this.dispatchReady(null);
                    }
                })
                    .catch(function (e) {
                    console.error(e);
                    _this.dispatchReady(null);
                });
            }
            else {
                egret.setTimeout(function () {
                    _this.dispatchReady(null);
                }, this, 100);
            }
        }
        Recommender.prototype.start = function () {
            this.report(ACTION_INIT);
            this.next();
        };
        Recommender.prototype.pause = function () {
            if (this.loopHandler) {
                egret.clearTimeout(this.loopHandler);
                this.loopHandler = 0;
            }
        };
        Recommender.prototype.resume = function () {
            this.next();
        };
        Recommender.prototype.next = function () {
            var _this = this;
            var game = this.games[this.nextIndex];
            this.dispatchChange(game);
            if (this.games.length > 1) {
                this.nextIndex = (this.nextIndex + 1) % this.games.length;
                this.loopHandler = egret.setTimeout(function () {
                    _this.next();
                }, this, this.delay * 1000);
            }
        };
        Recommender.prototype.getGames = function (size) {
            if (!size) {
                return this.games;
            }
            var selected = [];
            var indexes;
            for (var i = 0; i < size; i++) {
                var res = weightedRandom(this.games, indexes);
                indexes = res.indexes;
                if (res.item) {
                    selected.push(res.item);
                }
            }
            return selected;
        };
        Recommender.prototype.navigateTo = function (game) {
            var _this = this;
            var appId = game.appId, _a = game.path, path = _a === void 0 ? "" : _a, _b = game.extraData, extraData = _b === void 0 ? {} : _b;
            wx.navigateToMiniProgram({
                appId: appId,
                path: path,
                extraData: Object.assign({
                    yyw: this.unionid,
                }, extraData),
                success: function () {
                    _this.report(ACTION_JUMP, game);
                },
                fail: function () {
                    _this.report(ACTION_FAIL, game);
                },
            });
        };
        Recommender.prototype.dispatchReady = function (value) {
            var _this = this;
            this.isReady = true;
            this.readyHandlers.forEach(function (cb) {
                cb(value, _this);
            });
        };
        Recommender.prototype.dispatchChange = function (value) {
            var _this = this;
            this.changeHandlers.forEach(function (cb) {
                cb(value, _this);
            });
        };
        Recommender.prototype.onReady = function (cb) {
            var _this = this;
            if (typeof cb !== "function") {
                return;
            }
            if (this.isReady) {
                cb(this.games.length ? this.games : null, this);
                return;
            }
            // 避免重复添加
            if (this.readyHandlers.indexOf(cb) === -1) {
                this.readyHandlers.push(cb);
                return function () {
                    _this.offReady(cb);
                };
            }
        };
        Recommender.prototype.onChange = function (cb) {
            var _this = this;
            if (typeof cb !== "function") {
                return;
            }
            // 避免重复添加
            if (this.changeHandlers.indexOf(cb) === -1) {
                this.changeHandlers.push(cb);
                return function () {
                    _this.offChange(cb);
                };
            }
        };
        Recommender.prototype.report = function (type, _a) {
            var _b = (_a === void 0 ? {} : _a).appId, toAppId = _b === void 0 ? 0 : _b;
            var data = [
                this.unionid,
                type,
                this.appId,
                this.openid,
                toAppId,
                this.sessionId,
            ];
            request({
                // 直接使用 GET，更便宜
                url: this.origins.log + "/api/reports?data=" + data.join(","),
            });
        };
        Recommender.prototype.destroy = function () {
            this.pause();
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    this[i] = null;
                }
            }
        };
        Recommender.prototype.offReady = function (cb) {
            var index = this.readyHandlers.indexOf(cb);
            if (index !== -1) {
                this.readyHandlers.splice(index, 1);
            }
        };
        Recommender.prototype.offChange = function (cb) {
            var index = this.changeHandlers.indexOf(cb);
            if (index !== -1) {
                this.changeHandlers.splice(index, 1);
            }
        };
        return Recommender;
    }());
    box.Recommender = Recommender;
    var instance;
    function getInstance() {
        if (!instance) {
            var openid = yyw.USER.openid;
            if (openid) {
                // 初始化交叉营销
                instance = new Recommender({
                    appId: APP_ID,
                    openid: openid,
                });
            }
            else {
                egret.warn("Recommender 初始化失败，当前用户未登录");
            }
        }
        return instance;
    }
    function onReady(onRecommenderReady) {
        if (yyw.CONFIG.boxEnabled) {
            var i = getInstance();
            if (i) {
                i.onReady(onRecommenderReady);
            }
            else {
                yyw.once("LOGIN", function () {
                    onReady(onRecommenderReady);
                });
            }
        }
    }
    box.onReady = onReady;
    function onChange(onRecommenderChange) {
        if (yyw.CONFIG.boxEnabled) {
            var i = getInstance();
            if (i) {
                i.onChange(onRecommenderChange);
            }
            else {
                yyw.once("LOGIN", function () {
                    onChange(onRecommenderChange);
                });
            }
        }
    }
    box.onChange = onChange;
})(box || (box = {}));
