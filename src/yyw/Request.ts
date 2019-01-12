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

  export async function request(options: any): Promise<any> {
    const { data }: any = await new Promise((success, fail) => {
      wx.request({
        ...options,
        success,
        fail,
      });
    });
    return data;
  }

  export async function getAccessToken(): Promise<string> {
    if (CURRENT_USER.accessToken) {
      return CURRENT_USER.accessToken;
    }
    const { accessToken } = await login();
    return accessToken;
  }
}
