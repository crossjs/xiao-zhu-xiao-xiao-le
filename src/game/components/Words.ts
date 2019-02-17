namespace game {
  export class Words extends yyw.Base {
    private imgGood: eui.Image;
    private imgGreat: eui.Image;
    private imgAmazing: eui.Image;
    private imgExcellent: eui.Image;
    private words: [eui.Image, eui.Image, eui.Image, eui.Image];
    private threshold: number = 2;
    private sounds: [typeof GoodSound, typeof GreatSound, typeof AmazingSound, typeof ExcellentSound];
    private index: number = -1;
    private combo: number = -1;

    constructor() {
      super();

      this.sounds = [
        GoodSound,
        GreatSound,
        AmazingSound,
        ExcellentSound,
      ];
    }

    protected destroy() {
      this.hide();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        this.words = [
          this.imgGood,
          this.imgGreat,
          this.imgAmazing,
          this.imgExcellent,
        ];

        yyw.on("GAME_DATA", ({ data: { combo }}: egret.Event) => {
          this.update(combo);
        }, this);

        this.initialized = true;
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

    // @yyw.debounce()
    private async show(index: number) {
      await this.hide();
      this.index = Math.min(3, index);
      this.sounds[this.index].play();
      this.words[this.index].visible = true;
      await yyw.zoomIn(this.main, 300, egret.Ease.elasticOut);
      egret.setTimeout(this.hide, this, 500);
    }

    private async hide() {
      await yyw.zoomOut(this.main);
      if (this.index >= 0) {
        this.words[this.index].visible = false;
        this.index = -1;
      }
    }
  }
}
