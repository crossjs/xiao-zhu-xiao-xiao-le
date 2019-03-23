namespace yyw {
  interface IPbl {
    score?: number;
    level?: number;
    points?: number;
    coins?: number;
  }

  export const pbl = {
    async all(): Promise<IPbl[]> {
      return cloud.call("getPbl");
    },

    async me(): Promise<IPbl> {
      return cloud.call("getMyPbl");
    },

    async save({
      score = 0,
      level = 0,
      duration = 0,
    }: {
      score?: number,
      level?: number,
      duration?: number,
    }): Promise<IPbl> {
      if (score || level) {
        yyw.sub.postMessage({
          command: "saveScore",
          score,
          level,
          duration,
        });
      }
      assign({
        score: Math.max(USER.score, score),
        level: Math.max(USER.level, level),
      });
      return cloud.call("saveMyPbl", { score, level });
    },
  };
}
