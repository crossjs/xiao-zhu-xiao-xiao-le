namespace yyw {
  export async function preReward(): Promise<boolean | undefined> {
    if (CONFIG.adEnabled) {
      // 有 UnitId
      if (CONFIG.adUnitId) {
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
      // 完成转发
      if (await share()) {
        return true;
      } else {
        showToast("完成转发才能获得奖励");
      }
    }
  }
}
