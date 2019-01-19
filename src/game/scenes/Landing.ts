namespace game {
  export class Landing extends yyw.Base {
    private btnBoard: eui.Button;
    private btnShare: eui.Button;
    private btnStart: eui.Button;
    private btnSound: eui.ToggleButton;
    private btnVibration: eui.ToggleButton;
    private tfdVersion: eui.Label;
    private userInfoButton: wx.UserInfoButton;
    private recommender: box.All;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        const { x: left, y: top, width, height } = this.btnStart;
        // TODO 封装成 Component
        this.userInfoButton = await yyw.createUserInfoButton({
          left,
          top,
          width,
          height,
          onTap: () => {
            yyw.vibrateLong();
            SceneManager.toScene("playing");
          },
        });

        this.tfdVersion.text = VERSION;

        // 排行榜
        this.btnBoard.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            yyw.vibrateShort();
            SceneManager.toScene("ranking", true);
          },
          this,
        );

        // 转发
        this.btnShare.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            yyw.vibrateShort();
            yyw.share();
          },
          this,
        );

        // 开始游戏
        this.btnStart.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            yyw.vibrateLong();
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
            yyw.USER_CONFIG.soundEnabled = selected;
          },
          this,
        );

        // 振动
        this.btnVibration.addEventListener(
          egret.TouchEvent.TOUCH_TAP,
          () => {
            const { selected } = this.btnVibration;
            this.btnVibration.currentState = selected ? "selected" : "up";
            yyw.USER_CONFIG.vibrationEnabled = selected;
          },
          this,
        );

        this.initialized = true;
      }

      this.createRecommender();
    }

    protected destroy(): void {
      if (this.userInfoButton) {
        this.userInfoButton.destroy();
      }
      yyw.removeFromStage(this.recommender);
      this.recommender = null;
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
