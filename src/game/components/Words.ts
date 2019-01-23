namespace game {
  export class Words extends yyw.Base {
    private main: eui.Group;
    private imgGood: eui.Image;
    private imgGreat: eui.Image;
    private imgAmazing: eui.Image;
    private imgExcellent: eui.Image;
    private words: [eui.Image, eui.Image, eui.Image, eui.Image];
    private threshold: number = 2;
    private sounds: [GoodSound, GreatSound, AmazingSound, ExcellentSound];
    private index: number = -1;

    constructor() {
      super();

      this.sounds = [
        new GoodSound(),
        new GreatSound(),
        new AmazingSound(),
        new ExcellentSound(),
      ];
    }

    public update(combo: number) {
      if (combo > this.threshold) {
        // 3 -> 0
        // 4,5 -> 1
        // 6,7 -> 2
        // 8,9,10,... -> 3
        this.show(
          Math.floor((combo - this.threshold) / this.threshold),
        );
      }
    }

    protected destroy() {
      this.hide();
    }

    protected async createView(fromChildrenCreated?: boolean) {
      if (fromChildrenCreated) {
        this.words = [
          this.imgGood,
          this.imgGreat,
          this.imgAmazing,
          this.imgExcellent,
        ];
        this.initialized = true;
      }
    }

    @yyw.debounce(1000)
    private async show(index: number) {
      await this.hide();
      this.index = Math.min(3, index);
      this.sounds[this.index].play();
      this.words[this.index].visible = true;
      this.main.scaleX = 0;
      this.main.scaleY = 0;
      this.main.alpha = 0;
      this.main.visible = true;
      await yyw.getTween(this.main).to({
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
      }, 200);
      egret.setTimeout(this.hide, this, 500);
    }

    private async hide() {
      await yyw.getTween(this.main).to({
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
      });
      this.main.visible = false;
      this.main.scaleX = 1;
      this.main.scaleY = 1;
      this.main.alpha = 1;
      if (this.index >= 0) {
        this.words[this.index].visible = false;
        this.index = -1;
      }
    }
  }
}
