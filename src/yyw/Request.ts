namespace yyw {
  export async function requestWithAuth(options: any): Promise<any> {
    const accessToken = await getAccessToken();
    return request({
      ...options,
      header: {
        // 使用 Bearer Token
        Authorization: `Bearer "${accessToken}"`,
      },
    });
  }

  function isOk(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 400;
  }

  export async function request(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success({ statusCode, data }) {
          if (isOk(statusCode)) {
            resolve(data);
          } else {
            reject(data);
          }
        },
        fail(res) {
          reject(res);
        },
      });
    });
  }
}
