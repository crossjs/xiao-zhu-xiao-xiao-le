namespace yyw {
  wx.cloud.init({
    env: CLOUD_ENV,
    traceUser: true,
  });

  export const cloud = {
    async call(name: string, data?: any): Promise<any> {
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name,
          // 传递给云函数的参数
          data,
          success: ({ result }) => {
            resolve(result);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
  };
}
