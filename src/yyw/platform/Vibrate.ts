namespace yyw {
  export function vibrateShort() {
    if (CONFIG.vibrationEnabled && wx.vibrateShort) {
      wx.vibrateShort();
    }
  }

  export function vibrateLong() {
    if (CONFIG.vibrationEnabled && wx.vibrateLong) {
      wx.vibrateLong();
    }
  }
}
