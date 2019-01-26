namespace yyw {
  const serverEnabled: boolean = true;
  const serverOrigin: string = DEBUG ? "http://127.0.0.1:7014" : "https://g4.minipx.cn";

  const systemInfo: wx.systemInfo = wx.getSystemInfoSync();
  const speedRatio: number = 1.5;
  const stageWidth: number = 750;
  const stageHeight: number = Math.floor(750 / systemInfo.windowWidth * systemInfo.windowHeight);

  let adEnabled: boolean = true;
  let adUnitId: string = "";
  let soundEnabled: boolean = true;
  let vibrationEnabled: boolean = true;

  export const CONFIG = {
    get systemInfo(): wx.systemInfo {
      return systemInfo;
    },

    get stageWidth(): number {
      return stageWidth;
    },

    get stageHeight(): number {
      return stageHeight;
    },

    get serverEnabled(): boolean {
      return serverEnabled;
    },

    get serverOrigin(): string {
      return serverOrigin;
    },

    /**
     * 游戏动画速率
     */
    get speedRatio(): number {
      return speedRatio;
    },

    get adEnabled(): boolean {
      return adEnabled;
    },

    set adEnabled(value: boolean) {
      adEnabled = value;
    },

    get adUnitId(): string {
      return adUnitId;
    },

    set adUnitId(value: string) {
      adUnitId = value;
    },

    get soundEnabled(): boolean {
      return soundEnabled;
    },

    set soundEnabled(value: boolean) {
      soundEnabled = value;
    },

    get vibrationEnabled(): boolean {
      return vibrationEnabled;
    },

    set vibrationEnabled(value: boolean) {
      vibrationEnabled = value;
    },
  };

  export async function initConfig() {
    const { ad = false, adUnitId = "" } = await request({
      url: `${CONFIG.serverOrigin}/api/config`,
    });
    CONFIG.adEnabled = ad;
    CONFIG.adUnitId = adUnitId;
  }
}
