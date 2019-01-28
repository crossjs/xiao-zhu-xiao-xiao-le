namespace game {
  export class Ranking extends yyw.Base {
    private btnFriend: eui.Button;
    private btnWorld: eui.Button;
    private bmpFriend: egret.Bitmap;
    private bmpWorld: any;

    protected destroy() {
      this.removeFriend();
      this.removeWorld();
    }

    /**
     * 准备榜单
     */
    protected createView(fromChildrenCreated?: boolean) {
      this.showFriend();

      if (fromChildrenCreated) {
        yyw.onTap(this.bg, () => {
          SceneManager.escape();
        });

        yyw.onTap(this.btnFriend, () => {
          this.removeWorld();
          this.showFriend();
        });

        yyw.onTap(this.btnWorld, () => {
          this.removeFriend();
          this.showWorld();
        });

        this.initialized = true;
      }
    }

    private showFriend() {
      const { width, height } = this.main;
      this.bmpFriend = yyw.sub.createDisplayObject(null, width, height);
      this.main.addChild(this.bmpFriend);

      // 主域向子域发送自定义消息
      yyw.sub.postMessage({
        command: "openRanking",
        width,
        height,
        openid: yyw.CURRENT_USER.openId || 0,
      });
    }

    private showWorld() {
      yyw.showToast("建设中");
    }

    private removeFriend() {
      yyw.removeChild(this.bmpFriend);
      yyw.sub.postMessage({
        command: "closeRanking",
      });
    }

    private removeWorld() {
      yyw.removeChild(this.bmpWorld);
    }
  }
}
