var yyw;
(function (yyw) {
    var Performance = wx.getPerformance();
    var begin = Performance.now();
    yyw.analysis = {
        addEvent: function (event, data) {
            // 添加执行时间统计
            if (!data) {
                var now = Performance.now();
                data = {
                    d: ((now - begin) | 0) + "ms",
                };
                begin = now;
            }
            wx.aldSendEvent(event, data);
        },
        onStart: function () {
            wx.aldStage.onStart({
                stageId: "1",
                stageName: "normal",
                userId: yyw.USER.openid,
            });
        },
        onRunning: function (event, itemName, itemCount, itemMoney) {
            if (itemCount === void 0) { itemCount = 1; }
            if (itemMoney === void 0) { itemMoney = 0; }
            wx.aldStage.onRunning({
                stageId: "1",
                stageName: "normal",
                userId: yyw.USER.openid,
                event: event,
                params: {
                    itemName: itemName,
                    itemCount: itemCount,
                    itemMoney: itemMoney,
                },
            });
        },
        onEnd: function (event) {
            if (event === void 0) { event = "complete"; }
            wx.aldStage.onEnd({
                stageId: "1",
                stageName: "normal",
                userId: yyw.USER.openid,
                event: event,
            });
        },
    };
})(yyw || (yyw = {}));
