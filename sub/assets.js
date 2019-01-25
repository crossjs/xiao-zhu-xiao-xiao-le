// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";

/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过assets.引用名方式进行获取
 */
const assetsUrl = {
  top1: "sub/assets/top1.png",
  top2: "sub/assets/top2.png",
  top3: "sub/assets/top3.png",
};

/**
 * 资源加载组，将所需资源地址以及引用名进行注册
 * 之后可通过 assets.引用名 方式进行获取
 */
const assets = {};

let initialized = false;

export const AssetsManager = {
  init() {
    /**
     * 资源加载
     */
    return new Promise((resolve) => {
      if (initialized) {
        resolve();
        return;
      }
      let sofar = 0;
      let total = 0;
      for (let asset in assetsUrl) {
        total++;
        const img = wx.createImage();
        img.onload = () => {
          sofar++;
          if (sofar === total) {
            initialized = true;
            resolve();
          }
        };
        img.src = assetsUrl[asset];
        assets[asset] = img;
      }
    });
  },

  async getAssets() {
    if (!initialized) {
      await this.init();
    }
    return assets;
  },

  async getImage(name) {
    if (!initialized) {
      await this.init();
    }
    return assets[name];
  },
};
