namespace yyw {
  interface IUser {
    openid?: string;
    unionid?: string;
    nickName?: string;
    avatarUrl?: string;
    gender?: number;
    province?: string;
    city?: string;
    country?: string;
    coins?: number;
    level?: number;
    points?: number;
    score?: number;
    /**
     * 是否已完成“新手引导”
     */
    guided?: boolean;
    /**
     * 是否已添加到“我的小程序”
     */
    sticked?: boolean;
    arena?: {
      breaker?: number;
      cols?: number;
      combo?: number;
      level?: number;
      lives?: number;
      livesUp?: number;
      matrix?: number[][];
      maxCombo?: number;
      maxNumber?: number;
      numbers?: number[];
      rows?: number;
      score?: number;
      shuffle?: number;
      valueUp?: number;
    };
  }

  const USER_KEY = "USER";

  export const USER: IUser = {};

  function getUserInfo(): Promise<object> {
    return new Promise((resolve) => {
      wx.getUserInfo({
        withCredentials: false,
        success({ errMsg, userInfo }: any) {
          if (errMsg === "getUserInfo:ok") {
            resolve(userInfo);
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

  async function login(fullUserInfo?: any): Promise<any> {
    const isLoggedIn = !!USER.openid;

    // 没有 fullUserInfo
    if (!fullUserInfo) {
      // 去微信取
      fullUserInfo = await getUserInfo();
    }

    const currentUser = await cloud.call("login", { fullUserInfo });

    // 合入到全局
    Object.assign(USER, currentUser);
    await storage.set(USER_KEY, USER);

    // 如果之前是未登录状态，则通知登录
    if (!isLoggedIn) {
      yyw.emit("LOGIN");
    }
    return USER;
  }

  export async function update(state: { [key: string]: any }): Promise<any> {
    // 合入到全局
    Object.assign(USER, state);
    await storage.set(USER_KEY, USER);
    return cloud.call("saveMyState", {
      state,
    });
  }

  export async function logout(): Promise<any> {
    for (const key in USER) {
      if (USER.hasOwnProperty(key)) {
        delete USER[key];
      }
    }
    await storage.remove(USER_KEY);
    yyw.emit("LOGOUT");
  }

  export async function getLogin(): Promise<boolean> {
    if (!USER.openid) {
      const cachedUser = await storage.get(USER_KEY);
      if (cachedUser) {
        Object.assign(USER, cachedUser);
      }
    }
    if (!USER.openid) {
      await login();
    }
    return !!USER.openid;
  }

  /**
   * 创建一个的获取用户信息的隐形按钮
   */
  export async function createUserInfoButton({
    left,
    top,
    width,
    height,
    onTap,
  }: any): Promise<wx.UserInfoButton> {
    const authorized: boolean = await isScopeAuthorized("userInfo");

    if (authorized) {
      return;
    }

    const scale = 750 / CONFIG.windowWidth; // 因为是 fixedWidth
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
      withCredentials: false,
    });

    button.onTap(async ({ errMsg, userInfo }: any) => {
      button.destroy();
      let authorized = true;
      try {
        if (errMsg === "getUserInfo:ok") {
          // 取到加密过的用户信息，丢到服务端去解密
          await login(userInfo);
        } else {
          authorized = false;
          const isLoggedIn: boolean = await getLogin();
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
        onTap(authorized);
      }
    });

    return button;
  }
}
