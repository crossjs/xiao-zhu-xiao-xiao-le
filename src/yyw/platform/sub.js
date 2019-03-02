var yyw;
(function (yyw) {
    yyw.sub = {
        createDisplayObject(type, width, height) {
            const bitmapData = new egret.BitmapData(sharedCanvas);
            bitmapData.$deleteSource = false;
            const texture = new egret.Texture();
            texture._setBitmapData(bitmapData);
            const bitmap = new egret.Bitmap(texture);
            bitmap.width = width;
            bitmap.height = height;
            if (egret.Capabilities.renderMode === "webgl") {
                const renderContext = egret.wxgame.WebGLRenderContext.getInstance();
                const context = renderContext.context;
                if (!context.wxBindCanvasTexture) {
                    egret.setInterval(() => {
                        egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
                        bitmapData.webGLTexture = null;
                    }, this, 500);
                }
            }
            return bitmap;
        },
        postMessage(data) {
            const openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage(data);
        },
    };
})(yyw || (yyw = {}));
