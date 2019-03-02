var yyw;
(function (yyw) {
    let updateManager;
    async function checkUpdate() {
        if (typeof wx.getUpdateManager === "function") {
            updateManager = wx.getUpdateManager();
            return new Promise((resolve, reject) => {
                updateManager.onCheckForUpdate(({ hasUpdate }) => resolve(hasUpdate));
            });
        }
        return false;
    }
    yyw.checkUpdate = checkUpdate;
    function applyUpdate() {
        return new Promise((resolve, reject) => {
            updateManager.onUpdateReady(() => {
                updateManager.applyUpdate();
                resolve(true);
            });
            updateManager.onUpdateFailed(() => {
                resolve(false);
            });
        });
    }
    yyw.applyUpdate = applyUpdate;
})(yyw || (yyw = {}));
