namespace game {
  export class Me extends yyw.Base {
    private bmpMe: egret.Bitmap;
    private main: eui.Image;

    protected destroy() {
      yyw.removeChild(this.bmpMe);
      this.bmpMe = null;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      try {
        this.bmpMe = await yyw.RemoteLoader.loadImage(yyw.CURRENT_USER.avatarUrl);
        this.bmpMe.width = 48;
        this.bmpMe.height = 48;
        this.bmpMe.x = 21;
        this.bmpMe.y = 12;
        this.addChildAt(this.bmpMe, 1);
      } catch (error) {
        egret.error(error);
      }

      if (fromChildrenCreated) {
        yyw.onTap(this.main, () => {
          SceneManager.toScene("pbl", true);
        });

        this.initialized = true;
      }
    }
  }
}
