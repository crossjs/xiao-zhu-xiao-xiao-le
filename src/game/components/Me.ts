namespace game {
  export class Me extends yyw.Base {
    private bmpMe: egret.Bitmap;
    private offLight: () => void;

    protected destroy() {
      yyw.removeElement(this.bmpMe);
      this.bmpMe = null;
      if (this.offLight) {
        this.offLight();
      }
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.main, () => {
          yyw.director.toScene("pbl", true);
        });
      }

      try {
        this.bmpMe = await yyw.loadImage(yyw.USER.avatarUrl);
        this.bmpMe.width = 48;
        this.bmpMe.height = 48;
        this.bmpMe.x = 42;
        this.bmpMe.y = 12;
        this.addChildAt(this.bmpMe, 1);
        this.offLight = yyw.light(this.bmpMe);
      } catch (error) {
        egret.error(error);
      }
    }
  }
}
