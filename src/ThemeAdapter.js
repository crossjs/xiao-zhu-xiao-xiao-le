class ThemeAdapter {
    getTheme(url, onSuccess, onError, thisObject) {
        function onResGet(e) {
            onSuccess.call(thisObject, e);
        }
        function onResError(e) {
            if (e.resItem.url === url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                onError.call(thisObject);
            }
        }
        if (typeof generateEUI !== "undefined") {
            egret.callLater(() => {
                onSuccess.call(thisObject, generateEUI);
            }, this);
        }
        else if (typeof generateEUI2 !== "undefined") {
            RES.getResByUrl("resource/gameEui.json", (data) => {
                window.JSONParseClass.setData(data);
                egret.callLater(() => {
                    onSuccess.call(thisObject, generateEUI2);
                }, this);
            }, this, RES.ResourceItem.TYPE_JSON);
        }
        else if (typeof generateJSON !== "undefined") {
            if (url.indexOf(".exml") > -1) {
                const dataPath = url.split("/");
                dataPath.pop();
                const dirPath = dataPath.join("/") + "_EUI.json";
                if (!generateJSON.paths[url]) {
                    RES.getResByUrl(dirPath, (data) => {
                        window.JSONParseClass.setData(data);
                        egret.callLater(() => {
                            onSuccess.call(thisObject, generateJSON.paths[url]);
                        }, this);
                    }, this, RES.ResourceItem.TYPE_JSON);
                }
                else {
                    egret.callLater(() => {
                        onSuccess.call(thisObject, generateJSON.paths[url]);
                    }, this);
                }
            }
            else {
                egret.callLater(() => {
                    onSuccess.call(thisObject, generateJSON);
                }, this);
            }
        }
        else {
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
            RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
        }
    }
}
