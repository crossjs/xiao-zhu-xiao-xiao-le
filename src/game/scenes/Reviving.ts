namespace game {
  export class Reviving extends yyw.Base {
    private board: eui.Group;
    private tfdTip: eui.Label;
    private btnOK: eui.Button;
    private tfdScore: eui.BitmapLabel;
    private bmpTop3: egret.Bitmap;
    private score: number = 0;

    protected async initialize(): Promise<void> {
      // 放在这里注册，确保优先级
      yyw.on("GAME_DATA", ({ data: { score } }: egret.Event) => {
        this.score = score;
      });
    }

    protected destroy() {
      this.removeTop3();
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        const canVideo = yyw.reward.can("revive", "video");
        this.tfdTip.text = `${ canVideo ? "观看视频" : "转发到群" }获得复活机会`;

        yyw.onTap(this.btnOK, async () => {
          const type = await yyw.reward.apply("revive");
          if (type) {
            HealSound.play();
            await yyw.director.escape();
            yyw.emit("TOOL_GOT", {
              type: "livesUp",
              amount: 1,
            });
            yyw.analysis.onRunning("revive", type);
          } else {
            yyw.showToast("复活失败");
          }
        });

        yyw.onTap(this.btnEscape, async () => {
          await yyw.director.escape();
          yyw.director.toScene("ending", true);
        });
      }

      this.tfdScore.text = `本局得分：${this.score}`;
      this.createTop3();

      this.btnEscape.visible = false;
      await yyw.sleep();
      this.btnEscape.visible = true;
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
