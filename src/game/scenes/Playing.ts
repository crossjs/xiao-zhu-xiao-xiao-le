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
      yyw.removeFromStage(this.closest);
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
        this.initTools();
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
      yyw.setZIndex(this.award);
      this.tools.showModal();
    }

    private onArenaMagicGot() {
      yyw.setZIndex(this.award);
      this.award.showModal();
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

    private initTools() {
      const { x, y, width, height } = this.arena;
      const padding = 21;
      const rect = new egret.Rectangle(
        x + padding,
        y + padding,
        width - padding * 2,
        height - padding * 2,
      );
      this.tools.targetRect = rect;
      this.tools.addEventListener("TOOL_USING", this.onToolUsing, this);
    }

    private onToolUsing({ data: {
      type,
      targetX,
      targetY,
      confirm,
      cancel,
    } }: egret.Event) {
      switch (type) {
        case "valueUp":
          if (cancel) {
            return this.arena.preValueUp(targetX, targetY, cancel);
          }
          return this.arena.doValueUp(targetX, targetY, confirm);
        case "shuffle":
          return this.arena.doShuffle(confirm);
        case "breaker":
          if (cancel) {
            return this.arena.preBreaker(targetX, targetY, cancel);
          }
          return this.arena.doBreaker(targetX, targetY, confirm);
        case "livesUp":
          if (this.arena.isLivesFull) {
            return yyw.showToast("生命力已满，无须使用此道具");
          }
          return this.arena.doLivesUp(confirm);
        default:
          return;
      }
    }

    private initRecommender() {
      this.recommender.y = this.stage.stageHeight - 208;
    }
  }
}
