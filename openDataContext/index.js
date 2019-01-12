import { Proxy } from "./proxy";

/**
 * 监听来自主域的消息
 */
wx.onMessage(({ command, ...data }) => {
  if (command === "initRanking") {
    Proxy.initRanking(data);
  } else if (command === "openRanking") {
    Proxy.openRanking(data);
  } else if (command === "closeRanking") {
    Proxy.closeRanking(data);
  } else if (command === "saveScore") {
    Proxy.saveScore(data);
  } else if (command === "openClosest") {
    Proxy.openClosest(data);
  } else if (command === "closeClosest") {
    Proxy.closeClosest(data);
  }
});
