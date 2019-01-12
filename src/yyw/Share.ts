namespace yyw {
  export function initShare() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  }

  export function share(options = {}) {
    wx.shareAppMessage(options);
  }
}
