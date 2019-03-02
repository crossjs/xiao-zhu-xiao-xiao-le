var yyw;
(function (yyw) {
    /**
     * 开放数据域
     */
    yyw.sub = {
        createDisplayObject: function (type, width, height) {
            var bitmapData = new egret.BitmapData(sharedCanvas);
            bitmapData.$deleteSource = false;
            var texture = new egret.Texture();
            texture._setBitmapData(bitmapData);
            var bitmap = new egret.Bitmap(texture);
            bitmap.width = width;
            bitmap.height = height;
            if (egret.Capabilities.renderMode === "webgl") {
                var renderContext = egret.wxgame.WebGLRenderContext.getInstance();
                var context = renderContext.context;
                if (!context.wxBindCanvasTexture) {
                    // 每半秒调用一次，避免性能问题
                    egret.setInterval(function () {
                        egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
                        bitmapData.webGLTexture = null;
                    }, this, 500);
                }
            }
            return bitmap;
        },
        postMessage: function (data) {
            var openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage(data);
        },
    };
})(yyw || (yyw = {}));
