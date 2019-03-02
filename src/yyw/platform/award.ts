namespace yyw {
  export const award = {
    async save({
      coins = 0,
      points = 0,
    }: { coins?: number, points?: number }): Promise<any> {
      if (coins || points) {
        return cloud.call("saveAward", { coins, points });
      }
      return {};
    },
  };
}
