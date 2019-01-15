namespace yyw {
  export const GAME_SERVER_ENABLED: boolean = true;
  export const GAME_SERVER_ORIGIN: string = DEBUG ? "http://127.0.0.1:7014" : "https://g4.minipx.cn";
  export const SYSTEM_INFO: wx.systemInfo = wx.getSystemInfoSync();
}
