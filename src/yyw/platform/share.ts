namespace yyw {
  const QPIC_PREFIX = "https://mmocgame.qpic.cn/wechatgame/";

  const SHARE_OPTIONS = [{
    title: "消消看，猪在天上飞",
    imageUrlId: "CNqqQ532TUO3rY-SJZqsBw",
    imageUrl: `${QPIC_PREFIX}miaTQQZibgu6qTGib8DfpjicnROZ67scQH1v3fVEy1ibpgeW6iapgt5Py34ibPE96ictQm5Y/0`,
  }, {
    title: "快来看看我在玩什么",
    imageUrlId: "OxWlpD4gSwyKeMT3a9N9ow",
    imageUrl: `${QPIC_PREFIX}miaTQQZibgu6qodHOEEXfVGDpib1yrDVSxp7TtDAuLicUPMUDhyPQiapzGf2jtPYbLUV9/0`,
  }, {
    title: "喜从天降，挖到金矿",
    imageUrlId: "F1j1PEDMTTqhSU2SIbTjJQ",
    imageUrl: `${QPIC_PREFIX}miaTQQZibgu6ozyib8pQtXbRnTTNCwB6F2VGPcMoP5HPqSQPicCzfN0WPQe3GSvsSRyia/0`,
  }];

  let currentIndex = 0;

  export function initShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
    wx.aldOnShareAppMessage(() => SHARE_OPTIONS[currentIndex++ % SHARE_OPTIONS.length]);
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
      wx.aldShareAppMessage({
        ...SHARE_OPTIONS[currentIndex++ % SHARE_OPTIONS.length],
        ...options,
      });
    });
  }
}
