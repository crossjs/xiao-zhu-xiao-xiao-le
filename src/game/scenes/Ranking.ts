namespace game {
  export class Ranking extends eui.Component implements eui.UIComponent {
    private bitmap: egret.Bitmap;
    private btnClose: eui.Image;

    public constructor() {
      super();
    }

    /**
     * 点击按钮
     * Click the button
     */
    public async showBoard() {
      this.bitmap = yyw.OpenDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
      this.addChild(this.bitmap);

      // 主域向子域发送自定义消息
      yyw.OpenDataContext.postMessage({
        command: "open",
        x: 96,
        y: 216,
        width: this.stage.stageWidth - 96 * 2,
        height: this.stage.stageHeight - (216 + 350),
        stageWidth: this.stage.stageWidth,
        stageHeight: this.stage.stageHeight,
      });
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (this.bitmap) {
          const { parent } = this.bitmap;
          if (parent) {
            parent.removeChild(this.bitmap);
          }
        }
        yyw.OpenDataContext.postMessage({
          command: "close",
        });
        SceneManager.escape();
      }, this);
    }
  }
}
