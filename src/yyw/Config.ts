namespace yyw {
  const systemInfo: wx.systemInfo = wx.getSystemInfoSync();
  const launchOptions: wx.launchOptions = wx.getLaunchOptionsSync();

  /**
   * 游戏动画速率
   * 数字越大，游戏节奏越慢
   */
  const speedRatio: number = 1.5;

  // 金币奖励获取方式
  let coinReward: number = 0;
  let shopStatus: number = 0;
  let boxEnabled: boolean = true;
  let toolAmount: number = 3;
  // 道具奖励获取方式
  let toolReward: number = 0;
  // 补签方式
  let checkinReward: number = 0;
  // 复活方式
  let reviveReward: number = 0;
  let bannerAd: string = "";
  let rewardAd: string = "";
  let soundEnabled: boolean = true;
  let vibrationEnabled: boolean = true;

  export const CONFIG = {
    get systemInfo(): wx.systemInfo {
      return systemInfo;
    },

    get launchOptions(): wx.launchOptions {
      return launchOptions;
    },

    get speedRatio(): number {
      return speedRatio;
    },

    get coinReward(): number {
      return coinReward;
    },

    set coinReward(value: number) {
      coinReward = value;
    },

    get shopStatus(): number {
      return shopStatus;
    },

    set shopStatus(value: number) {
      shopStatus = value;
    },

    get boxEnabled(): boolean {
      return boxEnabled;
    },

    set boxEnabled(value: boolean) {
      boxEnabled = value;
    },

    get toolAmount(): number {
      return toolAmount;
    },

    set toolAmount(value: number) {
      toolAmount = value;
    },

    get toolReward(): number {
      return toolReward;
    },

    set toolReward(value: number) {
      toolReward = value;
    },

    get checkinReward(): number {
      return checkinReward;
    },

    set checkinReward(value: number) {
      checkinReward = value;
    },

    get reviveReward(): number {
      return reviveReward;
    },

    set reviveReward(value: number) {
      reviveReward = value;
    },

    get bannerAd(): string {
      return bannerAd;
    },

    set bannerAd(value: string) {
      bannerAd = value;
    },

    get rewardAd(): string {
      return rewardAd;
    },

    set rewardAd(value: string) {
      rewardAd = value;
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
    try {
      const {
        coinReward = 0,
        shopStatus = 0,
        toolAmount = 3,
        toolReward = 0,
        checkinReward = 0,
        reviveReward = 0,
        boxEnabled = true,
        bannerAd = "",
        rewardAd = "",
      } = await cloud.call("getConfig");

      Object.assign(CONFIG, {
        coinReward,
        shopStatus,
        toolAmount,
        toolReward,
        checkinReward,
        reviveReward,
        boxEnabled,
        bannerAd,
        rewardAd,
      });
    } catch (error) {
      egret.error(error);
    }
  }
}
