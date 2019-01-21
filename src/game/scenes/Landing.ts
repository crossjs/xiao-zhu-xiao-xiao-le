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
            SceneManager.toScene("playing");
          },
        });

        this.tfdVersion.text = VERSION;

        // 排行榜
        yyw.onTap(this.btnBoard, () => {
          SceneManager.toScene("ranking", true);
        });

        // 转发
        yyw.onTap(this.btnShare, () => {
          yyw.share();
        });

        // 开始游戏
        yyw.onTap(this.btnStart, () => {
          SceneManager.toScene("playing");
        });

        // 声音
        yyw.onTap(this.btnSound, () => {
          const { selected } = this.btnSound;
          this.btnSound.currentState = selected ? "selected" : "up";
          yyw.CONFIG.soundEnabled = selected;
        });

        // 振动
        yyw.onTap(this.btnVibration, () => {
          const { selected } = this.btnVibration;
          this.btnVibration.currentState = selected ? "selected" : "up";
          yyw.CONFIG.vibrationEnabled = selected;
        });

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
