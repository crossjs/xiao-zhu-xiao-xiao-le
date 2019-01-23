namespace box {
  let instance: Recommender;

  function getInstance(): Recommender {
    if (!instance) {
      const { openId } = yyw.CURRENT_USER;
      if (openId) {
        // 初始化交叉营销
        instance = new Recommender({
          appId: APP_ID,
          openId,
          // origins: {
          //   box: "http://127.0.0.1:7001",
          //   log: "http://127.0.0.1:7002",
          // },
        });
      } else {
        egret.warn("Recommender 初始化失败，当前用户未登录");
      }
    }
    return instance;
  }

  export function onReady(onRecommenderReady: any): any {
    const i = getInstance();
    if (i) {
      i.onReady(onRecommenderReady);
    }
  }

  export function onChange(onRecommenderChange: any): any {
    const i = getInstance();
    if (i) {
      i.onChange(onRecommenderChange);
    }
  }
}
