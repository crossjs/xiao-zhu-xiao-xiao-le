namespace yyw {
  export async function requestWithAuth(options: any): Promise<any> {
    const accessToken = await getAccessToken();
    try {
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
        await login(null);
        return requestWithAuth(options);
      }
      throw error;
    }
  }

  function isOk(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 400;
  }

  export async function request(options: any): Promise<any> {
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
          reject(res);
        },
      });
    });
  }
}
