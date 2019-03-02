var yyw;
(function (yyw) {
    yyw.BANNER_HEIGHT = 262;
    let bannerAd;
    const onBannerAdResize = ({ width, height }) => {
        bannerAd.style.left = (yyw.CONFIG.systemInfo.windowWidth - width) / 2;
        bannerAd.style.top = yyw.CONFIG.systemInfo.windowHeight - height;
    };
    async function showBannerAd(adUnitId = yyw.CONFIG.bannerAd) {
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
                top: yyw.CONFIG.systemInfo.windowHeight - yyw.BANNER_HEIGHT / 2,
                width: yyw.CONFIG.systemInfo.windowWidth,
                height: yyw.BANNER_HEIGHT / 2,
            },
        });
        bannerAd.onResize(onBannerAdResize);
        const promised = new Promise((resolve, reject) => {
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
    yyw.showBannerAd = showBannerAd;
    async function hideBannerAd() {
        if (!bannerAd) {
            return;
        }
        return bannerAd.hide();
    }
    yyw.hideBannerAd = hideBannerAd;
    let videoAd;
    async function showVideoAd(adUnitId = yyw.CONFIG.rewardAd) {
        if (!adUnitId) {
            return;
        }
        if (!videoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId,
            });
            videoAd.onError(({ errMsg }) => {
            });
        }
        try {
            await videoAd.show();
        }
        catch (error) {
            return;
        }
        return new Promise((resolve, reject) => {
            const callback = ({ isEnded = false } = {}) => {
                videoAd.offClose(callback);
                resolve(isEnded);
            };
            videoAd.onClose(callback);
        });
    }
    yyw.showVideoAd = showVideoAd;
})(yyw || (yyw = {}));
