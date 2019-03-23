namespace game {
  export class ArenaScore extends ArenaBase {
    protected mode: string = "score";
    protected tfdScore: eui.BitmapLabel;
    /** 得分 */
    protected score: number = 0;

    public getSnapshot() {
      return {
        score: this.score,
        ...super.getSnapshot(),
      };
    }

    protected ensureData(useSnapshot: boolean) {
      super.ensureData(useSnapshot);
      this.score = (useSnapshot && yyw.USER.arena.score.score) || 0;
      this.increaseScore(0);
    }

    protected async collectCell(cell: Cell, num: number = 0) {
      await super.collectCell(cell, num);
      this.increaseScore(10);
    }

    /**
     * 更新分数
     */
    protected async increaseScore(n: number) {
      this.score += n;
      await this.flashScore();
      // 每 1000 分更新
      if (this.score - yyw.USER.score > 1000) {
        yyw.showToast("得分破了记录！");
        await yyw.pbl.save({
          score: this.score,
        });
      }
    }

    @yyw.debounce()
    private async flashScore() {
      const tween = yyw.getTween(this.tfdScore);
      await tween.to({ scale: 1.5 });
      this.tfdScore.text = yyw.zeroPadding(`${this.score}`, 5);
      await tween.to({ scale: 1 });
    }
  }
}
