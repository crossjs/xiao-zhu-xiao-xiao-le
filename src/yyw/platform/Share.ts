namespace yyw {
  export function initShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  }

  export function share(options = {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (WX_SYSTEM_INFO.platform === "devtools") {
        resolve(true);
      } else {
        let cancelled: boolean = false;
        const onShow = () => {
          resolve(!cancelled);
          wx.offShow(onShow);
        };
        wx.shareAppMessage({
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
