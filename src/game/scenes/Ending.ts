namespace game {
  export class Ending extends yyw.Base {
    private btnOK: eui.Button;
    private btnKO: eui.Button;
    private tfdScore: eui.BitmapLabel;
    private bmpTop3: egret.Bitmap;
    private gameData: {
      level?: number,
      combo?: number,
      score?: number,
    } = {};

    constructor() {
      super();

      // 放在这里注册，确保优先级
      // 生命耗尽
      yyw.on("LIVES_EMPTY", ({ data }: egret.Event) => {
        Object.assign(this.gameData, data);
      });
    }

    protected destroy() {
      this.removeTop3();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);
      this.tfdScore.text = `${this.gameData.score}`;
      this.createTop3();

      if (fromChildrenCreated) {
        if (!yyw.CONFIG.toolReward) {
          this.btnKO.visible = false;
          this.btnOK.label = "重新开始";
        }
        yyw.onTap(this.btnOK, async () => {
          if (yyw.CONFIG.toolReward) {
            if (await yyw.preReward("tool")) {
              this.revive();
            }
          } else {
            SceneManager.escape();
            yyw.emit("GAME_OVER", this.gameData);
          }
        });

        yyw.onTap(this.btnKO, () => {
          SceneManager.escape();
          yyw.emit("GAME_OVER", this.gameData);
        });
      }
    }

    private async revive() {
      await SceneManager.escape();
      yyw.emit("TOOL_GAINED", {
        type: "livesUp",
        amount: 1,
      });
      yyw.emit("GAME_REVIVED");
    }

    private createTop3() {
      if (!this.bmpTop3) {
        const { width, height } = this.main;
        this.bmpTop3 = yyw.sub.createDisplayObject(null, width, height);
        this.main.addChild(this.bmpTop3);

        // 主域向子域发送自定义消息
        yyw.sub.postMessage({
          command: "openTop3",
          width,
          height,
        });
      }
    }

    private removeTop3() {
      yyw.removeElement(this.bmpTop3);
      this.bmpTop3 = null;
      yyw.sub.postMessage({
        command: "closeTop3",
      });
    }
  }
}
