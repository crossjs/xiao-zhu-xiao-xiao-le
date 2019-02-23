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
      return request(`${CONFIG.serverOrigin}/api/pbl`);
    },

    async me(): Promise<IPbl> {
      return requestWithAuth(`${CONFIG.serverOrigin}/api/user/pbl`);
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
      return requestWithAuth({
        url: `${CONFIG.serverOrigin}/api/user/pbl`,
        data: { score, level, combo },
        method: "POST",
      });
    },
  };
}
