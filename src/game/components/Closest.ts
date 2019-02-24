namespace game {
  export class Closest extends yyw.Base {
    private bmpClosest: egret.Bitmap;

    protected async initialize(): Promise<void> {
      // 体力耗尽，会跳转到结算界面，
      // 此时界面上存在两个开放域，
      // 为避免冲突，应将 closest 移除
      yyw.on("LIVES_EMPTY", () => {
        this.removeBmp();
      });
      yyw.on("GAME_REVIVED", () => {
        egret.setTimeout(this.createBmp, this, 500);
      });
    }

    protected destroy() {
      this.removeBmp();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.on("GAME_DATA", ({ data: { score } }: egret.Event) => {
          this.update(score);
        });
      }

      this.createBmp();
    }

    /**
     * 显示分数接近的好友，通过开放数据域
     */
    @yyw.debounce()
    private update(score: number) {
      if (!this.bmpClosest) {
        return;
      }
      // 主域向子域发送自定义消息
      yyw.sub.postMessage({
        command: "openClosest",
        score,
        width: this.width,
        height: this.height,
        openid: yyw.USER.openId || 0,
      });
    }

    private createBmp() {
      if (!this.bmpClosest) {
        this.bmpClosest = yyw.sub.createDisplayObject(
          null, this.width, this.height);
        this.addChild(this.bmpClosest);
      }
    }

    private removeBmp() {
      yyw.removeElement(this.bmpClosest);
      this.bmpClosest = null;
      yyw.sub.postMessage({
        command: "closeClosest",
      });
    }
  }
}
