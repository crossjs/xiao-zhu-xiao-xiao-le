namespace game {
  export class Landing extends eui.Component implements eui.UIComponent {
    private btnShare: eui.Image;
    private btnStart: eui.Image;

    public constructor() {
      super();
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnShare.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          Platform.share();
        },
        this,
      );

      this.btnStart.addEventListener(
        egret.TouchEvent.TOUCH_TAP,
        () => {
          SceneManager.toScene("play");
        },
        this,
      );
    }
  }
}
