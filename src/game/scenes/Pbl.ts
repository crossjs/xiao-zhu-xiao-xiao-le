namespace game {
  export class Pbl extends yyw.Base {
    private btnBack: eui.Button;
    private btnHome: eui.Button;
    private btnRestart: eui.Button;

    protected destroy() {
      // empty
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      try {
        const pbl = await yyw.getPbl();
        Object.entries(pbl).forEach(([ key, value ]: [string, number]) => {
          (this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`] as eui.BitmapLabel).text = String(value);
        });
      } catch (error) {
        egret.error(error);
      }

      if (fromChildrenCreated) {
        yyw.onTap(this.btnBack, () => {
          SceneManager.escape();
        });

        yyw.onTap(this.btnHome, () => {
          SceneManager.toScene("landing");
        });

        yyw.onTap(this.btnRestart, () => {
          SceneManager.toScene("playing", false, (scene: Playing) => {
            scene.restart();
          });
        });

        this.initialized = true;
      }
    }
  }
}
