namespace yyw {
  export async function requestWithAuth(options: any): Promise<any> {
    const accessToken = await yyw.getAccessToken();
    return yyw.request({
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

  export function initShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  }

  export function share(options = {}) {
    wx.shareAppMessage(options);
  }

  export async function getUserInfo() {
    return { nickName: "username" };
  }

  export async function login(): Promise<any> {
    const { code }: any = await new Promise((success, fail) => {
      wx.login({
        success,
        fail,
      });
    });
    const data = await yyw.request({
      url: `${yyw.origin}/api/user/login`,
      data: { code },
      method: "POST",
      header: {},
    });
    // 合入到全局
    Object.assign(yyw.user, data);
    return data;
  }

  export async function getAccessToken(): Promise<string> {
    if (yyw.user.accessToken) {
      return yyw.user.accessToken;
    }
    const { accessToken } = await yyw.login();
    return accessToken;
  }

  // export async function endow(data: any): Promise<any> {
  //   return this.requestWithAuth({
  //     url: `${yyw.origin}/api/user/endow`,
  //     data,
  //     method: "POST",
  //   });
  // }

  export async function saveScore(score: number): Promise<any> {
    // 保存到微信
    wx.setUserCloudStorage({
      KVDataList: [{
        key: "score",
        value: JSON.stringify({
          wxgame: {
            score,
            update_time: Math.floor(Date.now() / 1000),
          },
        }),
      }],
      // success,
      // fail,
    });
    // 保存到本地
    return yyw.requestWithAuth({
      url: `${yyw.origin}/api/user/score`,
      data: {
        score,
      },
      method: "POST",
    });
  }
}
