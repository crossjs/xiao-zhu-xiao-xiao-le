var yyw;
(function (yyw) {
    yyw.reward = {
        can(type, sub) {
            const status = (type ? yyw.CONFIG[`${type}Reward`] : 3) || 0;
            const canVideo = (status & 2) === 2 && !!yyw.CONFIG.rewardAd;
            const canShare = (status & 1) === 1
                && !(yyw.USER.nickName && /^(?:tencent_game_|rdgztest_|minigamecheck)/.test(yyw.USER.nickName));
            if (sub) {
                return sub === "video" ? canVideo : canShare;
            }
            return canVideo || canShare;
        },
        async apply(type, options = {}) {
            const status = (type ? yyw.CONFIG[`${type}Reward`] : 3) || 0;
            if (status === 0) {
                yyw.showToast("当前不可用");
                return;
            }
            const tryVideo = (status & 2) === 2 && !!yyw.CONFIG.rewardAd;
            const tryShare = (status & 1) === 1
                && !(yyw.USER.nickName && /^(?:tencent_game_|rdgztest_|minigamecheck)/.test(yyw.USER.nickName));
            if (tryVideo) {
                const videoPlayed = await yyw.showVideoAd();
                if (videoPlayed) {
                    return "video";
                }
                else {
                    if (videoPlayed === false) {
                        yyw.showToast("看完整个视频才能获得奖励");
                        return false;
                    }
                }
            }
            if (tryShare) {
                if (await yyw.share(Object.assign({ ald_desc: type }, options.share))) {
                    return "share";
                }
                else {
                    yyw.showToast("完成转发才能获得奖励");
                    return false;
                }
            }
        },
    };
})(yyw || (yyw = {}));
