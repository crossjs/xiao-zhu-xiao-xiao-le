// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { Ranking } from "./ranking";
import { Neighbor } from "./neighbor";

export const Proxy = {
  initRanking(data) {
    Ranking.preload(data);
  },

  async openRanking(data) {
    const rankingData = await Proxy.getRankingData();
    Ranking.create({
      ...data,
      rankingData,
    });
  },

  closeRanking() {
    Ranking.destroy();
  },

  async saveScore({ score = 0, level = 0, duration }) {
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
    const rankingData = await Proxy.getRankingData();
    const { mode = "score", level = "" } = data;
    const key = `${mode}${level}`;
    Neighbor.create({
      ...data,
      rankingData: rankingData.filter((item) => item.hasOwnProperty(key)),
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
          const { score, level } = getValueFormKVDataList(KVDataList);
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
            ...getValueFormKVDataList(KVDataList),
          }));
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

const fallback = { score: 0, level: 0 };

function getValueFormKVDataList(KVDataList) {
  const [ KVData ] = KVDataList;
  if (!KVData) {
    return fallback;
  }
  try {
    const { score = 0, level = 0 } = JSON.parse(KVData.value).wxgame;
    return { score, level };
  } catch (error) {
    return fallback;
  }
}
