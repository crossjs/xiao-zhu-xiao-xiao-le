namespace yyw {
  export function trace() {
    const { channel, weixinadinfo, gdt_vid: traceId } = yyw.CONFIG.launchOptions.query;
    // 以 yyw 或 YYW 为开头
    if (channel && channel.substring(0, 3).toLowerCase() === "yyw") {
      const aId = weixinadinfo ? weixinadinfo.split(".")[0] : 0;
      const send = async () => {
        try {
          await yyw.cloud.call("saveTrace", { channel, aId, traceId });
        } catch (error) {
          // 请求失败，则 10 秒后重试
          egret.error(error);
          setTimeout(send, 10000);
        }
      };
      send();
    }
  }
}
