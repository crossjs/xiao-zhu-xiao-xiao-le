namespace box {
  let instance: Recommender;

  function getInstance(): Recommender {
    if (!instance) {
      // 初始化交叉营销
      instance = new Recommender({
        appId: "wx2d01e63038198832",
        openId: yyw.CURRENT_USER.openId,
        // origins: {
        //   box: 'http://127.0.0.1:7001',
        //   log: 'http://127.0.0.1:7002',
        // },
      });
    }
    return instance;
  }

  export function onReady(onRecommenderReady: any): any {
    return getInstance().onReady(onRecommenderReady);
  }

  export function onChange(onRecommenderChange: any): any {
    return getInstance().onChange(onRecommenderChange);
  }
}
