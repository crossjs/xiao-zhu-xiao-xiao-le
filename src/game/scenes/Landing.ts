namespace game {
  export class Landing extends yyw.Base {
    private btnCheckin: eui.Button;
    private btnBoard: eui.Button;
    private btnStart: eui.Button;
    private tfdVersion: eui.Label;
    private tfdBestScore: eui.Label;
    private title: eui.Image;
    private pig: eui.Image;
    private numbers: eui.Image;
    private userInfoButton: wx.UserInfoButton;
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
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        // const { width, height } = this.btnStart;
        // const { x: left, y: top } = this.btnStart.localToGlobal();
        // TODO 封装成 Component
        this.userInfoButton = await yyw.createUserInfoButton({
          left: 159,
          top: this.stage.stageHeight - 478,
          width: 432,
          height: 144,
          onTap: () => {
            SceneManager.toScene("playing");
          },
        });

        this.tfdVersion.text = VERSION;

        // 每日签到
        yyw.onTap(this.btnCheckin, () => {
          SceneManager.toScene("checkin", true);
        });

        // 排行榜
        yyw.onTap(this.btnBoard, () => {
          SceneManager.toScene("ranking", true);
        });

        // 开始游戏
        yyw.onTap(this.btnStart, () => {
          SceneManager.toScene("playing");
        });
      }

      // 初始化全局配置
      const { score = 0 } = await yyw.pbl.get();
      this.tfdBestScore.text = `历史最高分数： ${score}`;
    }
  }
}
