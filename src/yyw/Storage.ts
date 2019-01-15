namespace yyw {
  export function getStorage(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success(res) {
          resolve(res.data);
        },
        fail(e) {
          resolve(null);
        },
      });
    });
  }

  export function setStorage(key: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data,
        success(res) {
          resolve(res.data);
        },
        fail(e) {
          reject(e);
        },
      });
    });
  }
}
