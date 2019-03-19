namespace game {
  export class Landing extends yyw.Base {
    private tfdVersion: eui.Label;
    private imgFavorite: eui.Image;
    private grpButtons: eui.Group;
    private tfdScore: eui.Label;
    private tfdLevel: eui.Label;
    private btnStart: eui.Button;
    private btnStart2: eui.Button;
    private pig: eui.Image;
    private numbers: eui.Image;
    private boxAll: box.All;
    private userInfoButton: wx.UserInfoButton;
    private duration: number = 500;

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

      yyw.disLight(this.bg);
      yyw.disWave(this.pig);
      yyw.removeElement(this.boxAll);
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        const { x: left, y: top, width, height } = this.grpButtons;
        this.userInfoButton = await yyw.createUserInfoButton({
          left,
          top: top + (this.stage.stageHeight - 1334),
          width,
          height,
          onTap: (authorized: boolean) => {
            yyw.analysis.addEvent(authorized ? "10确认授权" : "10取消授权");
            yyw.director.toScene("playing");
          },
        });

        // 开始游戏
        yyw.onTap(this.btnStart, async () => {
          yyw.CONFIG.mode = "score";
          await yyw.director.toScene("playing");
          yyw.emit("GAME_START");
        });

        yyw.onTap(this.btnStart2, async () => {
          if (yyw.USER.score < yyw.CONFIG.levelScore) {
            yyw.showModal(`无尽模式达到 ${yyw.CONFIG.levelScore} 分后开启`, false);
          } else {
            if (yyw.LevelSys.current("level").level > 0) {
              yyw.CONFIG.mode = "level";
              await yyw.director.toScene("playing");
              yyw.emit("GAME_START");
            } else {
              yyw.showModal("暂无可用关卡，敬请期待！", false);
            }
          }
        });

        if (!yyw.USER.sticked) {
          // 微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃）
          if (yyw.CONFIG.scene === 1104) {
            yyw.update({ sticked: true });
            yyw.award.save({ coins: 2000 });
            yyw.showToast("获得奖励：2000 金币！");
            yyw.removeElement(this.imgFavorite);
          } else {
            const { platform, statusBarHeight } = yyw.CONFIG;
            const top = platform.indexOf("android") !== -1
              && statusBarHeight < 20 ? 64 : statusBarHeight * 2;
            this.imgFavorite.y = top + 64;
            this.imgFavorite.visible = true;
          }
        }

        // const shape = new egret.Shape();
        // shape.graphics.beginFill(0x0000ff);
        // shape.graphics.drawCircle(0, 0, 50);
        // shape.graphics.endFill();
        // this.stage.addChild(shape);
        // yyw.onTap(this.tfdVersion, () => {
        //   shape.x = yyw.random(25, 726);
        //   shape.y = yyw.random(25, 1048);
        //   yyw.bezierTo(
        //     shape,
        //     {
        //       x: yyw.random(25, 726),
        //       y: yyw.random(25, 1048),
        //     },
        //     10000,
        //   );
        // });
      } else {
        yyw.analysis.addEvent("8回到主页");
      }

      yyw.light(this.bg);
      yyw.wave(this.pig);

      this.tfdScore.text = `最高分数：${yyw.USER.score || 0}`;
      this.tfdLevel.text = `最高关卡：${yyw.USER.level || 0}`;

      this.tfdVersion.text = VERSION;
      yyw.onTap(this.tfdVersion, () => {
        yyw.CONFIG.level = 1;
        yyw.USER.score = yyw.CONFIG.levelScore;
        yyw.USER.level = 0;
        this.tfdScore.text = `最高分数：${yyw.USER.score || 0}`;
        this.tfdLevel.text = `最高关卡：${yyw.USER.level || 0}`;
      });

      // 每次进入，都刷新广告
      if (!await yyw.showBannerAd()) {
        // 没有广告，显示交叉营销
        this.boxAll = new box.All();
        this.boxAll.bottom = 0;
        this.addChild(this.boxAll);
      }
    }
  }
}
