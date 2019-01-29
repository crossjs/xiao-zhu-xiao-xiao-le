namespace yyw {
  interface IPbl {
    score?: number;
    level?: number;
    combo?: number;
    points?: number;
    coins?: number;
    scores?: number;
    played?: number;
  }
  export const pbl = {
    async all(): Promise<IPbl[]> {
      if (CONFIG.serverEnabled) {
        return request({
          url: `${CONFIG.serverOrigin}/api/pbl`,
        });
      }
      return [];
    },

    async get(): Promise<IPbl> {
      if (CONFIG.serverEnabled) {
        return requestWithAuth({
          url: `${CONFIG.serverOrigin}/api/user/pbl`,
        });
      }
      return {};
    },

    async save({
      score,
      level,
      combo,
    }: {
      score: number,
      level: number,
      combo: number,
    }): Promise<IPbl> {
      if (score) {
        yyw.sub.postMessage({
          command: "saveScore",
          score,
        });
      }
      if (CONFIG.serverEnabled) {
        return requestWithAuth({
          url: `${CONFIG.serverOrigin}/api/user/pbl`,
          data: { score, level, combo },
          method: "POST",
        });
      }
      return {};
    },
  };
}
