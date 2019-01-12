namespace game {
  export class Failing extends Base {
    private btnRestart: eui.Image;

    public constructor() {
      super();
    }

    public saveData(data: any) {
      if (data) {
        // 保存分数
        yyw.saveData(data);
      }
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        const scene: Playing = SceneManager.toScene("playing");
        scene.restart();
      }, this);
    }
  }
}
