class OpenDataContext {
  public static createDisplayObject(type: string, width, height) {
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
      // 需要用到最新的微信版本
      // 调用其接口WebGLRenderingContext.wxBindCanvasTexture(number texture, Canvas canvas)
      // 如果没有该接口，会进行如下处理，保证画面渲染正确，但会占用内存。
      if (!context.wxBindCanvasTexture) {
        egret.startTick((timeStamp) => {
          egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
          bitmapData.webGLTexture = null;
          return false;
        }, this);
      }
    }
    return bitmap;
  }

  public static postMessage(data: any) {
    const openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage(data);
  }
}
