namespace game {
  export class Cell extends Base {
    /**
     * 99 魔法数，可以触发其它数 + 1
     * -1 不可用
     */
    private anchorOffset: number = 0;
    private num: number = 0;
    private tfdScore: eui.BitmapLabel;
    private numGroup: eui.Group;
    private numImage: eui.Image;

    constructor(col: number, row: number, width: number, num: number) {
      super();
      this.num = num;
      this.anchorOffset = width / 2;
      this.x = col * width + this.anchorOffset;
      this.y = row * width + this.anchorOffset;
      this.anchorOffsetX = this.anchorOffsetY = this.anchorOffset;
    }

    public setNumber(num: number): void {
      if (num === this.num) {
        return;
      }
      if (this.numImage) {
        this.numImage.visible = false;
      }
      this.num = num;
      this.showCurrent();
    }

    public getNumber(): number {
      return this.num;
    }

    public async flashScore() {
      this.tfdScore.text = `${this.num * 10}`;
      this.tfdScore.visible = true;
      this.tfdScore.alpha = 0;
      const tween = await PromisedTween.get(this.tfdScore);
      await tween.to({
        y: 0,
        alpha: 1,
      }, 300);
      await tween.to({
        y: -36,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
      }, 200);
      this.tfdScore.visible = false;
      this.tfdScore.alpha = 1;
      this.tfdScore.y = 36;
      this.tfdScore.scaleX = 1;
      this.tfdScore.scaleY = 1;
    }

    public async tweenUp(duration: number = 300): Promise<void> {
      const { numImage } = this;
      // 淡出当前
      await PromisedTween
      .get(numImage)
      .to({
        alpha: 0,
      }, duration);

      numImage.visible = false;
      numImage.alpha = 1;

      const nextImage = this[`n${this.num === BIGGEST_NUMBER ? MAGIC_NUMBER : this.num + 1}`];
      nextImage.alpha = 0;
      nextImage.visible = true;
      // 淡入下张
      return PromisedTween
      .get(nextImage)
      .to({
        alpha: 1,
      }, duration);
    }

    public zoomOut(duration: number = 100) {
      PromisedTween.removeTweens(this);
      return PromisedTween
      .get(this)
      .to({
        scaleX: 1,
        scaleY: 1,
      }, duration);
    }

    public zoomIn(duration: number = 100) {
      PromisedTween.removeTweens(this);
      return PromisedTween
      .get(this)
      .to({
        scaleX: 1.2,
        scaleY: 1.2,
      }, duration);
    }

    public async tweenTo(increases: any[], duration: number, onResolve?: any): Promise<void> {
      const { numGroup } = this;
      const { x: oX, y: oY, rotation: oRotation, alpha: oAlpha } = numGroup;
      const tween = PromisedTween.get(numGroup);
      duration /= increases.length;
      let tX = oX;
      let tY = oY;
      let tRotation = oRotation;
      let tAlpha = oAlpha;
      for (const { x = 0, y = 0, rotation = 0, alpha = 0 } of increases) {
        tX += x;
        tY += y;
        tRotation += rotation;
        tAlpha += alpha;
        await tween.to({
          x: tX,
          y: tY,
          rotation: tRotation,
          alpha: tAlpha,
        }, duration);
      }

      if (typeof onResolve === "function") {
        await onResolve();
      }
      numGroup.x = oX;
      numGroup.y = oY;
      numGroup.rotation = oRotation;
      numGroup.alpha = oAlpha;
    }

    public fadeOut(duration: number = 300): Promise<void> {
      return PromisedTween
      .get(this.numGroup)
      .to({
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        rotation: 1080,
      }, duration);
    }

    public fadeIn(duration: number = 200): Promise<void> {
      return PromisedTween
      .get(this.numGroup)
      .to({
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        rotation: 0,
      }, duration);
    }

    public reset() {
      PromisedTween.removeTweens(this.tfdScore);
      PromisedTween.removeTweens(this.numGroup);
      PromisedTween.removeTweens(this.numImage);
      this.tfdScore.visible = false;
      this.tfdScore.alpha = 1;
      this.tfdScore.y = 36;
      this.numGroup.scaleX = this.numGroup.scaleY = this.numGroup.alpha = 1;
      this.numGroup.rotation = 0;
    }

    protected destroy() {
      this.reset();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        this.numGroup.x
          = this.numGroup.y
          = this.numGroup.anchorOffsetX
          = this.numGroup.anchorOffsetY
          = this.anchorOffset;
        this.initialized = true;
      }

      this.showCurrent();
    }

    private showCurrent(): void {
      if (this.num) {
        this.numImage = this[`n${this.num}`];
        this.numImage.visible = true;
      }
    }
  }
}
