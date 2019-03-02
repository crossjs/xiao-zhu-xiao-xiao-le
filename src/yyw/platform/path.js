var yyw;
(function (yyw) {
    const WX_ROOT = wx.env.USER_DATA_PATH + "/";
    yyw.path = {
        dirname: (p) => {
            return p.replace(/\/?[^\/]+$/, "");
        },
        normalize: (p) => {
            const matched = p.match(/[^\/]+/g);
            return matched ? matched.join("/") : "";
        },
        getLocalPath: (p) => {
            return p ? yyw.path.normalize(p.replace(/[:#?]/gi, "/")) : "";
        },
        getWxUserPath: (p) => {
            return WX_ROOT + p;
        },
    };
})(yyw || (yyw = {}));
