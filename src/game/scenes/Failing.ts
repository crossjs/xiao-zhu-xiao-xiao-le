namespace game {
  export class Failing extends eui.Component implements eui.UIComponent {
    private btnRestart: eui.ToggleButton;

    public constructor() {
      super();
    }

    public setScore(score: number) {
      // 保存分数
      yyw.saveScore(score);
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnRestart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        const scene: game.Playing = SceneManager.toScene("playing");
        scene.restart();
      }, this);
    }
  }
}
