namespace game {
  export class Ranking extends Base {
    private bmpBoard: egret.Bitmap;
    private btnClose: eui.Image;

    public constructor() {
      super();
    }

    /**
     * 点击按钮
     * Click the button
     */
    public async showBoard() {
      const { stageWidth, stageHeight } = this.stage;
      const x = 48;
      const y = 288;
      const width = stageWidth - x * 2;
      const height = 900;
      this.bmpBoard = yyw.OpenDataContext.createDisplayObject(null, width, height);
      this.addChild(this.bmpBoard);
      this.bmpBoard.x = x;
      this.bmpBoard.y = y;

      // 主域向子域发送自定义消息
      yyw.OpenDataContext.postMessage({
        command: "openRanking",
        x,
        y,
        width,
        height,
        openid: yyw.CURRENT_USER.providerId || 0,
      });
    }

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (this.bmpBoard) {
          const { parent } = this.bmpBoard;
          if (parent) {
            parent.removeChild(this.bmpBoard);
          }
        }
        yyw.OpenDataContext.postMessage({
          command: "closeRanking",
        });
        SceneManager.escape();
      }, this);
    }
  }
}
