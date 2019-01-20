namespace yyw {
  export function vibrateShort() {
    if (USER_CONFIG.vibrationEnabled && wx.vibrateShort) {
      wx.vibrateShort();
    }
  }

  export function vibrateLong() {
    if (USER_CONFIG.vibrationEnabled && wx.vibrateLong) {
      wx.vibrateLong();
    }
  }
}
