namespace game {
  export class Pbl extends yyw.Base {
    private btnHome: eui.Button;
    private btnBack: eui.Button;

    protected destroy() {
      // empty
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      const pbl = await yyw.getPbl();
      Object.entries(pbl).forEach(([ key, value ]: [string, number]) => {
        if (key === "balance") {
          value = yyw.toFixed(value);
        }
        (this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`] as eui.BitmapLabel).text = String(value);
      });

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
