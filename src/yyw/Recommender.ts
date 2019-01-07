namespace yyw {
  const ACTION_INIT = 0;
  const ACTION_JUMP = 1;
  const ACTION_FAIL = 2;

  interface IRecommenderParams {
    [key: string]: any;
  }

  function noop() {
    // empty
  }

  function caniuse(ability: string) {
    return typeof wx !== "undefined" && Boolean(wx[ability]);
  }

  interface IRequestParams {
    url: any;
    data?: any;
    method?: any;
  }

  function request({ url, data, method = "GET" }: IRequestParams) {
    return new Promise((resolve, reject) => {
      if (caniuse("request")) {
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
      } else {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
              let res = xhr.responseText;
              try {
                res = JSON.parse(res);
              } catch (e) {
                reject(e);
              }
              resolve(res);
            } else {
              reject("server error: " + xhr.status);
            }
          }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
      }
    });
  }

  const defaultOrigins = {
    box: "https://box.minipx.cn",
    log: "https://log.minipx.cn",
  };

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
      items.reduce(
        (arr, { weight = 1 }, idx) => arr.concat(makeArray(weight, idx)),
        [],
      );
    const index = indexes[Math.floor(Math.random() * indexes.length)];
    return {
      item: items[index],
      indexes: indexes.filter((i) => i !== index),
    };
  }

  export class Recommender {
    public static instance: Recommender;
    private sessionId: string;
    private loopHandler: any;
    private nextIndex: any;
    private unionId: string;
    private appId: any;
    private openId: any;
    private delay: any;
    private origins: any;
    private readyHandlers: any[];
    private changeHandlers: any[];
    private games: any;
    private isReady: boolean;

    constructor({
      appId,
      openId,
      onReady = noop,
      onChange = noop,
      delay = 8,
      origins = defaultOrigins,
    }: IRecommenderParams) {
      if (!appId) {
        console.error("请传入当前游戏的 appId");
        return;
      }

      // 只允许存在一个
      if (Recommender.instance) {
        if (Recommender.instance.openId === openId
            && Recommender.instance.appId === appId) {
          Recommender.instance.onReady(onReady);
          Recommender.instance.onChange(onChange);
          return Recommender.instance;
        }
        Recommender.instance.destroy();
      }
      Recommender.instance = this;

      if (!openId) {
        console.warn("请传入当前玩家的 openId");
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
      this.openId = openId;
      // 循环间隔
      this.delay = delay;
      this.origins = origins;

      // 订阅
      this.onReady(onReady);
      this.onChange(onChange);

      this.games = [];
      if (caniuse("navigateToMiniProgram")) {
        const { box } = this.origins;
        request({
          url: `${box}/api/client/unions?appId=${this.appId}`,
        })
          .then((data: any) => {
            if (data && data.items && data.items.length) {
              this.unionId = data.id;
              this.games = data.items.map((item) =>
                (Object as any).assign(item, {
                  iconUrl: `${box}${item.iconUrl}`,
                }),
              );
              this.dispatchReady(this.games);
              this.start();
            } else {
              this.dispatchReady(null);
            }
          })
          .catch((e) => {
            console.error(e);
            this.dispatchReady(null);
          });
      } else {
        setTimeout(() => {
          this.dispatchReady(null);
        }, 100);
      }
    }

    public start() {
      this.report(ACTION_INIT);
      this.next();
    }

    public pause() {
      if (this.loopHandler) {
        clearTimeout(this.loopHandler);
        this.loopHandler = 0;
      }
    }

    public resume() {
      this.next();
    }

    public next() {
      const game = this.games[this.nextIndex];
      this.dispatchChange(game);

      if (this.games.length > 1) {
        this.nextIndex = (this.nextIndex + 1) % this.games.length;
        this.loopHandler = setTimeout(() => {
          this.next();
        }, this.delay * 1000);
      }
    }

    public getGames(size) {
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

    public navigateTo(game) {
      const { appId, path = "", extraData = {} } = game;
      wx.navigateToMiniProgram({
        appId,
        path,
        extraData: (Object as any).assign(
          {
            yyw: this.unionId,
          },
          extraData,
        ),
        success: () => {
          this.report(ACTION_JUMP, game);
        },
        fail: () => {
          this.report(ACTION_FAIL, game);
        },
      });
    }

    public dispatchReady(value) {
      this.isReady = true;
      this.readyHandlers.forEach((cb) => {
        cb(value, this);
      });
    }

    public dispatchChange(value) {
      this.changeHandlers.forEach((cb) => {
        cb(value, this);
      });
    }

    public onReady(cb) {
      if (typeof cb !== "function") {
        return;
      }
      if (this.isReady) {
        cb(this.games.length ? this.games : null, this);
        return;
      }
      if (this.readyHandlers.indexOf(cb) === -1) {
        this.readyHandlers.push(cb);
      }
    }

    public onChange(cb) {
      if (typeof cb !== "function") {
        return;
      }
      if (this.changeHandlers.indexOf(cb) === -1) {
        this.changeHandlers.push(cb);
      }
    }

    public report(type, { appId: toAppId = 0 } = {}) {
      const data = [
        this.unionId,
        type,
        this.appId,
        this.openId,
        toAppId,
        this.sessionId,
      ];
      request({
        // 直接使用 GET，更便宜
        url: `${this.origins.log}/api/reports?data=${data.join(",")}`,
      });
    }

    public destroy() {
      this.pause();
      for (const i in this) {
        if (this.hasOwnProperty(i)) {
          this[i] = null;
        }
      }
    }
  }
}
