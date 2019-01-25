namespace game {
  export class Ending extends yyw.Base {
    private main: eui.Group;
    private btnOK: eui.Button;
    private btnKO: eui.Button;
    private tfdScore: eui.BitmapLabel;
    private bmpTop3: egret.Bitmap;

    protected destroy(): void {
      // empty
    }

    protected createView(fromChildrenCreated?: boolean): void {
      if (fromChildrenCreated) {
        let gameData: {
          level?: number,
          combo?: number,
          score?: number,
        } = {};

        // 体力不足
        yyw.on("ARENA_LIVES_EXHAUST", ({ data }: any) => {
          gameData = data;
          this.tfdScore.text = `${gameData.score}`;
        });

        yyw.onTap(this.btnOK, async () => {
          if (await yyw.preReward()) {
            this.revive();
          }
        });

        yyw.onTap(this.btnKO, () => {
          SceneManager.escape();
          yyw.emit("GAME_OVER", gameData);
        });

        this.initialized = true;
      }
    }

    private showTop3() {
      const width = this.main.width;
      const height = 300;
      this.bmpTop3 = yyw.sub.createDisplayObject(null, width, height);
      this.main.addChild(this.bmpTop3);

      // 主域向子域发送自定义消息
      yyw.sub.postMessage({
        command: "openTop3",
        width,
        height,
      });
    }

    private revive() {
      yyw.emit("TOOL_GAINED", {
        type: "livesUp",
        amount: 1,
      });
      SceneManager.escape();
    }
  }
}
