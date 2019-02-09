namespace yyw {
  export function loadImage(url: string): Promise<egret.Bitmap> {
    return new Promise(async (resolve, reject) => {
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
        null,
      );
      imageLoader.once(
        egret.IOErrorEvent.IO_ERROR,
        (e) => {
          reject(e);
        },
        null,
      );
      imageLoader.crossOrigin = "anonymous";
      imageLoader.load(await fs.ensure(url));
    });
  }

  export function loadAudio(url: string): Promise<egret.Sound> {
    return new Promise(async (resolve, reject) => {
      const loader: egret.URLLoader = new egret.URLLoader();
      loader.addEventListener(egret.Event.COMPLETE, () => {
        resolve(loader.data);
      }, this);
      loader.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
        resolve(null);
      }, this);
      loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
      loader.load(new egret.URLRequest(await fs.ensure(url)));
    });
  }
}
