namespace game {
  export class Landing extends Base {
    protected initialized: boolean = false;
    private btnBoard: eui.Image;
    private btnShare: eui.Image;
    private btnStart: eui.Image;
    private btnSound: eui.ToggleButton;
    private tfdVersion: eui.Label;
    private button: wx.UserInfoButton;
    private recommender: box.All;

    // public constructor() {
    //   super();
    // }

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    protected async createView(): Promise<void> {
      const { x: left, y: top, width, height } = this.btnStart;
      this.button = await yyw.createUserInfoButton({
        left,
        top,
        width,
        height,
        onTap: () => {
          SceneManager.toScene("playing");
        },
      });

      this.createRecommender();

      this.tfdVersion.text = VERSION;
    }

    protected destroy(): void {
      if (this.button) {
        this.button.destroy();
      }
      if (this.recommender) {
        this.recommender.destroy();
      }
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.createView();

      this.btnBoard.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          SceneManager.toScene("ranking", true);
        },
        this,
      );

      this.btnShare.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          yyw.share();
        },
        this,
      );

      this.btnStart.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          SceneManager.toScene("playing");
        },
        this,
      );

      this.btnSound.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          const { selected } = this.btnSound;
          this.btnSound.currentState = selected ? "selected" : "up";
          yyw.setMute(!selected);
        },
        this,
      );

      this.initialized = true;

      // yyw.createBannerAd("xxxx", 0, 0, 375, 200);
    }

    private createRecommender() {
      this.recommender = new box.All();
      this.recommender.x = 0;
      this.recommender.y = this.stage.stageHeight - 208;
      this.addChild(this.recommender);
    }
  }
}
