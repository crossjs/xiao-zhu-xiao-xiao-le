// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { Ranking } from "./ranking";
import { Closest } from "./closest";
import { Top3 } from "./top3";

export const Proxy = {
  initRanking(data) {
    Ranking.preload(data);
  },

  async openRanking(data) {
    const rankingData = await Proxy.getRankingData();
    Ranking.create({
      ...data,
      rankingData: rankingData.map((v, index) => Object.assign(v, {
        key: index + 1,
      })),
    });
  },

  closeRanking() {
    Ranking.destroy();
  },

  async saveScore({ score }) {
    await Proxy.getUserData();
    if (score > this.cachedScore) {
      this.cachedScore = score;
      // 保存到微信
      wx.setUserCloudStorage({
        KVDataList: [{
          key: "score",
          value: JSON.stringify({
            wxgame: {
              score,
              update_time: Math.floor(Date.now() / 1000),
            },
          }),
        }],
        // success,
        // fail,
      });
    }
  },

  initClosest(data) {
    Closest.init(data);
  },

  async openClosest({ score, openid, width, height }) {
    const rankingData = await Proxy.getRankingData();
    let closest;
    for (let i = 0; i < rankingData.length; i++) {
      const item = rankingData[i];
      if (item.score > score) {
        // 过滤掉自己
        if (openid !== item.openid) {
          closest = item;
        }
      } else {
        break;
      }
    }
    if (closest) {
      Closest.create({
        ...closest,
        width,
        height,
      });
    } else {
      console.log("你已经是朋友圈兰博旺了");
    }
  },

  closeClosest() {
    Closest.destroy();
  },

  async openTop3(data) {
    const rankingData = await Proxy.getRankingData();
    Top3.create({
      ...data,
      rankingData: rankingData.slice(0, 3).map((v, index) => Object.assign(v, {
        key: index + 1,
      })),
    });
  },

  closeTop3() {
    Top3.destroy();
  },

  async getUserData() {
    if (this.cachedScore) {
      return this.cachedScore;
    }
    return new Promise((resolve, reject) => {
      wx.getUserCloudStorage({
        keyList: ["score"],
        success: ({ KVDataList }) => {
          this.cachedScore = getScoreFormKVDataList(KVDataList);
          resolve(this.cachedScore);
        },
        fail: (e) => {
          reject(e);
        }
      });
    });
  },

  async getRankingData() {
    if (this.cachedRankingData) {
      return this.cachedRankingData;
    }
    return new Promise((resolve, reject) => {
      wx.getFriendCloudStorage({
        keyList: ["score"],
        success: ({ data }) => {
          this.cachedRankingData = data.map(({ KVDataList, ...rest }) => ({
            ...rest,
            score: getScoreFormKVDataList(KVDataList),
          })).sort((a, b) => {
            return a.score > b.score ? -1 : 1;
          });
          resolve(this.cachedRankingData);
        },
        fail: (e) => {
          reject(e);
        }
      });
    });
  }
};

function getScoreFormKVDataList(KVDataList) {
  const [ KVData ] = KVDataList;
  if (!KVData) {
    return 0;
  }
  try {
    return JSON.parse(KVData.value).wxgame.score;
  } catch (error) {
    return 0;
  }
}
