namespace game {
  export class Failing extends Base {
    private btnRestart: eui.Image;

    protected destroy(): void {
      // empty
    }

    protected createView(fromChildrenCreated?: boolean): void {
      if (fromChildrenCreated) {
        this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
          SceneManager.toScene("playing");
        }, this);

        this.initialized = true;
      }
    }
  }
}
