namespace game {
  export class Pbl extends Base {
    private btnBack: eui.Image;

    protected destroy() {
      // empty
    }

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.createView();
      this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        SceneManager.escape();
      }, this);

      this.initialized = true;
    }

    protected async createView() {
      const pbl = await yyw.getPbl();
      Object.entries(pbl).forEach(([ key, value ]: [string, number]) => {
        if (key === "balance") {
          value = yyw.toFixed(value);
        }
        (this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`] as eui.BitmapLabel).text = String(value);
      });
    }
  }
}
