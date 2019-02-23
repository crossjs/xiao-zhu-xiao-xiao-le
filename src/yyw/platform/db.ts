/**
 * 带过期时间的缓存库
 */

namespace yyw {
  export const db = {
    /**
     * 清除指定键的值
     * @param key 键
     */
    async remove(key: string): Promise<any> {
      return yyw.requestWithAuth({
        url: `${CONFIG.serverOrigin}/api/db?key=${key}`,
        method: "DELETE",
      });
    },

    /**
     * 获取指定键的值
     * @param key 键
     */
    async get(key: string): Promise<any> {
      const data = await yyw.requestWithAuth(`${CONFIG.serverOrigin}/api/db?key=${key}`);

      if (data) {
        const { value, expiresAt } = data;
        if (!expiresAt || expiresAt > Date.now()) {
          return value;
        }
        // 已过期，清理
        db.remove(key);
      }

      return null;
    },

    /**
     * 设置指定键的值
     * @param key 键
     * @param data 值
     * @param expiresIn 过期毫秒数
     */
    async set(key: string, data: any, expiresIn?: number): Promise<any> {
      return yyw.requestWithAuth({
        url: `${CONFIG.serverOrigin}/api/db?key=${key}`,
        data: {
          data: {
            value: data,
            expiresAt: expiresIn ? (Date.now() + expiresIn) : 0,
          },
        },
        method: "POST",
      });
    },
  };
}
