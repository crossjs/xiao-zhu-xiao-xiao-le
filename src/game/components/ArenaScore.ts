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

    protected getGameData() {
      return {
        score: this.score,
        ...super.getGameData(),
      };
    }

    protected async collectCell(cell: Cell, num: number = 0) {
      await super.collectCell(cell, num);
      this.increaseScore(10);
    }

    /**
     * 更新分数
     */
    protected increaseScore(n: number) {
      this.score += n;
      this.flashScore();
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
