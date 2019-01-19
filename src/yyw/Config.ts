namespace yyw {
  export const GAME_SERVER_ENABLED: boolean = true;
  export const GAME_SERVER_ORIGIN: string = DEBUG ? "http://127.0.0.1:7014" : "https://g4.minipx.cn";
  export const WX_SYSTEM_INFO: wx.systemInfo = wx.getSystemInfoSync();

  /**
   * 游戏动画速率
   */
  export const SPEED_RATIO = 1.5;

  let soundEnabled: boolean = false;
  let vibrationEnabled: boolean = true;

  export const USER_CONFIG = {
    get soundEnabled(): boolean {
      return soundEnabled;
    },

    set soundEnabled(value) {
      soundEnabled = value;
    },

    get vibrationEnabled(): boolean {
      return vibrationEnabled;
    },

    set vibrationEnabled(value) {
      vibrationEnabled = value;
    },
  };
}
