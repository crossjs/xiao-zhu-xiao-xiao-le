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
  ): Promise<any> {
    if (!adUnitId) {
      return;
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
    bannerAd.onError(({ errMsg }) => {
      showToast(errMsg);
    });
    bannerAd.onResize(onBannerAdResize);

    return bannerAd.show();
  }

  export async function hideBannerAd(): Promise<any> {
    if (!bannerAd) {
      return;
    }
    return bannerAd.hide();
  }

  let videoAd: wx.RewardedVideoAd;

  export function initVideoAd(
    adUnitId: string = CONFIG.rewardAd,
  ): void {
    if (!adUnitId) {
      return;
    }
    videoAd = wx.createRewardedVideoAd({
      adUnitId,
    });
    videoAd.onError(({ errMsg }) => {
      showToast(errMsg);
    });
  }

  /**
   * true: 播放完成
   * false: 用户取消
   * undefined: 调起失败
   */
  export async function showVideoAd(): Promise<any> {
    if (!videoAd) {
      return;
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
