namespace yyw {
  export async function preReward(type?: string): Promise<boolean | undefined> {
    const status = type ? CONFIG[`${type}Reward`] : 3;

    // 功能关闭
    if (status === 0) {
      showToast("暂未开放");
      return;
    }

    // 有 UnitId
    if ((status & 1) === 2 && CONFIG.adUnitId) {
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

    if ((status & 1) === 1) {
      // 完成转发
      if (await share()) {
        return true;
      } else {
        showToast("完成转发才能获得奖励");
        return false;
      }
    }
  }
}
