var yyw;
(function (yyw) {
    function vibrateShort() {
        if (yyw.CONFIG.vibrationEnabled && wx.vibrateShort) {
            wx.vibrateShort();
        }
    }
    yyw.vibrateShort = vibrateShort;
    function vibrateLong() {
        if (yyw.CONFIG.vibrationEnabled && wx.vibrateLong) {
            wx.vibrateLong();
        }
    }
    yyw.vibrateLong = vibrateLong;
})(yyw || (yyw = {}));
