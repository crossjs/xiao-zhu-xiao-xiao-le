var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var yyw;
(function (yyw) {
    var QPIC_PREFIX = "https://mmocgame.qpic.cn/wechatgame/";
    var SHARE_OPTIONS = [{
            title: "消消看，猪在天上飞",
            imageUrlId: "CNqqQ532TUO3rY-SJZqsBw",
            imageUrl: QPIC_PREFIX + "miaTQQZibgu6qTGib8DfpjicnROZ67scQH1v3fVEy1ibpgeW6iapgt5Py34ibPE96ictQm5Y/0",
        }, {
            title: "快来看看我在玩什么",
            imageUrlId: "6Jokdh4mTK--tWe0zAg5LA",
            imageUrl: QPIC_PREFIX + "miaTQQZibgu6qEyCFibjRMQ29ibaIRGSKHJMibibA3kuocoM66boU7aFMibF3LTgm6G3a48/0",
        }];
    var currentIndex = 0;
    function initShare() {
        wx.showShareMenu({
            withShareTicket: true,
        });
        wx.aldOnShareAppMessage(function () { return SHARE_OPTIONS[currentIndex++ % 2]; });
    }
    yyw.initShare = initShare;
    function share(options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            var start = Date.now();
            var onShow = function () {
                // 3 秒内完成，判定为未完成转发
                resolve(Date.now() - start > 3000);
                wx.offShow(onShow);
            };
            wx.onShow(onShow);
            wx.aldShareAppMessage(__assign({}, SHARE_OPTIONS[currentIndex++ % 2], options));
        });
    }
    yyw.share = share;
})(yyw || (yyw = {}));
