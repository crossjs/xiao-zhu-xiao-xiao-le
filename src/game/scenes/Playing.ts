namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
    private ctrlShop: game.CtrlShop;
    private ctrlGroup3: game.CtrlGroup3;
    private boxAll: box.All;
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

        if (this.stage.stageHeight <= 1334) {
          this.ctrlGroup3.y = 108;
          this.ctrlGroup3.scale = 0.75;
        }
        this.ctrlGroup3.visible = true;

        if (yyw.CONFIG.shopStatus) {
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
