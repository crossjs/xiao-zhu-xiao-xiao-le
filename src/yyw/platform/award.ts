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
        let shouldPut = false;
        if (coins) {
          const toCoins = USER.coins + coins;
          if (toCoins >= 0) {
            USER.coins = toCoins;
            shouldPut = true;
          }
        }
        if (points) {
          const toPoints = USER.points + points;
          if (toPoints >= 0) {
            USER.points = toPoints;
            shouldPut = true;
          }
        }
        if (shouldPut) {
          await cacheUser();
          return cloud.call("saveAward", { coins, points });
        }
      }
      return {};
    },
  };
}
