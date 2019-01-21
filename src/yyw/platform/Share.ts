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
        let cancelled: boolean = false;
        const onShow = () => {
          resolve(!cancelled);
          wx.offShow(onShow);
        };
        wx.shareAppMessage({
          ...SHARE_OPTIONS[currentIndex++ % 2],
          ...options,
          cancel() {
            wx.showToast({
              title: "你取消了分享",
              icon: "none",
            });
            cancelled = true;
          },
        });
        wx.onShow(onShow);
      }
    });
  }
}
