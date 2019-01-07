import * as regeneratorRuntime from './utils/runtime';
import { View } from './view';

export const Proxy = {
  init(data) {
    View.init(data);
  },

  async open(data) {
    wx.getFriendCloudStorage({
      keyList: ['level'],
      success: ({ data: useGameDataList }) => {
        console.log('====1, useGameDataList', useGameDataList);
        const { windowWidth, windowHeight } = wx.getSystemInfoSync();
        View.create({
          ...data,
          windowWidth,
          windowHeight,
          useGameDataList: useGameDataList.map(({ KVDataList, ...rest }, index) => ({
            ...rest,
            score: getScoreFormKVDataList(KVDataList),
          })).sort((a, b) => {
            return a.score > b.score ? -1 : 1;
          }).map((v, index) => Object.assign(v, {
            key: index + 1,
          })),
          // numPerPage: 1,
        });
      },
      fail: (e) => {
        console.log('====0', e);
      },
    });
  },

  close() {
    View.destroy();
  }
}

function getScoreFormKVDataList(KVDataList) {
  const [ KVData ] = KVDataList;
  if (!KVData) {
    return 0;
  }
  try {
    return JSON.parse(KVData.value).wxgame.score;
  } catch (error) {
    console.error(error);
    return 0;
  }
}