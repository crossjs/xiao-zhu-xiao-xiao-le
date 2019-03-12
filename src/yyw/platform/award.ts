namespace yyw {
  export const award = {
    /**
     * 保存用户积分与金币
     */
    async save({
      coins = 0,
      points = 0,
    }: { coins?: number, points?: number }): Promise<any> {
      if (coins || points) {
        const payload = {};
        if (coins) {
          const toCoins = USER.coins + coins;
          if (toCoins >= 0) {
            Object.assign(payload, {
              coins: toCoins,
            });
          }
        }
        if (points) {
          const toPoints = USER.points + points;
          if (toPoints >= 0) {
            Object.assign(payload, {
              points: toPoints,
            });
          }
        }
        if (Object.keys(payload).length) {
          await assign(payload);
          return cloud.call("saveAward", { coins, points });
        }
      }
      return {};
    },
  };
}
