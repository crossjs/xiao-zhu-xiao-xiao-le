namespace yyw {
  const SHARE_OPTIONS = [{
    title: "消消看，猪在天上飞",
    imageUrl: "images/share2.jpg",
    // query: "",
  }, {
    title: "快来看看我在玩什么",
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
