namespace yyw {
  const systemInfo: wx.systemInfo = wx.getSystemInfoSync();
  const launchOptions: wx.launchOptions = wx.getLaunchOptionsSync();

  interface Level {
    level: number;
    limit: {
      steps?: number;
      // 固定，只可消除，不可移动
      fixed?: number[];
      // 黑洞，无棋子
      black?: number[];
    };
    goals: {
      score?: number;
      merge?: [number, number];
    };
  }

  interface Config extends wx.systemInfo, wx.launchOptions {
    speedRatio: number;
    coinReward: number;
    shopStatus: number;
    toolAmount: number;
    toolReward: number;
    checkinReward: number;
    reviveReward: number;
    boxEnabled: boolean;
    bannerAd: string;
    rewardAd: string;
    levels: Level[];
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    mode: "score" | "level";
    level: number;
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
    bannerAd: "",
    rewardAd: "",
    soundEnabled: true,
    vibrationEnabled: true,
    mode: "score",
    levels: [],
    level: 0,
  };

  let level = 0;

  Object.defineProperties(CONFIG, {
    level: {
      get(): number {
        return level || (USER && USER.level || 0) || 1;
      },

      set(v: number) {
        level = v;
      },
    },
  });

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
        boxEnabled = true,
        bannerAd = "",
        rewardAd = "",
        levels = [],
      } = await cloud.call("getConfig");

      Object.assign(CONFIG, {
        speedRatio,
        coinReward,
        shopStatus,
        toolAmount,
        toolReward,
        checkinReward,
        reviveReward,
        boxEnabled,
        bannerAd,
        rewardAd,
        levels,
      });
    } catch (error) {
      egret.error(error);
    }
  }
}
