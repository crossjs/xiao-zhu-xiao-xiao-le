namespace yyw {
  let updateManager: wx.UpdateManager;

  export async function checkUpdate(): Promise<any> {
    if (typeof wx.getUpdateManager === "function") { // 请在使用前先判断是否支持
      updateManager = wx.getUpdateManager();
      return new Promise((resolve, reject) => {
        updateManager.onCheckForUpdate(({ hasUpdate }) => resolve(hasUpdate));
      });
    }
    return false;
  }

  export function applyUpdate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      updateManager.onUpdateReady(() => {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate();
        resolve(true);
      });

      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        resolve(false);
      });
    });
  }
}
