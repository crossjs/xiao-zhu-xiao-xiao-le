namespace yyw {
  export async function getPbl(): Promise<any> {
    // 保存到自己的服务器
    if (CONFIG.serverEnabled) {
      return requestWithAuth({
        url: `${CONFIG.serverOrigin}/api/user/pbl`,
      });
    }
    return {};
  }

  export async function savePbl({
    score,
    level,
    combo,
  }: {
    score: number,
    level: number,
    combo: number,
  }): Promise<any> {
    if (score) {
      yyw.sub.postMessage({
        command: "saveScore",
        score,
      });
    }
    // 保存到自己的服务器
    if (CONFIG.serverEnabled) {
      return requestWithAuth({
        url: `${CONFIG.serverOrigin}/api/user/pbl`,
        data: { score, level, combo },
        method: "POST",
      });
    }
    return {};
  }

  export async function saveAward({
    coins,
  }: { coins?: number, points?: number }): Promise<any> {
    if (coins) {
      // 保存到自己的服务器
      if (CONFIG.serverEnabled) {
        return requestWithAuth({
          url: `${CONFIG.serverOrigin}/api/user/award`,
          data: { coins },
          method: "POST",
        });
      }
    }
    return {};
  }
}
