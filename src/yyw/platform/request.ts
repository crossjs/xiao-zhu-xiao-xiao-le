namespace yyw {
  export async function requestWithAuth(options: any): Promise<any> {
    if (typeof options === "string") {
      options = { url: options };
    }
    try {
      const accessToken = await getAccessToken();
      return await request({
        ...options,
        header: {
          // 使用 Bearer Token
          Authorization: `Bearer "${accessToken}"`,
        },
      });
    } catch (error) {
      // 如果登录失效，则尝试重新登录
      if (error && error.status && error.status === 401) {
        await logout();
        return requestWithAuth(options);
      }
      throw error;
    }
  }

  function isOk(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 400;
  }

  export async function request(options: any): Promise<any> {
    if (typeof options === "string") {
      options = { url: options };
    }
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success({ statusCode, data }: any) {
          if (isOk(statusCode)) {
            resolve(data);
          } else {
            reject({
              message: data.message,
              status: statusCode,
            });
          }
        },
        fail(res) {
          egret.error("request", options, res);
          reject(res);
        },
      });
    });
  }
}
