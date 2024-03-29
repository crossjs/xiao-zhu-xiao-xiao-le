namespace yyw {
  /**
   * 带过期时间的缓存库
   */
  export const storage = {
    /**
     * 清除指定键的值
     * @param key 键
     */
    remove(key: string): Promise<any> {
      return new Promise((resolve, reject) => {
        wx.removeStorage({
          key,
          success() {
            resolve();
          },
          fail(e) {
            resolve(null);
          },
        });
      });
    },

    /**
     * 获取指定键的值
     * @param key 键
     */
    get(key: string): Promise<any> {
      return new Promise((resolve, reject) => {
        wx.getStorage({
          key,
          success({ data }) {
            if (data) {
              const { value, expiresAt } = data;
              resolve((!expiresAt || expiresAt > Date.now()) ? value : null);
            } else {
              resolve(null);
              storage.remove(key);
            }
          },
          fail(e) {
            resolve(null);
            storage.remove(key);
          },
        });
      });
    },

    /**
     * 设置指定键的值
     * @param key 键
     * @param data 值
     * @param expiresIn 过期毫秒数
     */
    set(key: string, data: any, expiresIn?: number): Promise<any> {
      return new Promise((resolve, reject) => {
        wx.setStorage({
          key,
          data: {
            value: data,
            expiresAt: expiresIn ? (Date.now() + expiresIn) : 0,
          },
          success() {
            resolve();
          },
          fail(e) {
            resolve(null);
          },
        });
      });
    },
  };
}
