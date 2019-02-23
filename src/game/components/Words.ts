namespace game {
  export class Words extends yyw.Base {
    private imgWords: eui.Image;
    private combo: number = -1;
    private threshold: number = 2;
    private words: string[] = ["good", "great", "amazing", "excellent"];
    private sounds: Array<typeof yyw.Sound> = [
      GoodSound,
      GreatSound,
      AmazingSound,
      ExcellentSound,
    ];

    protected destroy() {
      this.hide();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.on("GAME_DATA", ({ data: { combo }}: egret.Event) => {
          this.update(combo);
        }, this);
      }
    }

    private update(combo: number) {
      if (combo === this.combo) {
        return;
      }
      if (combo > this.threshold) {
        // 3 -> 0
        // 4,5 -> 1
        // 6,7 -> 2
        // 8,9,10,... -> 3
        this.show(
          Math.floor((combo - this.threshold) / this.threshold),
        );
      }
      this.combo = combo;
    }

    private async show(index: number) {
      await this.hide();
      index = Math.min(3, index);
      this.sounds[index].play();
      this.imgWords.source = `sprites2_json.${this.words[index]}`;
      await yyw.zoomIn(this.main, 300, egret.Ease.elasticOut);
      egret.setTimeout(this.hide, this, 500);
    }

    private async hide() {
      await yyw.zoomOut(this.main);
    }
  }
}
