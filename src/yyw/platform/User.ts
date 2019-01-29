namespace yyw {
  interface IUser {
    accessToken?: string;
    avatar?: string;
    avatarUrl?: string;
    coins?: number;
    createdAt?: number;
    enabled?: boolean;
    expiresIn?: number;
    id?: string;
    level?: number;
    nickname?: string;
    openId?: string;
    points?: number;
    provider?: string;
    score?: number;
    unionId?: string;
    updatedAt?: number;
    username?: string;
  }

  const USER_KEY = "YYW_G4_USER";

  export const USER: IUser = {};

  function _getLoginCode(): Promise<string> {
    return new Promise((resolve) => {
      wx.login({
        success({ code }) {
          resolve(code);
        },
        fail() {
          resolve();
        },
      });
    });
  }

  async function _isScopeAuthorized(scope: string = "userInfo"): Promise<any> {
    return new Promise((resolve) => {
      wx.getSetting({
        success(res) {
          resolve(res.authSetting[`scope.${scope}`]);
        },
        fail() {
          resolve(false);
        },
      });
    });
  }

  async function _getUserInfo(): Promise<object> {
    if (await _isLoggedIn()) {
      return {
        userInfo: USER,
      };
    }

    return new Promise((resolve) => {
      wx.getUserInfo({
        withCredentials: true,
        success(res) {
          resolve(res);
        },
        fail() {
          resolve(null);
        },
      });
    });
  }

  async function _isLoggedIn() {
    if (!USER.accessToken) {
      const cachedUser = await getStorage(USER_KEY);
      if (cachedUser) {
        Object.assign(USER, cachedUser);
      }
    }
    return !!USER.accessToken;
  }

  export async function logout(): Promise<any> {
    for (const key in USER) {
      if (USER.hasOwnProperty(key)) {
        delete USER[key];
      }
    }
    await removeStorage(USER_KEY);
    yyw.emit("LOGOUT");
  }

  export async function login(payload: any = {}): Promise<any> {
    const loggedIn = await _isLoggedIn();
    if (!loggedIn) {
      // 未登录，需要取 code
      Object.assign(payload, {
        code: await _getLoginCode(),
      });
    }
    if (!payload.nickName) {
      // 没有基础信息，去微信取一个
      Object.assign(payload, await _getUserInfo());
    }
    const { expiresIn = 0, ...currentUser } = await request({
      url: `${CONFIG.serverOrigin}/api/user/login`,
      data: payload,
      method: "POST",
    });
    // 合入到全局
    Object.assign(USER, currentUser);
    setStorage(USER_KEY, USER, expiresIn);
    // 如果之前是未登录状态，则通知登录
    if (!loggedIn) {
      yyw.emit("LOGIN");
    }
    return currentUser;
  }

  export async function getAccessToken(): Promise<string> {
    if (USER.accessToken) {
      return USER.accessToken;
    }
    const { accessToken } = await login();
    return accessToken;
  }

  /**
   * 创建一个的获取用户信息的隐形按钮
   */
  export async function createUserInfoButton({
    left, top, width, height, onTap,
  }: any): Promise<wx.UserInfoButton> {
    if (!await _isScopeAuthorized("userInfo") || !await _isLoggedIn()) {
      const scale = 750 / CONFIG.systemInfo.windowWidth; // 因为是 fixedWidth

      const button = wx.createUserInfoButton({
        type: "text",
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

      button.onTap(async ({ errMsg, encryptedData, iv, userInfo }: any) => {
        button.destroy();
        try {
          if (errMsg === "getUserInfo:ok") {
            // 几率性地解码失败
            await login({ encryptedData, iv, userInfo });
          } else {
            egret.warn("createUserInfoButton", errMsg);
          }
        } catch (error) {
          egret.error("createUserInfoButton", error);
          // 再试一次
          await login();
        }
        if (onTap) {
          onTap();
        }
      });

      return button;
    }
  }
}
