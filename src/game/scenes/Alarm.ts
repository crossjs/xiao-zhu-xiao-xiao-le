namespace game {
  export class Alarm extends yyw.Base {
    private _mask: eui.Image;
    private modal: eui.Group;
    private images: eui.Group;
    private btnOK: eui.Button;
    private btnKO: eui.Button;

    // public async hideModal() {
    //   this.btnOK.visible = false;
    //   this.btnKO.visible = false;
    //   yyw.fadeOut(this._mask);
    //   await yyw.twirlOut(this.modal);
    // }

    protected destroy() {
      yyw.removeTweens(this._mask);
      yyw.removeTweens(this.modal);
      this._mask.visible = false;
      this.modal.visible = false;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      this.showModal();
      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, async () => {
          if (await yyw.reward.apply("tool")) {
            yyw.emit("RANDOM_TOOL");
            yyw.director.escape();
          }
        });

        yyw.onTap(this.btnKO, () => {
          yyw.director.escape();
        });

        this.initialized = true;
      }
    }

    private async showModal() {
      yyw.fadeIn(this._mask);
      await yyw.twirlIn(this.modal);
      this.btnOK.visible = true;
      this.btnKO.visible = true;
      this.animate();
    }

    private animate() {
      const n = this.images.numChildren;
      let currentIndex = 0;
      const tween = async () => {
        const image: any = this.images.getChildAt(currentIndex);
        yyw.setZIndex(image);
        await yyw.fadeIn(image, 2000);
        currentIndex = (currentIndex + 1) % n;
        if (this.modal.visible) {
          tween();
        }
      };
      if (this.modal.visible) {
        tween();
      }
    }
  }
}
