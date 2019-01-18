namespace game {
  export class Closest extends Base {
    private bmpClosest: egret.Bitmap;

    /**
     * 显示分数接近的好友，通过开放数据域
     */
    @yyw.debounce(100)
    public update(score: number) {
      // 主域向子域发送自定义消息
      yyw.OpenDataContext.postMessage({
        command: "openClosest",
        score,
        width: this.width,
        height: this.height,
        openid: yyw.CURRENT_USER.openId || 0,
      });
    }

    protected destroy() {
      yyw.removeFromStage(this.bmpClosest);
      this.bmpClosest = null;
      yyw.OpenDataContext.postMessage({
        command: "closeClosest",
      });
    }

    protected async createView(fromChildrenCreated?: boolean) {
      this.bmpClosest = yyw.OpenDataContext.createDisplayObject(
        null, this.width, this.height);
      this.addChild(this.bmpClosest);

      if (fromChildrenCreated) {
        this.initialized = true;
      }
    }
  }
}
