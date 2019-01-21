namespace game {
  const SNAPSHOT_KEY = "YYW_G4_TOOLS";

  export class Tools extends yyw.Base {
    private main: eui.Group;
    private btnClose: eui.Button;
    private btnMain: eui.Image;
    private btnLivesUp: eui.Group;
    private btnShuffle: eui.Group;
    private tfdLivesUp: eui.BitmapLabel;
    private tfdShuffle: eui.BitmapLabel;
    private imgLivesUp: eui.Image;
    private imgShuffle: eui.Image;
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
        yyw.onTap(this.btnLivesUp, async () => {
          if (!this.numLivesUp) {
            if (await yyw.share()) {
              yyw.showToast("获得道具：生命力+1");
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
        });

        yyw.onTap(this.btnShuffle, async () => {
          if (!this.numShuffle) {
            if (await yyw.share()) {
              yyw.showToast("获得道具：随机重新排列");
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
        });

        yyw.onTap(this.btnClose, () => {
          this.hideTip();
        });

        yyw.onTap(this.btnMain, async () => {
          // 转发/看完视频广告后领道具
          if (await yyw.share()) {
            await this.hideTip();
            this.numLivesUp++;
            this.update();
          } else {
            yyw.showToast("转发才能🉐道具");
          }
        });

        this.initialized = true;
      }
    }

    private update() {
      const { numLivesUp, numShuffle, tfdLivesUp, tfdShuffle, imgLivesUp, imgShuffle } = this;
      tfdLivesUp.text = `${numLivesUp}`;
      tfdShuffle.text = `${numShuffle}`;
      tfdLivesUp.visible = !!numLivesUp;
      tfdShuffle.visible = !!numShuffle;
      imgLivesUp.visible = !numLivesUp;
      imgShuffle.visible = !numShuffle;
    }
  }
}
