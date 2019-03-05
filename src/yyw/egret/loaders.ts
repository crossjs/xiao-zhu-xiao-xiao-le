namespace yyw {
  export function loadImage(url: string, textureOnly: boolean = false): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const imageLoader: egret.ImageLoader = new egret.ImageLoader();
      imageLoader.once(
        egret.Event.COMPLETE,
        () => {
          const bmd: egret.BitmapData = imageLoader.data;
          // 创建纹理对象
          const texture = new egret.Texture();
          texture.bitmapData = bmd;
          if (textureOnly) {
            resolve(texture);
          } else {
            const bm: egret.Bitmap = new egret.Bitmap(texture);
            resolve(bm);
          }
        },
        null,
      );
      imageLoader.once(
        egret.IOErrorEvent.IO_ERROR,
        (e: any) => {
          reject(e);
        },
        null,
      );
      // 支持跨域
      imageLoader.crossOrigin = "anonymous";
      imageLoader.load(await fs.ensure(url));
    });
  }

  export function loadAudio(url: string): Promise<egret.Sound> {
    return new Promise(async (resolve, reject) => {
      const loader: egret.URLLoader = new egret.URLLoader();
      loader.once(egret.Event.COMPLETE, () => {
        resolve(loader.data);
      }, this);
      loader.once(egret.IOErrorEvent.IO_ERROR, () => {
        resolve(null);
      }, this);
      loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
      loader.load(new egret.URLRequest(await fs.ensure(url)));
    });
  }
}
