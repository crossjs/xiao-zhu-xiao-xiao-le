namespace game {
  export class Cell extends yyw.Base {
    /**
     * 99 魔法数，可以触发其它数 + 1
     * -1 不可用
     */
    private ax: number = 0;
    private ay: number = 0;
    private num: number = 0;
    private tfdScore: eui.BitmapLabel;
    private numGroup: eui.Group;
    private numImage: eui.Image;
    private sugar: eui.Image;

    constructor(col: number, row: number, width: number, height: number, num: number = 0) {
      super();
      this.num = num;
      this.ax = width / 2;
      this.ay = height / 2;
      this.x = col * width + this.ax;
      this.y = row * height + this.ay;
      this.anchorOffsetX = this.ax;
      this.anchorOffsetY = this.ay;
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
      this.tfdScore.text = `+${this.num * 10}`;
      this.tfdScore.visible = true;
      this.tfdScore.alpha = 0;
      const tween = await yyw.getTween(this.tfdScore);
      await tween.to({
        y: 72,
        alpha: 1,
      }, 300);
      await tween.to({
        y: 36,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
      }, 200);
      this.tfdScore.visible = false;
      this.tfdScore.alpha = 1;
      this.tfdScore.y = 108;
      this.tfdScore.scaleX = 1;
      this.tfdScore.scaleY = 1;
    }

    public async tweenUp(duration: number = 300): Promise<void> {
      const { numImage } = this;
      // 淡出当前
      await yyw.fadeOut(numImage, duration);

      numImage.source = `numbers_json.${this.num === BIGGEST_NUMBER ? MAGIC_NUMBER : this.num + 1}`;
      // 淡入下张
      await yyw.fadeIn(numImage, duration);
    }

    public zoomOut(duration: number = 100) {
      yyw.removeTweens(this);
      yyw.disWave(this);
      return yyw.getTween(this)
      .to({
        scale: 1,
      }, duration);
    }

    public zoomIn(duration: number = 100) {
      yyw.removeTweens(this);
      yyw.wave(this, 0.02);
      return yyw.getTween(this)
      .to({
        scale: 1.2,
      }, duration);
    }

    public async tweenTo(increases: any[], duration: number, onResolve?: any): Promise<void> {
      const { numGroup } = this;
      const { x: oX, y: oY, rotation: oRotation, alpha: oAlpha } = numGroup;
      const tween = yyw.getTween(numGroup);
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

    public async fadeOut(duration: number = 300): Promise<void> {
      await yyw.getTween(this.numGroup)
      .to({
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        rotation: 1080,
      }, duration);
    }

    public async fadeIn(duration: number = 200): Promise<void> {
      await yyw.getTween(this.numGroup)
      .to({
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        rotation: 0,
      }, duration);
    }

    public reset() {
      yyw.removeTweens(this);
      this.scaleX = this.scaleY = 1;
      yyw.removeTweens(this.tfdScore);
      yyw.removeTweens(this.numGroup);
      yyw.removeTweens(this.numImage);
      this.tfdScore.visible = false;
      this.tfdScore.alpha = 1;
      this.tfdScore.y = 36;
      this.numGroup.scaleX = this.numGroup.scaleY = this.numGroup.alpha = 1;
      this.numGroup.rotation = 0;
    }

    protected destroy() {
      this.reset();
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        this.numGroup.x
          = this.numGroup.anchorOffsetX
          = this.ax;
        this.numGroup.y
          = this.numGroup.anchorOffsetY
          = this.ay;
      }

      this.showCurrent();
    }

    private showCurrent(): void {
      if (this.num) {
        this.numImage.source = `numbers_json.${this.num}`;
        this.numImage.visible = true;
      }
      yyw.removeTweens(this.sugar);
      if (MAGIC_NUMBER === this.num) {
        this.sugar.rotation = 0;
        yyw.getTween(this.sugar, true)
        .to({
          rotation: 360,
        }, 1000, null);
        this.sugar.visible = true;
      } else {
        this.sugar.visible = false;
      }
    }
  }
}
