namespace game {
  export class Pbl extends Base {
    private btnBack: eui.Image;

    public constructor() {
      super();
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        SceneManager.toScene("landing");
      }, this);

      this.createView();
    }

    private async createView() {
      const pbl = await yyw.getPbl();
      Object.entries(pbl).forEach(([ key, value ]) => {
        (this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`] as eui.Label).text = String(value);
      });
    }
  }
}
