namespace yyw {
  const Performance: wx.Performance = wx.getPerformance();
  let begin: number = Performance.now();

  export const analysis = {
    addEvent(event: string, data?: {
      [key: string]: string;
    }) {
      // 添加执行时间统计
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
        userId: USER.openId,
      });
    },

    onRunning(
      event: wx.aldRunningEvent,
      itemName: string,
      itemCount: number = 1,
      itemMoney: number = 0,
    ) {
      wx.aldStage.onRunning({
        stageId: "1",
        stageName: "normal",
        userId: USER.openId,
        event,
        params: {
          itemName,
          itemCount,
          itemMoney,
        },
      });
    },

    onEnd(event: wx.aldEndEvent = "complete") {
      wx.aldStage.onEnd({
        stageId: "1",
        stageName: "normal",
        userId: USER.openId,
        event,
      });
    },
  };
}
