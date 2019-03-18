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
  case "openNeighbor":
    return Proxy.openNeighbor(data);
  case "closeNeighbor":
    return Proxy.closeNeighbor(data);
  default:
    break;
  }
});
