namespace yyw {
  const Performance: wx.Performance = wx.getPerformance();
  const startTime: number = Performance.now();

  export const analysis = {
    addEvent(event: string, data?: {
      [key: string]: string;
    }) {
      wx.aldSendEvent(event, {
        ...data,
        d: `${(Performance.now() - startTime) | 0}`,
      });
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
