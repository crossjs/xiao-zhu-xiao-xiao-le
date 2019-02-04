/**
 * 带过期时间的缓存库
 */

namespace yyw {
  export const storage = {
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
