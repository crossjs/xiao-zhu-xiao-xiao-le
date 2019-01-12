namespace yyw {
  export function isLoggedIn() {
    return !!CURRENT_USER.nickname;
  }

  export async function login(userInfo: any = {}): Promise<any> {
    const { code }: any = await new Promise((success, fail) => {
      wx.login({
        success,
        fail,
      });
    });
    const data = await request({
      url: `${GAME_SERVER_ORIGIN}/api/user/login`,
      data: { code, ...userInfo },
      method: "POST",
      header: {},
    });
    // 合入到全局
    Object.assign(CURRENT_USER, data);
    return data;
  }

  // export async function endow(data: any): Promise<any> {
  //   return this.requestWithAuth({
  //     url: `${GAME_SERVER_ORIGIN}/api/user/endow`,
  //     data,
  //     method: "POST",
  //   });
  // }

  /**
   * 创建一个的获取用户信息的隐形按钮
   */
  export function createUserInfoButton({
    left, top, width, height, callback,
  }: any) {
    if (!isLoggedIn()) {
      const scale = 750 / SYSTEM_INFO.windowWidth; // 因为是 fixedWidth

      const button = wx.createUserInfoButton({
        type: "text",
        // text: "获取用户信息",
        style: {
          left: left / scale,
          top: top / scale,
          width: width / scale,
          height: height / scale,
          lineHeight: 0,
          backgroundColor: "transparent",
          color: "transparent",
          textAlign: "center",
          fontSize: 0,
          borderRadius: 0,
          borderColor: "transparent",
          borderWidth: 0,
        },
        withCredentials: true,
      });

      button.onTap(async ({ userInfo }) => {
        button.destroy();
        try {
          await login(userInfo);
        } catch (error) {
          egret.error(error);
        }
        if (callback) {
          callback(userInfo);
        }
      });
    }
  }
}
