namespace yyw {
  const SHARE_OPTIONS = [{
    title: "小学二年级的试卷，都答对了简直神童！",
    imageUrl: "images/share2.jpg",
    // query: "",
  }, {
    title: "父母如何发现孩子的数学天赋",
    imageUrl: "images/share.jpg",
    // query: "",
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
      // 开发者工具没有分享
      if (CONFIG.systemInfo.platform === "devtools") {
        resolve(true);
      } else {
        const start = Date.now();
        const onShow = () => {
          // 3 秒内完成，判定为未完成转发·
          resolve(Date.now() - start > 3000);
          wx.offShow(onShow);
        };
        wx.onShow(onShow);
        wx.shareAppMessage({
          ...SHARE_OPTIONS[currentIndex++ % 2],
          ...options,
        });
      }
    });
  }
}
