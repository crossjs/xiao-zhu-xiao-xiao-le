// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { Ranking } from "./ranking";
import { Neighbor } from "./neighbor";

export const Proxy = {
  initRanking(data) {
    Ranking.preload(data);
  },

  async openRanking(data) {
    const rankingData = await Proxy.getRankingData("score");
    Ranking.create({
      ...data,
      rankingData,
    });
  },

  closeRanking() {
    Ranking.destroy();
  },

  async saveScore({ score = 0, level = 0, duration = 0 }) {
    await Proxy.getUserData();
    const KVDataList = [];
    const now = Math.floor(Date.now() / 1000);
    if (score > this.cachedScore) {
      this.cachedScore = score;
      KVDataList.push({
        key: "score",
        value: JSON.stringify({
          wxgame: {
            score,
            update_time: now,
          },
        }),
      });
    }
    if (level > this.cachedLevel) {
      this.cachedLevel = level;
      KVDataList.push({
        key: "level",
        value: JSON.stringify({
          wxgame: {
            score: level,
            update_time: now,
          },
        }),
      });
      if (duration) {
        KVDataList.push({
          key: `level${level}`,
          value: JSON.stringify({
            wxgame: {
              score: duration,
              update_time: now,
            },
          }),
        });
      }
    }
    if (KVDataList.length) {
      // 保存到微信
      wx.setUserCloudStorage({
        KVDataList,
      });
    }
  },

  async openNeighbor(data) {
    const { level = 0 } = data;
    const key = `level${level}`;
    const rankingData = await Proxy.getRankingData(key);
    Neighbor.create({
      ...data,
      rankingData,
    });
  },

  closeNeighbor() {
    Neighbor.destroy();
  },

  cachedScore: 0,
  cachedLevel: 0,

  async getUserData() {
    if (this.cachedScore && this.cachedLevel) {
      return;
    }
    return new Promise((resolve, reject) => {
      wx.getUserCloudStorage({
        keyList: ["score", "level"],
        success: ({ KVDataList }) => {
          const { score = 0, level = 0 } = getValueFormKVDataList(KVDataList);
          this.cachedScore = score;
          this.cachedLevel = level;
          resolve();
        },
        fail: (e) => {
          reject(e);
        }
      });
    });
  },

  cachedRankingData: {},

  async getRankingData(key) {
    if (this.cachedRankingData[key]) {
      return this.cachedRankingData[key];
    }
    return new Promise((resolve, reject) => {
      wx.getFriendCloudStorage({
        keyList: [key],
        success: ({ data }) => {
          this.cachedRankingData[key] = data
            // 过滤掉空数据
            .filter(({ KVDataList }) => KVDataList.length !== 0)
            .map(({ KVDataList, nickName, nickname, ...rest }) => ({
              ...rest,
              nickName: sliceString(nickName || nickname),
              ...getValueFormKVDataList(KVDataList),
            }));
          resolve(this.cachedRankingData[key]);
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

function getValueFormKVDataList(KVDataList) {
  return KVDataList.reduce((obj, { key, value }) => {
    const { score } = JSON.parse(value).wxgame;
    return score ? Object.assign(obj, {
      [key]: score,
    }) : obj;
  }, {});
}
