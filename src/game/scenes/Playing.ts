namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
    private btnBack: eui.Button;
    private btnPbl: eui.Button;
    private tfdLevel: eui.BitmapLabel;
    private tfdCombo: eui.BitmapLabel;
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
    private closest: Closest;
    private redpack: Redpack;
    private words: Words;
    private recommender: box.One;

    protected destroy() {
      this.setSnapshot(this.isGameOver ? null : undefined);
      this.arena.removeEventListener("STATE_CHANGE", this.onArenaStateChange, this);
      this.arena.removeEventListener("DATA_CHANGE", this.onArenaDataChange, this);
      this.arena.removeEventListener("LIVES_LOW", this.onArenaLivesLow, this);
      this.arena.removeEventListener("MAGIC_GOT", this.onArenaMagicGot, this);
      this.arena.removeEventListener("GAME_OVER", this.onArenaGameOver, this);
      yyw.removeFromStage(this.arena);
      this.arena = null;
      this.tools.removeEventListener("TOOL_USED", this.onToolUsed, this);
      yyw.removeFromStage(this.tools);
      this.tools = null;
      yyw.removeFromStage(this.closest);
      this.closest = null;
      yyw.removeFromStage(this.redpack);
      this.redpack = null;
      yyw.removeFromStage(this.words);
      this.words = null;
      yyw.removeFromStage(this.recommender);
      this.recommender = null;
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
      this.createRecommender();
      await this.createArena(useSnapshot);
      this.createTools();
      this.createRedpack();
      this.createWords();
      this.isGameOver = false;
      if (fromChildrenCreated) {
        this.initTouchHandlers();
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

    private async createArena(useSnapshot?: boolean): Promise<void> {
      this.arena = useSnapshot ? await Arena.fromSnapshot() : new Arena();
      this.arena.y = 264;
      // 更新 score/level/combo 显示
      this.arena.addEventListener("STATE_CHANGE", this.onArenaStateChange, this);
      this.arena.addEventListener("DATA_CHANGE", this.onArenaDataChange, this);
      this.arena.addEventListener("LIVES_LOW", this.onArenaLivesLow, this);
      this.arena.addEventListener("MAGIC_GOT", this.onArenaMagicGot, this);
      this.arena.addEventListener("GAME_OVER", this.onArenaGameOver, this);
      this.body.addChild(this.arena);
    }

    private onArenaStateChange({ data: {
      running,
    } }: egret.Event) {
      this.tools.enabled = !running;
      this.btnBack.enabled = !running;
      this.btnPbl.enabled = !running;
    }

    private onArenaDataChange({ data: {
      level,
      combo,
      score,
    } }: egret.Event) {
      this.words.update(combo);
      this.closest.update(score);
      this.tfdLevel.text = `${level}`;
      this.tfdCombo.text = `${combo}`;
      this.tfdScore.text = `${score}`;
      this.maxCombo = Math.max(this.maxCombo, combo);
    }

    private onArenaLivesLow() {
      this.tools.showTip();
    }

    private onArenaMagicGot() {
      this.redpack.show();
    }

    private onArenaGameOver({ data: {
      level,
      combo,
      score,
    } }: egret.Event) {
      this.isGameOver = true;
      this.setSnapshot(null);
      yyw.saveData({
        score,
        level,
        combo: Math.max(combo, this.maxCombo),
      });
      SceneManager.toScene("failing");
    }

    private createTools() {
      this.tools = new Tools();
      this.tools.y = 142;
      this.tools.addEventListener("TOOL_USED", this.onToolUsed, this);
      this.body.addChild(this.tools);
    }

    private onToolUsed({ data: {
      type,
    } }: egret.Event) {
      switch (type) {
        case "shuffle":
          return this.arena.shuffle();
        case "livesUp":
          return this.arena.livesUp();
        default:
          return;
      }
    }

    private createClosest() {
      this.closest = new Closest();
      this.closest.x = 21;
      this.closest.y = -12;
      this.body.addChild(this.closest);
    }

    private createRedpack() {
      this.redpack = new Redpack();
      this.body.addChild(this.redpack);
    }

    private createWords() {
      this.words = new Words();
      this.body.addChild(this.words);
    }

    private initTouchHandlers() {
      yyw.onTap(this.btnBack, () => {
        if (this.arena.isRunning) {
          return;
        }
        SceneManager.toScene("landing");
      });

      yyw.onTap(this.btnPbl, () => {
        if (this.arena.isRunning) {
          return;
        }
        SceneManager.toScene("pbl", true);
      }, this);
    }

    private createRecommender() {
      this.recommender = new box.One();
      this.recommender.x = 375;
      this.recommender.y = 30;
      this.body.addChild(this.recommender);
    }
  }
}
