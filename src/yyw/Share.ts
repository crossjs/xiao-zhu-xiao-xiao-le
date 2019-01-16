namespace yyw {
  export function initShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  }

  export function share(options = {}) {
    wx.shareAppMessage({
      ...options,
      cancel() {
        wx.showToast({
          title: "你取消了分享",
          icon: "none",
        });
      },
    });
  }
}
