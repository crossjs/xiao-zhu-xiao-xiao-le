namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
    private btnShop: eui.Image;
    private tfdScore: eui.BitmapLabel;
    private tfdCoins: eui.BitmapLabel;
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
        if (!yyw.USER.score) {
          yyw.director.toScene("guide", true);
        }

        yyw.on("GAME_DATA", this.onGameData, this);
        yyw.on("GAME_OVER", this.onGameOver, this);

        this.initToolsTarget();

        if (yyw.CONFIG.shopStatus) {
          this.btnShop.visible = true;
          yyw.onTap(this.btnShop, () => {
            yyw.director.toScene("shop", true);
          });
          yyw.on("COINS_CHANGE", ({ data: coins }) => {
            this.updateCoins(coins);
          });

          this.updateCoins();
        }
      }
    }

    private async updateCoins(mutation?: number) {
      try {
        if (mutation) {
          this.coins += mutation;
        } else {
          const { coins } = await yyw.pbl.get();
          this.coins = coins;
        }
        this.tfdCoins.text = `${this.coins}`;
      } catch (error) {
        egret.error(error);
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
      this.closest.x = 21;
      this.closest.y = 120;
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
      await tween.to({ scale: 1.5 });
      this.tfdScore.text = `${score}`;
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
      const padding = 21;
      const rect = new egret.Rectangle(
        x + padding,
        y + padding,
        width - padding * 2,
        height - padding * 2,
      );
      this.tools.targetRect = rect;
    }
  }
}
