namespace game {
  const SNAPSHOT_KEY = "YYW_G4_TOOLS";

  export class Tools extends yyw.Base {
    private main: eui.Group;
    private btnClose: eui.Button;
    private btnMain: eui.Image;
    private btnLivesUp: eui.Image;
    private btnShuffle: eui.Image;
    private tfdLivesUp: eui.BitmapLabel;
    private tfdShuffle: eui.BitmapLabel;
    private numLivesUp: number = 0;
    private numShuffle: number = 0;

    public async showTip() {
      this.main.scaleX = 0;
      this.main.scaleY = 0;
      this.main.visible = true;
      await yyw.PromisedTween
      .get(this.main)
      .to({
        scaleX: 1,
        scaleY: 1,
        rotation: 360,
      });
    }

    public async hideTip() {
      await yyw.PromisedTween
      .get(this.main)
      .to({
        scaleX: 0,
        scaleY: 0,
        rotation: 0,
      });
      this.main.visible = false;
      this.main.scaleX = 1;
      this.main.scaleY = 1;
    }

    protected destroy() {
      yyw.PromisedTween.removeTweens(this.main);
      this.main.visible = false;
      this.main.scaleX = 1;
      this.main.scaleY = 1;
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

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
          this.hideTip();
        }, this);

        this.btnMain.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
          // 转发/看完视频广告后领道具
          if (await yyw.share()) {
            await this.hideTip();
            this.numLivesUp++;
            this.update();
          } else {
            yyw.showToast("转发才能🉐道具");
          }
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
