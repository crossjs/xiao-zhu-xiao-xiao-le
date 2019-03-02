var yyw;
(function (yyw) {
    const Performance = wx.getPerformance();
    let begin = Performance.now();
    yyw.analysis = {
        addEvent(event, data) {
            if (!data) {
                const now = Performance.now();
                data = {
                    d: `${(now - begin) | 0}ms`,
                };
                begin = now;
            }
            wx.aldSendEvent(event, data);
        },
        onStart() {
            wx.aldStage.onStart({
                stageId: "1",
                stageName: "normal",
                userId: yyw.USER.openid,
            });
        },
        onRunning(event, itemName, itemCount = 1, itemMoney = 0) {
            wx.aldStage.onRunning({
                stageId: "1",
                stageName: "normal",
                userId: yyw.USER.openid,
                event,
                params: {
                    itemName,
                    itemCount,
                    itemMoney,
                },
            });
        },
        onEnd(event = "complete") {
            wx.aldStage.onEnd({
                stageId: "1",
                stageName: "normal",
                userId: yyw.USER.openid,
                event,
            });
        },
    };
})(yyw || (yyw = {}));
