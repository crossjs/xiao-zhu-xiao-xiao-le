namespace yyw {
  export const reward: any = {
    /**
     * 是否可用
     * @param type string
     */
    can(type?: string, sub?: string): boolean {
      const status = (type ? CONFIG[`${type}Reward`] : 3) || 0;

      const canVideo = (status & 2) === 2 && !!CONFIG.adUnitId;
      // 跳过审核人员
      const canShare = (status & 1) === 1 && !(USER.nickname && /^(?:tencent_game|rdgztest)_/.test(USER.nickname)) ;

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
    async apply(type?: string, options: any = {}): Promise<boolean | undefined> {
      // 0 关闭
      // 1 分享
      // 2 视频
      // 3 智能
      const status = (type ? CONFIG[`${type}Reward`] : 3) || 0;

      // 功能关闭
      if (status === 0) {
        showToast("当前不可用");
        return;
      }

      const tryVideo = (status & 2) === 2 && !!CONFIG.adUnitId;
      const tryShare = (status & 1) === 1;

      // 启用了视频激励，且有  adUnitId
      if (tryVideo) {
        // 看完视频广告
        const videoPlayed = await showVideoAd();
        if (videoPlayed) {
          return true;
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
        if (await share(options.share)) {
          return true;
        } else {
          showToast("完成转发才能获得奖励");
          return false;
        }
      }
    },
  };
}
