namespace game {
  export class Ending extends yyw.Base {
    private board: eui.Group;
    private tfdTip: eui.Label;
    private btnOK: eui.Button;
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

      if (fromChildrenCreated) {
        if (!yyw.reward.can("tool")) {
          this.btnEscape.visible = false;
          this.btnOK.iconDisplay.source = "sprites_json.zlyc";
        }

        const canTool = yyw.reward.can("tool");
        if (canTool) {
          const canVideo = yyw.reward.can("tool", "video");
          this.tfdTip.text = `${ canVideo ? "观看视频" : "转发到群" }获得复活机会`;
        }
        yyw.onTap(this.btnOK, async () => {
          if (canTool) {
            if (await yyw.reward.apply("tool")) {
              this.revive();
            }
          } else {
            yyw.director.escape();
            yyw.emit("GAME_OVER", this.gameData);
          }
        });

        yyw.onTap(this.btnEscape, () => {
          yyw.emit("GAME_OVER", this.gameData);
        });
      }

      this.tfdScore.text = `本局得分：${this.gameData.score}`;
      this.createTop3();
    }

    private async revive() {
      await yyw.director.escape();
      yyw.emit("TOOL_GOT", {
        type: "livesUp",
        amount: 1,
      });
      yyw.emit("GAME_REVIVED");
    }

    private createTop3() {
      if (!this.bmpTop3) {
        const { width, height } = this.board;
        this.bmpTop3 = yyw.sub.createDisplayObject(null, width, height);
        this.board.addChild(this.bmpTop3);

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
