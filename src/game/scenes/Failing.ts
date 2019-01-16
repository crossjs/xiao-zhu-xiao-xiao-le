namespace game {
  export class Failing extends Base {
    protected initialized: boolean = false;
    private btnRestart: eui.Image;

    // public constructor() {
    //   super();
    // }

    protected createView(): void {
      // empty
    }

    protected destroy(): void {
      // empty
    }

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        SceneManager.toScene("playing");
      }, this);
    }
  }
}
