namespace yyw {
  /**
   * 开放数据域
   */
  export const sub = {
    createDisplayObject(type: string, width: number, height: number) {
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
          // 每半秒调用一次，避免性能问题
          egret.setInterval(() => {
            egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
            bitmapData.webGLTexture = null;
          }, this, 500);
        }
      }
      return bitmap;
    },

    postMessage(data: any) {
      const openDataContext = wx.getOpenDataContext();
      openDataContext.postMessage(data);
    },
  };
}
