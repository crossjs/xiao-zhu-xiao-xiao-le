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
    try {
      return getInstance().onReady(onRecommenderReady);
    } catch (error) {
      egret.error(error);
    }
  }

  export function onChange(onRecommenderChange: any): any {
    try {
      return getInstance().onChange(onRecommenderChange);
    } catch (error) {
      egret.error(error);
    }
  }
}
