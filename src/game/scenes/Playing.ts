namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends yyw.Base {
    private isGameOver: boolean = false;
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
    private me: Me;
    private closest: Closest;
    private award: Award;
    private words: Words;
    private recommender: box.All;

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
      yyw.removeFromStage(this.me);
      this.me = null;
      yyw.removeFromStage(this.closest);
      this.closest = null;
      yyw.removeFromStage(this.award);
      this.award = null;
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
      this.createMe();
      this.createClosest();
      this.createRecommender();
      await this.createArena(useSnapshot);
      this.createTools();
      this.createAward();
      this.createWords();
      this.isGameOver = false;
      if (fromChildrenCreated) {
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
      this.arena.y = 318;
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
    }

    private onArenaDataChange({ data: {
      combo,
      score,
    } }: egret.Event) {
      this.words.update(combo);
      this.closest.update(score);
      this.tfdScore.text = `${score}`;
      this.maxCombo = Math.max(combo, this.maxCombo);
    }

    private onArenaLivesLow() {
      this.tools.showTip();
    }

    private onArenaMagicGot() {
      this.award.show();
    }

    private onArenaGameOver({ data: {
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
      SceneManager.toScene("failing");
    }

    private createTools() {
      this.tools = new Tools();
      this.tools.y = 318;
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

    private createMe() {
      this.me = new Me();
      this.body.addChild(this.me);
    }

    private createClosest() {
      this.closest = new Closest();
      this.closest.x = 21;
      this.closest.y = 133;
      this.body.addChild(this.closest);
    }

    private createAward() {
      this.award = new Award();
      this.award.y = 318;
      this.body.addChild(this.award);
    }

    private createWords() {
      this.words = new Words();
      this.words.y = 318;
      this.body.addChild(this.words);
    }

    private createRecommender() {
      try {
        this.recommender = new box.All();
        this.recommender.x = 0;
        this.recommender.y = this.stage.stageHeight - 208;
        this.addChild(this.recommender);
      } catch (error) {
        egret.error(error);
      }
    }
  }
}
