namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
    private main: eui.Group;
    private btnShop: eui.Image;
    private tfdScore: eui.BitmapLabel;
    // private b1: eui.Image;
    // private b2: eui.Image;
    // private b3: eui.Image;
    // private b4: eui.Image;
    // private b5: eui.Image;
    /** 单局最大连击数 */
    private maxCombo: number = 0;
    private arena: Arena;
    private tools: Tools;
    // private me: Me;
    private closest: Closest;
    private recommender: box.All;

    public restart() {
      this.arena.restart();
    }

    protected destroy() {
      this.setSnapshot(this.isGameOver ? null : undefined);
      yyw.off("ARENA_STATE_CHANGE", this.onArenaStateChange, this);
      yyw.off("ARENA_DATA_CHANGE", this.onArenaDataChange, this);
      yyw.off("GAME_OVER", this.onGameOver, this);
      yyw.removeChild(this.arena);
      this.arena = null;
      yyw.removeChild(this.closest);
      this.closest = null;
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
      await this.createArena(useSnapshot);
      this.isGameOver = false;
      if (fromChildrenCreated) {
        this.initRecommender();
        this.initToolsRect();
        if (!!yyw.CURRENT_USER.score) {
          SceneManager.toScene("guide", true);
        }
        yyw.onTap(this.btnShop, () => {
          SceneManager.toScene("shop", true);
        });
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

    private async createArena(useSnapshot?: boolean): Promise<void> {
      this.arena = useSnapshot ? await Arena.fromSnapshot() : new Arena();
      this.arena.y = 318;
      yyw.on("ARENA_STATE_CHANGE", this.onArenaStateChange, this);
      yyw.on("ARENA_DATA_CHANGE", this.onArenaDataChange, this);
      yyw.on("GAME_OVER", this.onGameOver, this);
      this.main.addChild(this.arena);
    }

    private onArenaStateChange({ data: {
      running,
    } }: egret.Event) {
      this.tools.enabled = !running;
    }

    private onArenaDataChange({ data: {
      combo,
      score,
    } }: egret.Event) {
      this.closest.update(score);
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

    private initToolsRect() {
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
