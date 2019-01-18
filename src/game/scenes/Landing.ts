namespace game {
  export class Landing extends Base {
    private btnBoard: eui.Button;
    private btnShare: eui.Button;
    private btnStart: eui.Image;
    private btnSound: eui.ToggleButton;
    private tfdVersion: eui.Label;
    private button: wx.UserInfoButton;
    private recommender: box.All;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        const { x: left, y: top, width, height } = this.btnStart;
        this.button = await yyw.createUserInfoButton({
          left,
          top,
          width,
          height,
          onTap: () => {
            SceneManager.toScene("playing");
          },
        });

        this.tfdVersion.text = VERSION;

        // 排行榜
        this.btnBoard.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            SceneManager.toScene("ranking", true);
          },
          this,
        );

        // 转发
        this.btnShare.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            yyw.share();
          },
          this,
        );

        // 开始游戏
        this.btnStart.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            SceneManager.toScene("playing");
          },
          this,
        );

        // 声音
        this.btnSound.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            const { selected } = this.btnSound;
            this.btnSound.currentState = selected ? "selected" : "up";
            yyw.setMute(!selected);
          },
          this,
        );

        this.initialized = true;
      }

      this.createRecommender();
    }

    protected destroy(): void {
      if (this.button) {
        this.button.destroy();
      }
      if (this.recommender) {
        this.recommender.destroy();
      }
    }

    private createRecommender() {
      try {
        this.recommender = new box.All();
        this.recommender.x = 0;
        this.recommender.y = this.stage.stageHeight - 208;
        this.addChild(this.recommender);
      } catch (error) {
        egret.error(error);
      }
    }
  }
}
