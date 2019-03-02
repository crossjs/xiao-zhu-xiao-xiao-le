var box;
(function (box) {
    const ACTION_INIT = 0;
    const ACTION_JUMP = 1;
    const ACTION_FAIL = 2;
    const defaultOrigins = {
        box: "https://box.minipx.cn",
        log: "https://log.minipx.cn",
    };
    function noop() {
    }
    function caniuse(ability) {
        return typeof wx !== "undefined" && Boolean(wx[ability]);
    }
    function request({ url, data, method = "GET" }) {
        return new Promise((resolve, reject) => {
            wx.request({
                url,
                data: data || {},
                method,
                success(res) {
                    resolve(res.data);
                },
                fail(res) {
                    reject(res);
                },
            });
        });
    }
    function makeArray(length, value) {
        const a = [];
        while (length--) {
            a.push(value);
        }
        return a;
    }
    function weightedRandom(items, indexes) {
        indexes =
            indexes ||
                items.reduce((arr, { weight = 1 }, idx) => arr.concat(makeArray(weight, idx)), []);
        const index = indexes[Math.floor(Math.random() * indexes.length)];
        return {
            item: items[index],
            indexes: indexes.filter((i) => i !== index),
        };
    }
    class Recommender {
        constructor({ appId, openid, onReady = noop, onChange = noop, delay = 8, origins = defaultOrigins, }) {
            if (!appId) {
                console.error("请传入当前游戏的 appId");
                return;
            }
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
            this.delay = delay;
            this.origins = origins;
            this.onReady(onReady);
            this.onChange(onChange);
            this.games = [];
            if (caniuse("navigateToMiniProgram")) {
                request({
                    url: `${this.origins.box}/api/client/unions?appId=${this.appId}`,
                })
                    .then((data) => {
                    if (data && data.items && data.items.length) {
                        this.unionid = data.id;
                        this.games = data.items.map((item) => Object.assign(item, {
                            iconUrl: `${this.origins.box}${item.iconUrl}`,
                        }));
                        this.dispatchReady(this.games);
                        this.start();
                    }
                    else {
                        this.dispatchReady(null);
                    }
                })
                    .catch((e) => {
                    console.error(e);
                    this.dispatchReady(null);
                });
            }
            else {
                egret.setTimeout(() => {
                    this.dispatchReady(null);
                }, this, 100);
            }
        }
        start() {
            this.report(ACTION_INIT);
            this.next();
        }
        pause() {
            if (this.loopHandler) {
                egret.clearTimeout(this.loopHandler);
                this.loopHandler = 0;
            }
        }
        resume() {
            this.next();
        }
        next() {
            const game = this.games[this.nextIndex];
            this.dispatchChange(game);
            if (this.games.length > 1) {
                this.nextIndex = (this.nextIndex + 1) % this.games.length;
                this.loopHandler = egret.setTimeout(() => {
                    this.next();
                }, this, this.delay * 1000);
            }
        }
        getGames(size) {
            if (!size) {
                return this.games;
            }
            const selected = [];
            let indexes;
            for (let i = 0; i < size; i++) {
                const res = weightedRandom(this.games, indexes);
                indexes = res.indexes;
                if (res.item) {
                    selected.push(res.item);
                }
            }
            return selected;
        }
        navigateTo(game) {
            const { appId, path = "", extraData = {} } = game;
            wx.navigateToMiniProgram({
                appId,
                path,
                extraData: Object.assign({
                    yyw: this.unionid,
                }, extraData),
                success: () => {
                    this.report(ACTION_JUMP, game);
                },
                fail: () => {
                    this.report(ACTION_FAIL, game);
                },
            });
        }
        dispatchReady(value) {
            this.isReady = true;
            this.readyHandlers.forEach((cb) => {
                cb(value, this);
            });
        }
        dispatchChange(value) {
            this.changeHandlers.forEach((cb) => {
                cb(value, this);
            });
        }
        onReady(cb) {
            if (typeof cb !== "function") {
                return;
            }
            if (this.isReady) {
                cb(this.games.length ? this.games : null, this);
                return;
            }
            if (this.readyHandlers.indexOf(cb) === -1) {
                this.readyHandlers.push(cb);
                return () => {
                    this.offReady(cb);
                };
            }
        }
        onChange(cb) {
            if (typeof cb !== "function") {
                return;
            }
            if (this.changeHandlers.indexOf(cb) === -1) {
                this.changeHandlers.push(cb);
                return () => {
                    this.offChange(cb);
                };
            }
        }
        report(type, { appId: toAppId = 0 } = {}) {
            const data = [
                this.unionid,
                type,
                this.appId,
                this.openid,
                toAppId,
                this.sessionId,
            ];
            request({
                url: `${this.origins.log}/api/reports?data=${data.join(",")}`,
            });
        }
        destroy() {
            this.pause();
            for (const i in this) {
                if (this.hasOwnProperty(i)) {
                    this[i] = null;
                }
            }
        }
        offReady(cb) {
            const index = this.readyHandlers.indexOf(cb);
            if (index !== -1) {
                this.readyHandlers.splice(index, 1);
            }
        }
        offChange(cb) {
            const index = this.changeHandlers.indexOf(cb);
            if (index !== -1) {
                this.changeHandlers.splice(index, 1);
            }
        }
    }
    box.Recommender = Recommender;
    let instance;
    function getInstance() {
        if (!instance) {
            const { openid } = yyw.USER;
            if (openid) {
                instance = new Recommender({
                    appId: APP_ID,
                    openid,
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
            const i = getInstance();
            if (i) {
                i.onReady(onRecommenderReady);
            }
            else {
                yyw.once("LOGIN", () => {
                    onReady(onRecommenderReady);
                });
            }
        }
    }
    box.onReady = onReady;
    function onChange(onRecommenderChange) {
        if (yyw.CONFIG.boxEnabled) {
            const i = getInstance();
            if (i) {
                i.onChange(onRecommenderChange);
            }
            else {
                yyw.once("LOGIN", () => {
                    onChange(onRecommenderChange);
                });
            }
        }
    }
    box.onChange = onChange;
})(box || (box = {}));
