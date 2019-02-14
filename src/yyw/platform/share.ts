namespace yyw {
  const QPIC_PREFIX = "https://mmocgame.qpic.cn/wechatgame/";

  const SHARE_OPTIONS = [{
    title: "消消看，猪在天上飞",
    imageUrlId: "CNqqQ532TUO3rY-SJZqsBw",
    imageUrl: `${QPIC_PREFIX}miaTQQZibgu6qTGib8DfpjicnROZ67scQH1v3fVEy1ibpgeW6iapgt5Py34ibPE96ictQm5Y/0`,
  }, {
    title: "快来看看我在玩什么",
    imageUrlId: "6Jokdh4mTK--tWe0zAg5LA",
    imageUrl: `${QPIC_PREFIX}miaTQQZibgu6qEyCFibjRMQ29ibaIRGSKHJMibibA3kuocoM66boU7aFMibF3LTgm6G3a48/0`,
  }];

  let currentIndex = 0;

  export function initShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
    wx.onShareAppMessage(() => SHARE_OPTIONS[currentIndex++ % 2]);
  }

  export function share(options = {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const onShow = () => {
        // 3 秒内完成，判定为未完成转发
        resolve(Date.now() - start > 3000);
        wx.offShow(onShow);
      };
      wx.onShow(onShow);
      wx.shareAppMessage({
        ...SHARE_OPTIONS[currentIndex++ % 2],
        ...options,
      });
    });
  }
}
