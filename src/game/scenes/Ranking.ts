namespace game {
  export class Ranking extends yyw.Base {
    private bmpBoard: egret.Bitmap;
    private btnKO: eui.Button;

    protected destroy() {
      yyw.removeFromStage(this.bmpBoard);
      yyw.sub.postMessage({
        command: "closeRanking",
      });
    }

    /**
     * 准备榜单
     */
    protected createView(fromChildrenCreated?: boolean) {
      const { stageWidth } = this.stage;
      const x = 48;
      const y = 288;
      const width = stageWidth - x * 2;
      const height = 900;
      this.bmpBoard = yyw.sub.createDisplayObject(null, width, height);
      this.bmpBoard.x = x;
      this.bmpBoard.y = y;
      this.addChild(this.bmpBoard);

      // 主域向子域发送自定义消息
      yyw.sub.postMessage({
        command: "openRanking",
        x,
        y,
        width,
        height,
        openid: yyw.CURRENT_USER.openId || 0,
      });

      if (fromChildrenCreated) {
        yyw.onTap(this.btnKO, () => {
          SceneManager.escape();
        });

        this.initialized = true;
      }
    }
  }
}
