namespace game {
  export class Landing extends yyw.Base {
    private btnBoard: eui.Button;
    private btnStart: eui.Button;
    private tfdVersion: eui.Label;
    private tfdBestScore: eui.Label;
    private title: eui.Image;
    private pig: eui.Image;
    private numbers: eui.Image;
    private userInfoButton: wx.UserInfoButton;
    private recommender: box.All;
    private duration: number = 500;

    public async exiting() {
      yyw.getTween(this.title).to({
        x: this.title.x + 30,
      }, this.duration);
      yyw.getTween(this.pig).to({
        x: this.pig.x + 60,
        y: this.pig.y + 30,
      }, this.duration);
      yyw.getTween(this.numbers).to({
        x: this.numbers.x - 60,
        y: this.numbers.y - 30,
      }, this.duration);
      await yyw.fadeOut(this);
    }

    public async entering() {
      yyw.getTween(this.title).to({
        x: this.title.x - 30,
      }, this.duration);
      yyw.getTween(this.pig).to({
        x: this.pig.x - 60,
        y: this.pig.y - 30,
      }, this.duration);
      yyw.getTween(this.numbers).to({
        x: this.numbers.x + 60,
        y: this.numbers.y + 30,
      }, this.duration);
      await yyw.fadeIn(this);
    }

    protected destroy(): void {
      if (this.userInfoButton) {
        this.userInfoButton.destroy();
      }
      yyw.removeChild(this.recommender);
      this.recommender = null;
    }

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

        // 开始游戏
        yyw.onTap(this.btnStart, () => {
          SceneManager.toScene("playing");
        });

        this.initialized = true;
      }

      // 初始化全局配置
      const { score = 0 } = await yyw.getPbl();
      this.tfdBestScore.text = `历史最佳分数： ${score}`;

      this.createRecommender();
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
