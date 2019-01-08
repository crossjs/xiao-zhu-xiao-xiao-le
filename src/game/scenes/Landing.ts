namespace game {
  export class Landing extends eui.Component implements eui.UIComponent {
    private btnBoard: eui.Image;
    private btnStart: eui.Image;
    private btnShare: eui.Image;

    public constructor() {
      super();
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnBoard.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          const scene: any = SceneManager.toScene("ranking", true);
          scene.showBoard();
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

      this.btnShare.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          yyw.share();
        },
        this,
      );
    }
  }
}
