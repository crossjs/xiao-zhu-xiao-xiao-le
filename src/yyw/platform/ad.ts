namespace yyw {
  const BANNER_HEIGHT = 131;

  let bannerAd: wx.BannerAd;

  const onBannerAdResize = ({ width, height }) => {
    // 居中
    bannerAd.style.left = (CONFIG.systemInfo.windowWidth - width) / 2;
    // 贴底
    bannerAd.style.top = CONFIG.systemInfo.windowHeight - height;
  };

  export async function showBannerAd(
    adUnitId: string = CONFIG.bannerAd,
  ): Promise<boolean> {
    if (!adUnitId) {
      return false;
    }

    if (bannerAd) {
      bannerAd.offResize(onBannerAdResize);
      bannerAd.destroy();
    }

    bannerAd = wx.createBannerAd({
      adUnitId,
      style: {
        left: 0,
        top: CONFIG.systemInfo.windowHeight - BANNER_HEIGHT,
        width: CONFIG.systemInfo.windowWidth,
        height: BANNER_HEIGHT,
      },
    });

    bannerAd.onResize(onBannerAdResize);

    // 微信奇怪地返回 Unhandled promise rejection
    // 所以干脆自己封装，统一返回 true/false
    const promised: Promise<boolean> = new Promise((resolve, reject) => {
      bannerAd.onLoad(() => {
        bannerAd.show();
        resolve(true);
      });

      bannerAd.onError(() => {
        resolve(false);
      });
    });

    return promised;
  }

  export async function hideBannerAd(): Promise<any> {
    if (!bannerAd) {
      return;
    }
    return bannerAd.hide();
  }

  let videoAd: wx.RewardedVideoAd;

  /**
   * true: 播放完成
   * false: 用户取消
   * undefined: 调起失败
   */
  export async function showVideoAd(
    adUnitId: string = CONFIG.rewardAd,
  ): Promise<any> {
    if (!adUnitId) {
      return;
    }
    if (!videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId,
      });
      videoAd.onError(({ errMsg }) => {
        // showToast(errMsg);
      });
    }
    try {
      await videoAd.show();
    } catch (error) {
      return;
    }
    return new Promise((resolve, reject) => {
      const callback = ({ isEnded = false }: any = {}) => {
        videoAd.offClose(callback);
        resolve(isEnded);
      };
      videoAd.onClose(callback);
    });
  }
}
