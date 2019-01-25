namespace game {
  export class Closest extends yyw.Base {
    private bmpClosest: egret.Bitmap;

    /**
     * 显示分数接近的好友，通过开放数据域
     */
    @yyw.debounce()
    public update(score: number) {
      // 主域向子域发送自定义消息
      yyw.sub.postMessage({
        command: "openClosest",
        score,
        width: this.width,
        height: this.height,
        openid: yyw.CURRENT_USER.openId || 0,
      });
    }

    protected destroy() {
      // yyw.removeChild(this.bmpClosest);
      // this.bmpClosest = null;
      yyw.sub.postMessage({
        command: "closeClosest",
      });
    }

    protected async createView(fromChildrenCreated?: boolean) {
      if (fromChildrenCreated) {
        this.bmpClosest = yyw.sub.createDisplayObject(
          null, this.width, this.height);
        this.addChild(this.bmpClosest);
        this.initialized = true;
      }
    }
  }
}
