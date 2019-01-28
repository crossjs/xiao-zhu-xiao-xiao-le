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

  const CURRENT_USER_KEY = "YYW_CURRENT_USER";

  export const CURRENT_USER: IUser = {};

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
        userInfo: CURRENT_USER,
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
    if (!CURRENT_USER.accessToken) {
      const cachedUserInfo = await getStorage(CURRENT_USER_KEY);
      if (cachedUserInfo) {
        Object.assign(CURRENT_USER, cachedUserInfo);
      }
    }
    return !!CURRENT_USER.accessToken;
  }

  export async function logout(): Promise<any> {
    for (const key in CURRENT_USER) {
      if (CURRENT_USER.hasOwnProperty(key)) {
        delete CURRENT_USER[key];
      }
    }
    await removeStorage(CURRENT_USER_KEY);
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
    Object.assign(CURRENT_USER, currentUser);
    setStorage(CURRENT_USER_KEY, CURRENT_USER, expiresIn);
    return currentUser;
  }

  export async function getAccessToken(): Promise<string> {
    if (CURRENT_USER.accessToken) {
      return CURRENT_USER.accessToken;
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
