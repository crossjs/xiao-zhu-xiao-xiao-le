namespace game {
  export class Pbl extends Base {
    private btnBack: eui.Image;
    private initialized: boolean = false;

    public constructor() {
      super();

      this.addEventListener(
        egret.Event.ADDED_TO_STAGE,
        () => {
          if (this.initialized) {
            this.createView();
          }
        },
        this,
      );
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

      this.initialized = true;
    }
  }
}
