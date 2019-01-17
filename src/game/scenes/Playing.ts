namespace game {
  const SNAPSHOT_KEY = "YYW_G4_PLAYING";

  export class Playing extends Base {
    private isGameOver: boolean = false;
    private btnAdd: eui.Image;
    private btnShuffle: eui.Image;
    private btnBack: eui.Image;
    private btnPbl: eui.Image;
    private tfdLevel: eui.BitmapLabel;
    private tfdCombo: eui.BitmapLabel;
    private tfdScore: eui.BitmapLabel;
    // private b1: eui.Image;
    // private b2: eui.Image;
    // private b3: eui.Image;
    // private b4: eui.Image;
    // private b5: eui.Image;
    /** 可用的剩余步数 */
    /** 连击数 */
    private maxCombo: number = 0;
    // TODO MOVE TO WORDS
    private wordsThreshold: number = 2;
    private arena: Arena;
    private closest: Closest;
    private redpack: Redpack;
    private words: Words;
    private recommender: box.One;

    protected destroy() {
      this.setSnapshot();
      yyw.removeFromStage(this.arena);
      this.arena.removeEventListener("change", this.onArenaChange, this);
      this.arena.removeEventListener("MAGIC_GOT", this.onArenaMagicGot, this);
      this.arena.removeEventListener("GAME_OVER", this.onArenaGameOver, this);
      this.arena = null;
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
      this.arena.addEventListener("change", this.onArenaChange, this);
      this.arena.addEventListener("MAGIC_GOT", this.onArenaMagicGot, this);
      this.arena.addEventListener("GAME_OVER", this.onArenaGameOver, this);
      this.body.addChild(this.arena);
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

    private onArenaChange({ data: {
      level,
      combo,
      score,
    } }: egret.Event) {
      this.tfdLevel.text = `${level}`;
      this.tfdCombo.text = `${combo}`;
      this.tfdScore.text = `${score}`;

      if (combo >= this.wordsThreshold) {
        // 2,3 -> 0
        // 4,5 -> 1
        // 6,7 -> 2
        // 8,9,10,... -> 3
        this.words.showWord(
          Math.floor((combo - this.wordsThreshold) / this.wordsThreshold),
        );
      }

      this.maxCombo = Math.max(this.maxCombo, combo);

      this.closest.update(score);
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
      this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (this.isGameOver || this.arena.isRunning) {
          return;
        }
        this.arena.livesUp();
      }, this);

      this.btnShuffle.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
        if (this.isGameOver || this.arena.isRunning) {
          return;
        }
        this.arena.shuffle();
      }, this);

      this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (this.arena.isRunning) {
          return;
        }
        SceneManager.toScene("landing");
      }, this);

      this.btnPbl.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
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
