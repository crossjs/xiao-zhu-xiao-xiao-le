namespace yyw {
  export function showModal(content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: "",
        content,
        success: ({ confirm, cancel }) =>  {
          if (confirm) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail: () =>  {
          resolve(false);
        },
      });
    });
  }
  export function showToast(title: string): void {
    wx.showToast({
      title,
      icon: "none",
    });
  }
}
