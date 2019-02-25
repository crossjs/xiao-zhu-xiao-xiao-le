namespace yyw {
  export const analysis = {
    addEvent(event: string, data?: {
      [key: string]: string;
    }) {
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
