class Platform {
  public static async requestWithAuth(options: any): Promise<any> {
    const accessToken = await this.getAccessToken();
    return this.request({
      ...options,
      header: {
        // 使用 Bearer Token
        Authorization: `Bearer "${accessToken}"`,
      },
    });
  }

  public static async request(options: any): Promise<any> {
    const { data }: any = await new Promise((success, fail) => {
      wx.request({
        ...options,
        success,
        fail,
      });
    });
    return data;
  }

  public static initShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  }

  public static share() {
    wx.shareAppMessage({
      // title: ,
      // imageUrl: ,
      // query: ,
    });
  }

  public static async getUserInfo() {
    return { nickName: "username" };
  }

  public static async login(): Promise<any> {
    const { code }: any = await new Promise((success, fail) => {
      wx.login({
        success,
        fail,
      });
    });
    const data = await this.request({
      url: `${yyw.origin}/api/user/login`,
      data: { code },
      method: "POST",
      header: {},
    });
    // 合入到全局
    Object.assign(yyw.user, data);
    return data;
  }

  public static async getAccessToken(): Promise<string> {
    if (yyw.user.accessToken) {
      return yyw.user.accessToken;
    }
    const { accessToken } = await this.login();
    return accessToken;
  }

  public static async endow(data: any): Promise<any> {
    return this.requestWithAuth({
      url: `${yyw.origin}/api/user/endow`,
      data,
      method: "POST",
    });
  }

  public static async score(score: number): Promise<any> {
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
    return this.requestWithAuth({
      url: `${yyw.origin}/api/user/score`,
      data: {
        score,
      },
      method: "POST",
    });
  }
}
