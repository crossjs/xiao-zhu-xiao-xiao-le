namespace game {
  export class Pbl extends yyw.Base {
    private btnHome: eui.Button;
    private btnBack: eui.Button;

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
        yyw.onTap(this.btnHome, () => {
          SceneManager.toScene("landing");
        });

        yyw.onTap(this.btnBack, () => {
          SceneManager.escape();
        });

        this.initialized = true;
      }
    }
  }
}
