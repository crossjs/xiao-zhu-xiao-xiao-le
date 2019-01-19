namespace yyw {
  export function vibrateShort() {
    if (USER_CONFIG.vibrationEnabled) {
      wx.vibrateShort();
    }
  }

  export function vibrateLong() {
    if (USER_CONFIG.vibrationEnabled) {
      wx.vibrateLong();
    }
  }
}
