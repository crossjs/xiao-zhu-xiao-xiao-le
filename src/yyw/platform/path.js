var yyw;
(function (yyw) {
    /**
     * 封装微信小游戏的文件系统
     */
    var WX_ROOT = wx.env.USER_DATA_PATH + "/";
    yyw.path = {
        dirname: function (p) {
            return p.replace(/\/?[^\/]+$/, "");
        },
        // isRemotePath: (p: string): boolean => {
        //   return /^https?:\/\//.test(p);
        // },
        normalize: function (p) {
            var matched = p.match(/[^\/]+/g);
            return matched ? matched.join("/") : "";
        },
        // 获取微信的用户缓存地址
        getLocalPath: function (p) {
            return p ? yyw.path.normalize(p.replace(/[:#?]/gi, "/")) : "";
        },
        // 获取微信的用户缓存地址
        getWxUserPath: function (p) {
            return WX_ROOT + p;
        },
    };
})(yyw || (yyw = {}));
