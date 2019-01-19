namespace yyw {
  export class RemoteLoader {
    public static loadImage(url: string): Promise<egret.Bitmap> {
      return new Promise((resolve, reject) => {
        const imageLoader: egret.ImageLoader = new egret.ImageLoader();
        imageLoader.once(
          egret.Event.COMPLETE,
          () => {
            const bmd: egret.BitmapData = imageLoader.data;
            // 创建纹理对象
            const texture = new egret.Texture();
            texture.bitmapData = bmd;
            const bm: egret.Bitmap = new egret.Bitmap(texture);
            resolve(bm);
          },
          this,
        );
        imageLoader.once(
          egret.IOErrorEvent.IO_ERROR,
          (e) => {
            reject(e);
          },
          this,
        );
        imageLoader.crossOrigin = "anonymous";
        imageLoader.load(url);
      });
    }
  }
}
