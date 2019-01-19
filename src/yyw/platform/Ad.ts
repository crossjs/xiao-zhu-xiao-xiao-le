namespace yyw {
  export function createBannerAd(
    adUnitId: string = "xxxx",
    left: number,
    top: number,
    width: number,
    height: number,
  ): wx.BannerAd {
    return wx.createBannerAd({
      adUnitId,
      style: {
        left,
        top,
        width,
        height,
      },
    });
  }

  export function createRewardedVideoAd(
    adUnitId: string = "xxxx",
  ): wx.RewardedVideoAd {
    return wx.createRewardedVideoAd({
      adUnitId,
    });
  }
}
