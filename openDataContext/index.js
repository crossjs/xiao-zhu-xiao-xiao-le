import { Proxy } from "./proxy";

/**
 * 监听来自主域的消息
 */
wx.onMessage(({ command, ...data }) => {
  if (command === "open") {
    Proxy.open(data);
  } else if (command === "close") {
    Proxy.close(data);
  } else if (command === "init") {
    Proxy.init(data);
  }
});
