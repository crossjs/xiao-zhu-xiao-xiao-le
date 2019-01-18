namespace game {
  export class Words extends Base {
    private imgGood: eui.Image;
    private imgGreat: eui.Image;
    private imgAmazing: eui.Image;
    private imgExcellent: eui.Image;
    private words: [eui.Image, eui.Image, eui.Image, eui.Image];
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

    @yyw.debounce(1000)
    public async show(index: number) {
      await this.hide();
      this.index = Math.min(3, index);
      this.sounds[this.index].play();
      const target = this.words[this.index];
      target.scaleX = 0;
      target.scaleY = 0;
      target.alpha = 0;
      target.visible = true;
      await PromisedTween
      .get(target)
      .to({
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
      });
      egret.setTimeout(this.hide, this, 300);
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

    private async hide() {
      if (this.index >= 0) {
        const target = this.words[this.index];
        await PromisedTween
        .get(target)
        .to({
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
        });
        target.visible = false;
        target.scaleX = 1;
        target.scaleY = 1;
        target.alpha = 1;
        this.index = -1;
      }
    }
  }
}
