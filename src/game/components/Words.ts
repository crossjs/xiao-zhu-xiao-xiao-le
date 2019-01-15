namespace game {
  export class Words extends eui.Component implements eui.UIComponent {
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
    public async showWord(index: number) {
      await this.hideWord();
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
      egret.setTimeout(this.hideWord, this, 300);
    }

    public async hideWord() {
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

    protected partAdded(partName: string, instance: any): void {
      super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.words = [
        this.imgGood,
        this.imgGreat,
        this.imgAmazing,
        this.imgExcellent,
      ];
    }
  }
}
