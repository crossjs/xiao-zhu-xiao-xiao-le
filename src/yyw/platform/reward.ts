namespace yyw {
  export const reward = {
    /**
     * 是否可用
     * @param type string
     */
    can(type?: string, sub?: string): boolean {
      const status = (type ? CONFIG[`${type}Reward`] : 3) || 0;

      const canVideo = (status & 2) === 2 && !!CONFIG.rewardAd;
      const canShare = (status & 1) === 1
        && !(USER.nickName && /^(?:tencent_game_|rdgztest_|minigamecheck)/.test(USER.nickName));

      if (sub) {
        return sub === "video" ? canVideo : canShare;
      }

      return canVideo || canShare;
    },

    /**
     * 请求奖励
     * @param type string
     * @param options any
     */
    async apply(type?: string, options: any = {}): Promise<false | string | undefined> {
      // 0 关闭
      // 1 分享
      // 2 视频
      // 3 智能
      const status = (type ? CONFIG[`${type}Reward`] : 3) || 0;

      // 功能关闭
      if (status === 0) {
        showToast("暂不可用");
        return;
      }

      const tryVideo = (status & 2) === 2 && !!CONFIG.rewardAd;
      const tryShare = (status & 1) === 1
        && !(USER.nickName && /^(?:tencent_game_|rdgztest_|minigamecheck)/.test(USER.nickName));

      // 启用了视频激励，且有 adUnitId
      if (tryVideo) {
        // 看完视频广告
        const videoPlayed = await showVideoAd();
        if (videoPlayed) {
          return "video";
        } else {
          if (videoPlayed === false) {
            showToast("看完整个视频才能获得奖励");
            return false;
          }
        }
      }

      // 启用了分享激励
      if (tryShare) {
        // 完成转发
        if (await share({
          ald_desc: type,
          ...options.share,
        })) {
          return "share";
        } else {
          showToast("完成转发才能获得奖励，试试转发到其他群");
          return false;
        }
      }
    },
  };
}
