namespace game {
  function isAwesome(combo: number, level: number): boolean {
    switch (level) {
      case 1:
        return combo >= 5;
      case 2:
      case 3:
      case 4:
        return combo >= 4;
      case 5:
      case 6:
      case 7:
        return combo >= 3;
      default:
        return combo >= 2;
    }
  }

  export class Playing extends yyw.Base {
    private bgHead: eui.Rect;
    private boxAll: box.All;
    private ctrlShop: CtrlShop;
    private arena: Arena;
    private tools: Tools;
    // 单局最大连击数
    private level: number = 1;
    private combo: number = 0;
    private score: number = 0;
    private isPlaying: boolean = false;
    private snapshot: any = {};

    public async exiting() {
      // no animation
    }

    protected initialize() {
      yyw.on("RESTART", () => {
        this.startGame();
      });

      const canTool = yyw.reward.can("tool");
      // 启用道具奖励
      if (canTool) {
        // 体力过低
        yyw.on("LIVES_LEAST", () => {
          yyw.director.toScene("alarm", true);
        });
      }

      const canRevive = yyw.reward.can("revive");
      // 体力耗尽
      yyw.on("LIVES_EMPTY", () => {
        yyw.director.toScene(canRevive ? "reviving" : "ending", true);
      });

      const canCoin = yyw.reward.can("coin");

      // 启用金币奖励
      if (canCoin) {
        // 获得魔法数字
        yyw.on("MAGIC_GOT", () => {
          yyw.director.toScene("award", true, (scene: Award) => {
            scene.setType("magic");
          });
          yyw.analysis.onRunning("award", "magic");
        });

        yyw.on("GAME_DATA", ({ data: { level, combo } }) => {
          if (isAwesome(combo, level)) {
            yyw.director.toScene("award", true, (scene: Award) => {
              scene.setType("combo");
            });
            yyw.analysis.onRunning("award", "combo");
          } else {
            if (level > this.level) {
              yyw.director.toScene("award", true, (scene: Award) => {
                scene.setType("level");
              });
              yyw.analysis.onRunning("award", "level");
            }
            this.level = level;
          }
        });
      }

      const sounds = [
        GoodSound,
        GreatSound,
        AmazingSound,
        ExcellentSound,
      ];

      yyw.on("GAME_DATA", ({ data: { level, combo, score } }) => {
        if (combo > 2) {
          // 3 -> 0; 4,5 -> 1; 6,7 -> 2; 8,9,10,... -> 3
          sounds[Math.min(3, Math.floor((combo - 2) / 2))].play();
        }
        this.level = level;
        this.combo = Math.max(combo, this.combo);
        this.score = score;
      });

      yyw.on("GAME_OVER", () => {
        this.isPlaying = false;
        // 清空快照
        yyw.update({ arena: null });
        // 保存数据
        const { level, combo, score } = this;
        yyw.pbl.save({
          level,
          combo,
          score,
        });
        // 重设数据
        this.level = 1;
        this.combo = 0;
        this.score = 0;
      });
    }

    protected async destroy(): Promise<void> {
      if (this.isPlaying) {
        const { level, combo, score } = this;
        yyw.update({
          arena: {
            level, combo, score,
            ...this.arena.getSnapshot(),
            ...this.tools.getSnapshot(),
          },
        });
      }

      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      const useSnapshot = yyw.USER.arena && await yyw.showModal("继续上一次的进度？");

      await this.arena.startup(useSnapshot);
      await this.tools.startup(useSnapshot);

      this.isPlaying = true;

      if (fromChildrenCreated) {
        yyw.director.toScene(yyw.USER.guided ? "task" : "guide", true);

        this.initToolsTarget();

        if (yyw.CONFIG.shopStatus) {
          if (this.stage.stageHeight > 1334) {
            this.ctrlShop.x = 729 - this.ctrlShop.width;
          }
          this.ctrlShop.visible = true;
        }

        // 初次进入，刷新广告
        if (!await yyw.showBannerAd()) {
          // 没有广告，显示交叉营销
          this.boxAll = new box.All();
          this.boxAll.bottom = 0;
          this.addChild(this.boxAll);
        }

        // 头部背景色
        yyw.noise(this.bgHead);
      }

      yyw.analysis.addEvent("7进入场景", { s: "游戏界面" });
    }

    private startGame() {
      this.arena.startup();
      this.isPlaying = true;
    }

    @yyw.debounce()
    private async setSnapshot(data?: any) {
      if (data) {
        Object.assign(this.snapshot, data);
      } else {
        this.snapshot = null;
      }
      await yyw.update({ arena: this.snapshot });
    }

    private initToolsTarget() {
      const { x, y, width, height } = this.arena;
      const padding = 15;
      const rect = new egret.Rectangle(
        x + padding,
        // 因为 body 限制了高度 1072，且距离底部 262，所以是 1334，也就是界面的设计高度
        y + padding + this.stage.stageHeight - 1334,
        width - padding * 2,
        height - padding * 2,
      );
      this.tools.targetRect = rect;
    }
  }
}
