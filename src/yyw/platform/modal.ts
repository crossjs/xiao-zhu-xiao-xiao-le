namespace yyw {
  export function showModal(content: string, showCancel: boolean = true): Promise<boolean> {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: "",
        content,
        showCancel,
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

  export function hideToast(): void {
    wx.hideToast();
  }
}
