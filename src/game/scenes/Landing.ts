namespace game {
  export class Landing extends yyw.Base {
    private tfdVersion: eui.Label;
    private tfdBestScore: eui.Label;
    private btnStart: eui.Button;
    private btnSound: eui.ToggleButton;
    private btnVibration: eui.ToggleButton;
    private btnBoard: eui.Button;
    private btnCheckin: eui.Button;
    private favorite: eui.Image;
    private pig: eui.Image;
    private numbers: eui.Image;
    private boxAll: box.All;
    private userInfoButton: wx.UserInfoButton;
    private duration: number = 500;
    private offLight: () => void;
    private offWave: () => void;

    public async exiting() {
      yyw.getTween(this.pig).to(
        {
          x: this.pig.x + 90,
          y: this.pig.y + 60,
        },
        this.duration,
      );
      yyw.getTween(this.numbers).to(
        {
          x: this.numbers.x - 60,
          y: this.numbers.y - 30,
        },
        this.duration,
      );
      await yyw.fadeOut(this);
    }

    public async entering() {
      yyw.getTween(this.pig).to(
        {
          x: this.pig.x - 90,
          y: this.pig.y - 60,
        },
        this.duration,
      );
      yyw.getTween(this.numbers).to(
        {
          x: this.numbers.x + 60,
          y: this.numbers.y + 30,
        },
        this.duration,
      );
      await yyw.fadeIn(this);
    }

    protected destroy(): void {
      if (this.userInfoButton) {
        this.userInfoButton.destroy();
      }
      if (this.offLight) {
        this.offLight();
      }
      if (this.offWave) {
        this.offWave();
      }
      yyw.removeElement(this.boxAll);
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        const { x: left, y: top, width, height } = this.btnStart;
        this.userInfoButton = await yyw.createUserInfoButton({
          left,
          top: this.stage.stageHeight - 1334 + top,
          width,
          height,
          onTap: (authorized: boolean) => {
            yyw.analysis.addEvent(authorized ? "5确认授权" : "5取消授权");
            yyw.director.toScene("playing");
          },
        });

        this.tfdVersion.text = VERSION;

        // 开始游戏
        yyw.onTap(this.btnStart, () => {
          yyw.director.toScene("playing");
        });

        const STICKY_KEY = "STICKY_ENTRY";
        if (!(await yyw.db.get(STICKY_KEY))) {
          // 微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃）
          if (yyw.CONFIG.launchOptions.scene === 1104) {
            yyw.db.set(STICKY_KEY, true);
            yyw.award.save({ coins: 2000 });
            yyw.showToast("获得奖励：2000 金币！");
          } else {
            this.favorite.visible = true;
          }
        }
      }

      this.offLight = yyw.light(this.bg);
      this.offWave = yyw.wave(this.pig);

      // 初始化全局配置
      const { score = 0 } = await yyw.pbl.me();
      this.tfdBestScore.text = `历史最高分数：${score}`;

      // 每次进入，都刷新广告
      if (!await yyw.showBannerAd()) {
        // 没有广告，显示交叉营销
        this.boxAll = new box.All();
        this.boxAll.bottom = 0;
        this.addChild(this.boxAll);
      }

      yyw.analysis.addEvent("7进入场景", { s: "主界面" });
    }
  }
}
