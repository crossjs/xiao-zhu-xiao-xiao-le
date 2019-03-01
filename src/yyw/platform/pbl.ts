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
      return cloud.call("saveMyPbl", { score, level, combo });
    },
  };
}
