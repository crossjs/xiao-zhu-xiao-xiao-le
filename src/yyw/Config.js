var yyw;
(function (yyw) {
    const serverOrigin = SERVER_ORIGIN;
    const systemInfo = wx.getSystemInfoSync();
    const launchOptions = wx.getLaunchOptionsSync();
    const speedRatio = 1.5;
    let coinReward = 0;
    let shopStatus = 0;
    let boxEnabled = true;
    let toolAmount = 3;
    let toolReward = 0;
    let checkinReward = 0;
    let reviveReward = 0;
    let bannerAd = "";
    let rewardAd = "";
    let soundEnabled = true;
    let vibrationEnabled = true;
    yyw.CONFIG = {
        get systemInfo() {
            return systemInfo;
        },
        get launchOptions() {
            return launchOptions;
        },
        get serverOrigin() {
            return serverOrigin;
        },
        get speedRatio() {
            return speedRatio;
        },
        get coinReward() {
            return coinReward;
        },
        set coinReward(value) {
            coinReward = value;
        },
        get shopStatus() {
            return shopStatus;
        },
        set shopStatus(value) {
            shopStatus = value;
        },
        get boxEnabled() {
            return boxEnabled;
        },
        set boxEnabled(value) {
            boxEnabled = value;
        },
        get toolAmount() {
            return toolAmount;
        },
        set toolAmount(value) {
            toolAmount = value;
        },
        get toolReward() {
            return toolReward;
        },
        set toolReward(value) {
            toolReward = value;
        },
        get checkinReward() {
            return checkinReward;
        },
        set checkinReward(value) {
            checkinReward = value;
        },
        get reviveReward() {
            return reviveReward;
        },
        set reviveReward(value) {
            reviveReward = value;
        },
        get bannerAd() {
            return bannerAd;
        },
        set bannerAd(value) {
            bannerAd = value;
        },
        get rewardAd() {
            return rewardAd;
        },
        set rewardAd(value) {
            rewardAd = value;
        },
        get soundEnabled() {
            return soundEnabled;
        },
        set soundEnabled(value) {
            soundEnabled = value;
        },
        get vibrationEnabled() {
            return vibrationEnabled;
        },
        set vibrationEnabled(value) {
            vibrationEnabled = value;
        },
    };
    async function initConfig() {
        try {
            const { coinReward = 0, shopStatus = 0, toolAmount = 3, toolReward = 0, checkinReward = 0, reviveReward = 0, boxEnabled = true, bannerAd = "", rewardAd = "", } = await yyw.cloud.call("getConfig");
            Object.assign(yyw.CONFIG, {
                coinReward,
                shopStatus,
                toolAmount,
                toolReward,
                checkinReward,
                reviveReward,
                boxEnabled,
                bannerAd,
                rewardAd,
            });
        }
        catch (error) {
            egret.error(error);
        }
    }
    yyw.initConfig = initConfig;
})(yyw || (yyw = {}));
