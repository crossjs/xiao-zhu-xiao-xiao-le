namespace game {
  export class Pass extends yyw.Base {
    private board: eui.Group;
    private tfdRes: eui.Label;
    private tfdTip: eui.Label;
    private btnOK: eui.Button;
    private bmpNeighbor: egret.Bitmap;
    private duration: number = 0;

    protected initialize() {
      yyw.on("SNAPSHOT", ({ data: { duration } }) => {
        this.duration = duration;
      });
    }

    protected destroy() {
      this.removeNeighbor();
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      const { level } = yyw.Levels.current();

      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, () => {
          yyw.share({
            title: `我通过了关卡 ${level}，用时 ${(this.duration / 1000) | 0} 秒`,
            ald_desc: "pass",
          });
        });

        yyw.onTap(this.btnEscape, () => {
          if (yyw.Levels.current().level > 0) {
            yyw.emit("GAME_START");
          } else {
            yyw.showModal("暂无可用关卡，敬请期待！", false);
          }
        });
      }

      this.tfdRes.text = `关卡 ${level}，用时 ${(this.duration / 1000) | 0} 秒`;
      this.tfdTip.text = `打败了全国 ${yyw.random(8000, 10000) / 100}% 的用户`;

      this.createNeighbor(level);

      // 保存数据
      yyw.pbl.save({
        level,
        duration: this.duration,
      });

      yyw.CONFIG.level++;

      this.btnEscape.visible = false;
      await yyw.sleep();
      this.btnEscape.visible = true;
    }

    private createNeighbor(level: number) {
      if (!this.bmpNeighbor) {
        const { width, height } = this.board;
        this.bmpNeighbor = yyw.sub.createDisplayObject(null, width, height);
        this.board.addChild(this.bmpNeighbor);

        // 主域向子域发送自定义消息
        yyw.sub.postMessage({
          command: "openNeighbor",
          width,
          height,
          openid: yyw.USER.openid || 0,
          nickName: yyw.USER.nickName,
          avatarUrl: yyw.USER.avatarUrl,
          mode: yyw.CONFIG.mode,
          level,
          score: this.duration,
        });
      }
    }

    private removeNeighbor() {
      yyw.removeElement(this.bmpNeighbor);
      this.bmpNeighbor = null;
      yyw.sub.postMessage({
        command: "closeNeighbor",
      });
    }
  }
}
