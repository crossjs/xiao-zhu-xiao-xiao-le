namespace game {
  export class Alarm extends yyw.Base {
    private modal: eui.Group;
    private images: eui.Group;
    private btnOK: eui.Button;
    private btnKO: eui.Button;

    // public async hideModal() {
    //   this.btnOK.visible = false;
    //   this.btnKO.visible = false;
    //   yyw.fadeOut(this.bg);
    //   await yyw.twirlOut(this.modal);
    // }

    protected destroy() {
      yyw.removeTweens(this.bg);
      yyw.removeTweens(this.modal);
      this.bg.visible = false;
      this.modal.visible = false;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      this.showModal();
      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, async () => {
          if (await yyw.preReward()) {
            yyw.emit("RANDOM_TOOL");
            SceneManager.escape();
          }
        });

        yyw.onTap(this.btnKO, () => {
          SceneManager.escape();
        });

        this.initialized = true;
      }
    }

    private async showModal() {
      yyw.fadeIn(this.bg);
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
