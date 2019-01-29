namespace yyw {
  export const award = {
    async save({
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
    },
  };
}
