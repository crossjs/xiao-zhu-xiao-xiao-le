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

  export async function savePbl(data: {
    score: number,
    level: number,
    combo: number,
  }): Promise<any> {
    if (data.score) {
      yyw.sub.postMessage({
        command: "saveScore",
        score: data.score,
      });
    }
    // 保存到自己的服务器
    if (CONFIG.serverEnabled) {
      return requestWithAuth({
        url: `${CONFIG.serverOrigin}/api/user/pbl`,
        data,
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
