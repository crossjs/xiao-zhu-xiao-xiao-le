namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
    private btnHome: eui.Button;
    private btnCheckin: eui.Button;
    private btnSound: eui.ToggleButton;
    private btnVibration: eui.ToggleButton;
    private btnBoard: eui.Button;
    private btnTask: eui.Group;
    private btnShop: eui.Group;
    private tfdScore: eui.BitmapLabel;
    private tfdTasks: eui.BitmapLabel;
    private tfdCoins: eui.BitmapLabel;
    private boxAll: box.All;
    private tasks: number = 0;
    private coins: number = 0;
    /** 单局最大连击数 */
    private maxCombo: number = 0;
    private arena: Arena;
    private tools: Tools;
    private closest: Closest;

    public startGame() {
      this.arena.startGame();
      this.createClosest();
    }

    public async exiting() {
      // no animation
    }

    protected destroy() {
      this.setSnapshot(this.isGameOver ? null : undefined);
      this.removeClosest();
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

      this.createClosest();
      await this.arena.startGame(useSnapshot);
      await this.tools.startTool(useSnapshot);
      this.isGameOver = false;

      if (fromChildrenCreated) {
        yyw.analysis.addEvent("6开始游戏");

        if (!yyw.USER.score) {
          yyw.director.toScene("guide", true);
        }

        yyw.on("GAME_DATA", this.onGameData, this);
        yyw.on("GAME_OVER", this.onGameOver, this);

        this.initToolsTarget();

        yyw.onTap(this.btnHome, () => {
          yyw.director.toScene("landing");
        });

        // 每日签到
        yyw.onTap(this.btnCheckin, () => {
          yyw.director.toScene("checkin", true);
        });

        // 声音
        yyw.onTap(this.btnSound, () => {
          const { selected } = this.btnSound;
          this.btnSound.currentState = selected ? "selected" : "up";
          yyw.CONFIG.soundEnabled = selected;
        });
        this.btnSound.selected = true;

        const canVibrate = !/^iPhone (?:4|5|6)/i.test(yyw.CONFIG.systemInfo.model);
        if (canVibrate) {
          // 振动
          yyw.onTap(this.btnVibration, () => {
            const { selected } = this.btnVibration;
            this.btnVibration.currentState = selected ? "selected" : "up";
            yyw.CONFIG.vibrationEnabled = selected;
          });
        } else {
          this.btnVibration.currentState = "disabled";
          yyw.CONFIG.vibrationEnabled = false;
        }

        // 排行榜
        yyw.onTap(this.btnBoard, () => {
          yyw.director.toScene("ranking", true);
        });

        this.btnTask.visible = true;
        yyw.onTap(this.btnTask, () => {
          yyw.director.toScene("task", true);
        });
        yyw.on("TASK_DONE", () => {
          this.updateTasks(1);
        });

        this.updateTasks();

        if (yyw.CONFIG.shopStatus) {
          this.btnShop.visible = true;
          yyw.onTap(this.btnShop, () => {
            yyw.director.toScene("shop", true);
          });
          yyw.on("COINS_GOT", ({ data: { amount } }) => {
            this.updateCoins(amount);
          });
          yyw.on("COINS_USED", ({ data: { amount } }) => {
            this.updateCoins(-amount);
          });

          this.updateCoins();
        }

        // 初次进入，刷新广告
        if (!await yyw.showBannerAd()) {
          // 没有广告，显示交叉营销
          this.boxAll = new box.All();
          this.boxAll.bottom = 0;
          this.addChild(this.boxAll);
        }
      }
    }

    private async updateTasks(mutation?: number) {
      if (mutation) {
        this.tasks += mutation;
      } else {
        try {
          const tasks = await yyw.task.me();
          this.tasks = tasks.length;
        } catch (error) {
          egret.error(error);
        }
      }
      this.tfdTasks.text = `${this.tasks}/6`;
    }

    private async updateCoins(mutation?: number) {
      if (mutation) {
        this.coins += mutation;
      } else {
        try {
          const { coins } = await yyw.pbl.me();
          this.coins = coins;
        } catch (error) {
          egret.error(error);
        }
      }
      this.tfdCoins.text = `${this.coins}`;
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

    private createClosest() {
      this.closest = new Closest();
      this.closest.x = 15;
      this.closest.y = 132;
      this.body.addChild(this.closest);
    }

    private removeClosest() {
      yyw.removeElement(this.closest);
      this.closest = null;
    }

    private async onGameData({ data: {
      combo,
      score,
    } }: egret.Event) {
      this.maxCombo = Math.max(combo, this.maxCombo);
      const tween = yyw.getTween(this.tfdScore);
      await tween.to({ scale: 2 });
      this.tfdScore.text = yyw.zeroPadding(`${score}`, 5);
      await tween.to({ scale: 1 });
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
