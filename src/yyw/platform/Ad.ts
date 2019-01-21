namespace yyw {
  export async function showBannerAd(
    adUnitId: string = CONFIG.adUnitId,
    left: number,
    top: number,
    width: number,
    height: number,
  ): Promise<any> {
    if (!adUnitId) {
      return;
    }
    const bannerAd = wx.createBannerAd({
      adUnitId,
      style: {
        left,
        top,
        width,
        height,
      },
    });
    return bannerAd.show();
  }

  let videoAd: wx.RewardedVideoAd;

  export function initVideoAd(
    adUnitId: string = CONFIG.adUnitId,
  ): void {
    if (!adUnitId) {
      return;
    }
    videoAd = wx.createRewardedVideoAd({
      adUnitId,
    });
  }

  /**
   * true: 播放完成
   * false: 用户取消
   * undefined: 调起失败
   */
  export async function showVideoAd(): Promise<any> {
    if (!CONFIG.adUnitId) {
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
