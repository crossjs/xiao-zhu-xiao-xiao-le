namespace yyw {
  export async function saveData(data: {
    score: number,
    level: number,
    combo: number,
  }): Promise<any> {
    if (data.score) {
      yyw.OpenDataContext.postMessage({
        command: "saveScore",
        score: data.score,
      });
    }
    // 保存到自己的服务器
    if (GAME_SERVER_ENABLED) {
      // const lastScore = await yyw.getStorage("score") || 0;
      requestWithAuth({
        url: `${GAME_SERVER_ORIGIN}/api/user/score`,
        data,
        method: "POST",
      });
    }
  }

  export async function saveRedpack(amount: number): Promise<any> {
    if (amount) {
      // 保存到自己的服务器
      if (GAME_SERVER_ENABLED) {
        return requestWithAuth({
          url: `${GAME_SERVER_ORIGIN}/api/user/redpack`,
          data: { amount },
          method: "POST",
        });
      }
    }
  }

  export async function getPbl(): Promise<any> {
    // 保存到自己的服务器
    if (GAME_SERVER_ENABLED) {
      return requestWithAuth({
        url: `${GAME_SERVER_ORIGIN}/api/user/pbl`,
      });
    }
    return {};
  }
}
