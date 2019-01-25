import { Proxy } from "./proxy";

/**
 * 监听来自主域的消息
 */
wx.onMessage(({ command, ...data }) => {
  switch (command) {
  case "initRanking":
    return Proxy.initRanking(data);
  case "openRanking":
    return Proxy.openRanking(data);
  case "closeRanking":
    return Proxy.closeRanking(data);
  case "saveScore":
    return Proxy.saveScore(data);
  case "openClosest":
    return Proxy.openClosest(data);
  case "closeClosest":
    return Proxy.closeClosest(data);
  case "openTop3":
    return Proxy.openTop3(data);
  case "closeTop3":
    return Proxy.closeTop3(data);
  default:
    break;
  }
});
