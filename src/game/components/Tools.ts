namespace game {
  const SNAPSHOT_KEY = "YYW_G4_TOOLS";

  export class Tools extends Base {
    private btnLivesUp: eui.Image;
    private btnShuffle: eui.Image;
    private tfdLivesUp: eui.BitmapLabel;
    private tfdShuffle: eui.BitmapLabel;
    private numLivesUp: number = 0;
    private numShuffle: number = 0;

    protected destroy() {
      const { numLivesUp, numShuffle } = this;
      yyw.setStorage(SNAPSHOT_KEY, {
        numLivesUp,
        numShuffle,
      });
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      const snapshot = await yyw.getStorage(SNAPSHOT_KEY);
      if (snapshot) {
        Object.assign(this, snapshot);
      }
      this.update();

      if (fromChildrenCreated) {
        this.btnLivesUp.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
          if (!this.numLivesUp) {
            if (await yyw.share()) {
              this.numLivesUp++;
              this.update();
            } else {
              yyw.showToast("转发才能🉐道具");
            }
            return;
          }
          this.numLivesUp--;
          this.update();
          this.dispatchEventWith("TOOL_USED", false, {
            type: "livesUp",
          });
        }, this);

        this.btnShuffle.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
          if (!this.numShuffle) {
            if (await yyw.share()) {
              this.numShuffle++;
              this.update();
            } else {
              yyw.showToast("转发才能🉐道具");
            }
            return;
          }
          this.numShuffle--;
          this.update();
          this.dispatchEventWith("TOOL_USED", false, {
            type: "shuffle",
          });
        }, this);

        this.initialized = true;
      }
    }

    private update() {
      this.tfdShuffle.text = `${this.numShuffle}`;
      this.tfdLivesUp.text = `${this.numLivesUp}`;
    }
  }
}
