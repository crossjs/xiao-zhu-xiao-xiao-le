namespace yyw {
  const systemInfo: wx.systemInfo = wx.getSystemInfoSync();
  const launchOptions: wx.launchOptions = wx.getLaunchOptionsSync();

  interface Config extends wx.systemInfo, wx.launchOptions {
    speedRatio: number;
    coinReward: number;
    shopStatus: number;
    toolAmount: number;
    toolReward: number;
    checkinReward: number;
    reviveReward: number;
    energyAmount: number;
    renewInterval: number;
    levelScore: number;
    boxEnabled: boolean;
    bannerAd: string;
    rewardAd: string;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  }

  export const CONFIG: Config = {
    ...systemInfo,
    ...launchOptions,

    /**
     * 游戏动画速率
     * 数字越大，游戏节奏越慢
     */
    speedRatio: 1.5,
    // 金币奖励获取方式
    coinReward: 0,
    shopStatus: 0,
    boxEnabled: true,
    toolAmount: 3,
    // 道具奖励获取方式
    toolReward: 0,
    // 补签方式
    checkinReward: 0,
    // 复活方式
    reviveReward: 0,
    // 体力最大值
    energyAmount: 5,
    // 恢复 1 点体力需要的分钟数
    renewInterval: 5,
    // 进入关卡模式要求的最低得分
    levelScore: 10000,
    bannerAd: "",
    rewardAd: "",
    soundEnabled: true,
    vibrationEnabled: true,
  };

  export async function initConfig() {
    try {
      const {
        speedRatio = 1.5,
        coinReward = 0,
        shopStatus = 0,
        toolAmount = 3,
        toolReward = 0,
        checkinReward = 0,
        reviveReward = 0,
        energyAmount = 5,
        renewInterval = 5,
        levelScore = 10000,
        boxEnabled = true,
        bannerAd = "",
        rewardAd = "",
      } = await cloud.call("getConfig");

      Object.assign(CONFIG, {
        speedRatio,
        coinReward,
        shopStatus,
        toolAmount,
        toolReward,
        checkinReward,
        reviveReward,
        energyAmount,
        renewInterval,
        levelScore,
        boxEnabled,
        bannerAd,
        rewardAd,
      });
    } catch (error) {
      egret.error(error);
    }
  }
}
