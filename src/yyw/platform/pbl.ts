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
      return cloud.call("getPbl");
    },

    async me(): Promise<IPbl> {
      return cloud.call("getMyPbl");
    },

    async save({
      score,
      combo,
      level,
    }: {
      score?: number,
      combo?: number,
      level?: number,
    }): Promise<IPbl> {
      if (score) {
        yyw.sub.postMessage({
          command: "saveScore",
          score,
          level,
        });
      }
      assign({
        score: Math.max(USER.score, score),
        level: Math.max(USER.level, level),
        combo: Math.max(USER.combo, combo),
      });
      return cloud.call("saveMyPbl", { score, combo, level });
    },
  };
}
