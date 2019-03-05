// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { Ranking } from "./ranking";
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
          this.cachedRankingData = data.map(({ KVDataList, nickName, nickname, ...rest }) => ({
            ...rest,
            nickName: sliceString(nickName || nickname),
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

function sliceString(value, size = 6, asciiAsHalf = true) {
  if (asciiAsHalf) {
    const chars = [];
    const maxIndex = value.length;
    let n = size * 2;
    let i = 0;
    while (n && i <= maxIndex) {
      const char = value.charAt(i++);
      n--;
      if (char.charCodeAt(0) > 255) {
        n--;
      }
      chars.push(char);
    }
    return chars.join("");
  }
  return value.substring(0, size);
}

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
