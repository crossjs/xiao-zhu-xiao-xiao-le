var yyw;
(function (yyw) {
    function loadImage(url) {
        return new Promise(async (resolve, reject) => {
            const imageLoader = new egret.ImageLoader();
            imageLoader.once(egret.Event.COMPLETE, () => {
                const bmd = imageLoader.data;
                const texture = new egret.Texture();
                texture.bitmapData = bmd;
                const bm = new egret.Bitmap(texture);
                resolve(bm);
            }, null);
            imageLoader.once(egret.IOErrorEvent.IO_ERROR, (e) => {
                reject(e);
            }, null);
            imageLoader.crossOrigin = "anonymous";
            imageLoader.load(await yyw.fs.ensure(url));
        });
    }
    yyw.loadImage = loadImage;
    function loadAudio(url) {
        return new Promise(async (resolve, reject) => {
            const loader = new egret.URLLoader();
            loader.once(egret.Event.COMPLETE, () => {
                resolve(loader.data);
            }, this);
            loader.once(egret.IOErrorEvent.IO_ERROR, () => {
                resolve(null);
            }, this);
            loader.dataFormat = egret.URLLoaderDataFormat.SOUND;
            loader.load(new egret.URLRequest(await yyw.fs.ensure(url)));
        });
    }
    yyw.loadAudio = loadAudio;
})(yyw || (yyw = {}));
