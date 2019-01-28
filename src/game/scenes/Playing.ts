namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
    private btnShop: eui.Image;
    private tfdScore: eui.BitmapLabel;
    /** 单局最大连击数 */
    private maxCombo: number = 0;
    private arena: Arena;
    private tools: Tools;
    private closest: Closest;
    private recommender: box.All;

    public startGame() {
      this.arena.startGame();
      this.createClosest();
    }

    public async exiting() {
      // empty
    }

    protected destroy() {
      this.setSnapshot(this.isGameOver ? null : undefined);
      this.removeClosest();
      // yyw.removeChild(this.recommender);
      // this.recommender = null;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      let snapshot: any;
      let useSnapshot: boolean;
      if (!this.isGameOver) {
        snapshot = await this.getSnapshot();
        if (snapshot) {
          useSnapshot = await yyw.showModal("接着玩？");
        }
      }
      this.createClosest();
      await this.arena.startGame(useSnapshot);
      await this.tools.startTool(useSnapshot);
      this.isGameOver = false;
      if (fromChildrenCreated) {
        this.initRecommender();
        this.initToolsTarget();

        // TODO 引导
        if (!!yyw.CURRENT_USER.score) {
          SceneManager.toScene("guide", true);
        }

        if (yyw.CONFIG.shopStatus) {
          this.btnShop.visible = true;
          yyw.onTap(this.btnShop, () => {
            SceneManager.toScene("shop", true);
          });
        }

        yyw.on("GAME_DATA", this.onGameData, this);
        yyw.on("GAME_OVER", this.onGameOver, this);

        this.initialized = true;
      }
    }

    private async getSnapshot() {
      return yyw.getStorage(SNAPSHOT_KEY);
    }

    private setSnapshot(value?: any) {
      if (value === null) {
        yyw.setStorage(SNAPSHOT_KEY, null);
      } else {
        const { maxCombo } = this;
        yyw.setStorage(SNAPSHOT_KEY, {
          maxCombo,
        });
      }
    }

    private createClosest() {
      this.closest = new Closest();
      this.closest.x = 21;
      this.closest.y = 133;
      this.body.addChild(this.closest);
    }

    private removeClosest() {
      yyw.removeChild(this.closest);
      this.closest = null;
    }

    private onGameData({ data: {
      combo,
      score,
    } }: egret.Event) {
      this.tfdScore.text = `${score}`;
      this.maxCombo = Math.max(combo, this.maxCombo);
    }

    private onGameOver({ data: {
      level,
      combo,
      score,
    } }: egret.Event) {
      this.isGameOver = true;
      this.setSnapshot(null);
      yyw.savePbl({
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

    private initRecommender() {
      this.recommender.y = this.stage.stageHeight - 208;
    }
  }
}
