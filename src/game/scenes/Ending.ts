namespace game {
  export class Ending extends yyw.Base {
    private btnRestart: eui.Image;

    protected destroy(): void {
      // empty
    }

    protected createView(fromChildrenCreated?: boolean): void {
      if (fromChildrenCreated) {
        yyw.onTap(this.btnRestart, () => {
          SceneManager.toScene("playing");
        });

        this.initialized = true;
      }
    }
  }
}
