var yyw;
(function (yyw) {
    const QPIC_PREFIX = "https://mmocgame.qpic.cn/wechatgame/";
    const SHARE_OPTIONS = [{
            title: "消消看，猪在天上飞",
            imageUrlId: "CNqqQ532TUO3rY-SJZqsBw",
            imageUrl: `${QPIC_PREFIX}miaTQQZibgu6qTGib8DfpjicnROZ67scQH1v3fVEy1ibpgeW6iapgt5Py34ibPE96ictQm5Y/0`,
        }, {
            title: "快来看看我在玩什么",
            imageUrlId: "6Jokdh4mTK--tWe0zAg5LA",
            imageUrl: `${QPIC_PREFIX}miaTQQZibgu6qEyCFibjRMQ29ibaIRGSKHJMibibA3kuocoM66boU7aFMibF3LTgm6G3a48/0`,
        }];
    let currentIndex = 0;
    function initShare() {
        wx.showShareMenu({
            withShareTicket: true,
        });
        wx.aldOnShareAppMessage(() => SHARE_OPTIONS[currentIndex++ % 2]);
    }
    yyw.initShare = initShare;
    function share(options = {}) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const onShow = () => {
                resolve(Date.now() - start > 3000);
                wx.offShow(onShow);
            };
            wx.onShow(onShow);
            wx.aldShareAppMessage(Object.assign({}, SHARE_OPTIONS[currentIndex++ % 2], options));
        });
    }
    yyw.share = share;
})(yyw || (yyw = {}));
