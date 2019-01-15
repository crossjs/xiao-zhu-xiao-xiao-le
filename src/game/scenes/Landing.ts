namespace game {
  export class Landing extends Base {
    private btnBoard: eui.Image;
    private btnPbl: eui.Image;
    private btnShare: eui.Image;
    private btnStart: eui.Image;
    private btnSound: eui.ToggleButton;
    private tfdVersion: eui.Label;

    public constructor() {
      super();
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      yyw.createUserInfoButton({
        left: this.btnStart.x,
        top: this.btnStart.y,
        width: this.btnStart.width,
        height: this.btnStart.height,
        callback: () => {
          SceneManager.toScene("playing");
        },
      });

      this.btnBoard.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          const scene: any = SceneManager.toScene("ranking", true);
          scene.showBoard();
        },
        this,
      );

      this.btnPbl.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          SceneManager.toScene("pbl", true);
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

      this.tfdVersion.text = VERSION;

      // yyw.createBannerAd("xxxx", 0, 0, 375, 200);
    }
  }
}
