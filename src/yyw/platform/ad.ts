namespace yyw {
  export const BANNER_HEIGHT = 262;

  let bannerAd: wx.BannerAd;

  const onBannerAdResize = ({ width, height }) => {
    // 居中
    bannerAd.style.left = (CONFIG.windowWidth - width) / 2;
    // 贴底
    bannerAd.style.top = CONFIG.windowHeight - height;
  };

  /**
   * 显示底部 Banner 广告
   * @param adUnitId Banner 广告单元 ID
   */
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
        top: CONFIG.windowHeight - BANNER_HEIGHT / 2,
        width: CONFIG.windowWidth,
        height: BANNER_HEIGHT / 2,
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

  /**
   * 隐藏 Banner 广告
   */
  export function hideBannerAd(): void {
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
  /**
   * 调起激励视频广告
   * @param adUnitId 视频广告单元 ID
   * @returns 返回 true 代表播放完成，否则 false 代表用户取消，返回 undefined 代表无可用广告。
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
      const callback = ({ isEnded = false }) => {
        videoAd.offClose(callback);
        resolve(isEnded);
      };
      videoAd.onClose(callback);
    });
  }
}
