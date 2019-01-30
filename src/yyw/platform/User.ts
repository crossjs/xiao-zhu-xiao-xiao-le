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

  // 总是能取到 code，不需要用户确认
  function getLoginCode(): Promise<string> {
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

  function getUserInfo(): Promise<object> {
    return new Promise((resolve) => {
      wx.getUserInfo({
        withCredentials: true,
        success({ errMsg, encryptedData, iv, userInfo }: any) {
          if (errMsg === "getUserInfo:ok") {
            // 取到加密过的用户信息，丢到服务端去解密
            resolve({ encryptedData, iv, userInfo });
          } else {
            // 用户拒绝，直接登录
            resolve(null);
          }
        },
        fail() {
          resolve(null);
        },
      });
    });
  }

  function isScopeAuthorized(scope: string = "userInfo"): Promise<any> {
    return new Promise((resolve) => {
      wx.getSetting({
        success(res) {
          resolve(res.authSetting[`scope.${scope}`] === true);
        },
        fail() {
          resolve(false);
        },
      });
    });
  }

  // encryptedData, iv, userInfo
  async function login(payload: any = {}): Promise<any> {
    const isLoggedIn = !!USER.accessToken;

    // 没有 code
    if (!payload.code) {
      // 去微信取
      Object.assign(payload, {
        code: await getLoginCode(),
      });
    }

    // 没有 userInfo
    if (!payload.userInfo) {
      // 去微信取
      Object.assign(payload, await getUserInfo());
    }

    const { expiresIn = 0, ...currentUser } = await request({
      url: `${CONFIG.serverOrigin}/api/user/login`,
      data: payload,
      method: "POST",
    });

    // 合入到全局
    Object.assign(USER, currentUser);
    await setStorage(USER_KEY, USER, expiresIn);

    // 如果之前是未登录状态，则通知登录
    if (!isLoggedIn) {
      yyw.emit("LOGIN");
    }
    return currentUser;
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

  export async function getAccessToken(): Promise<string> {
    if (!USER.accessToken) {
      const cachedUser = await getStorage(USER_KEY);
      if (cachedUser) {
        Object.assign(USER, cachedUser);
      }
    }
    if (!USER.accessToken) {
      await login();
    }
    return USER.accessToken;
  }

  /**
   * 创建一个的获取用户信息的隐形按钮
   */
  export async function createUserInfoButton({
    left, top, width, height, onTap,
  }: any): Promise<wx.UserInfoButton> {
    const authorized: boolean = await isScopeAuthorized("userInfo");
    const isLoggedIn: boolean = !!await getAccessToken();

    if (authorized && isLoggedIn) {
      return;
    }

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
          // 取到加密过的用户信息，丢到服务端去解密
          await login({ encryptedData, iv, userInfo });
        } else {
          if (!isLoggedIn) {
            // 用户拒绝，直接登录
            await login();
          }
        }
      } catch (error) {
        // 几率性地解码失败，再试一次
        await login();
      }
      if (onTap) {
        onTap();
      }
    });

    return button;
  }
}
