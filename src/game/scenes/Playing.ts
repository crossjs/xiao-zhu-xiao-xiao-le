namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
    private ctrlShop: game.CtrlShop;
    private boxAll: box.All;
    // 单局最大连击数
    private maxCombo: number = 0;
    private arena: Arena;
    private tools: Tools;

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
      }

      const sounds: Array<typeof yyw.Sound> = [
        GoodSound,
        GreatSound,
        AmazingSound,
        ExcellentSound,
      ];

      const threshold = 2;
      let lastLevel = 1;

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

      yyw.on("GAME_DATA", ({ data: { level, combo } }) => {
        if (level > lastLevel) {
          yyw.director.toScene("award", true, (scene: Award) => {
            scene.setType("level");
          });
          yyw.analysis.onRunning("award", "level");
        }
        lastLevel = level;

        if (combo > threshold) {
          // 3 -> 0
          // 4,5 -> 1
          // 6,7 -> 2
          // 8,9,10,... -> 3
          sounds[Math.min(3, Math.floor((combo - threshold) / threshold))].play();
        }

        // score -> level
        // 0-1999 -> 1
        // 2000-3999 -> 2
        // 4000-5999 -> 3
        // 6000-7999 -> 4
        // 8000-9999 -> 5
        // 10000-11999 -> 6
        // 12000-13999 -> 7
        // 14000-15999 -> 8
        // ...
        // 启用金币奖励
        if (canCoin && isAwesome(combo, level)) {
          yyw.director.toScene("award", true, (scene: Award) => {
            scene.setType("combo");
          });
          yyw.analysis.onRunning("award", "combo");
        }
      });

      yyw.on("GAME_OVER", () => {
        lastLevel = 1;
      });
    }

    protected destroy() {
      this.setSnapshot(this.isGameOver ? null : undefined);
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      let snapshot: any;
      let useSnapshot: boolean;
      if (!this.isGameOver) {
        snapshot = await this.getSnapshot();
        if (snapshot) {
          useSnapshot = await yyw.showModal("继续上一次的进度？");
        }
      }

      await this.arena.startGame(useSnapshot);
      await this.tools.startTool(useSnapshot);
      this.isGameOver = false;

      if (fromChildrenCreated) {
        yyw.director.toScene(yyw.USER.score ? "task" : "guide", true);

        yyw.on("GAME_OVER", this.onGameOver, this);
        yyw.on("GAME_DATA", this.onGameData, this);

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
      }

      yyw.analysis.addEvent("7进入场景", { s: "游戏界面" });
    }

    private startGame() {
      this.arena.startGame();
    }

    private async getSnapshot() {
      return yyw.storage.get(SNAPSHOT_KEY);
    }

    private setSnapshot(value?: any) {
      if (value === null) {
        yyw.storage.set(SNAPSHOT_KEY, null);
      } else {
        const { maxCombo } = this;
        yyw.storage.set(SNAPSHOT_KEY, {
          maxCombo,
        });
      }
    }

    private async onGameData({ data: {
      combo,
    } }: egret.Event) {
      this.maxCombo = Math.max(combo, this.maxCombo);
    }

    private onGameOver({ data: {
      level,
      combo,
      score,
    } }: egret.Event) {
      this.isGameOver = true;
      this.setSnapshot(null);
      yyw.pbl.save({
        score,
        level,
        combo: Math.max(combo, this.maxCombo),
      });
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
