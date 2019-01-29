namespace yyw {
  /**
   * 封装微信小游戏的文件系统
   */
  const WX_ROOT = wx.env.USER_DATA_PATH + "/";

  export const path = {
    dirname: (p: string): string => {
      return p.replace(/\/?[^\/]+$/, "");
    },

    // isRemotePath: (p: string): boolean => {
    //   return /^https?:\/\//.test(p);
    // },

    normalize: (p: string): string => {
      const matched = p.match(/[^\/]+/g);
      return matched ? matched.join("/") : "";
    },

    // 获取微信的用户缓存地址
    getLocalPath: (p: string): string => {
      return p ? path.normalize(p.replace(/[:#?]/gi, "/")) : "";
    },

    // 获取微信的用户缓存地址
    getWxUserPath: (p: string): string => {
      return WX_ROOT + p;
    },
  };
}
