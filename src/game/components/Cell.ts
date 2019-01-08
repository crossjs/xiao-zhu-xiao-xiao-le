namespace game {
  export class Cell extends eui.Component implements eui.UIComponent {
    /**
     * 99 魔法数，可以触发其它数 + 1
     * -1 不可用
     */
    private num: number = 0;
    private tfdScore: eui.BitmapLabel;
    private numGroup: eui.Group;
    private numImage: eui.Image;

    constructor(col: number, row: number, width: number) {
      super();
      const anchorOffset = width / 2;
      this.x = col * width + anchorOffset;
      this.y = row * width + anchorOffset;
      this.anchorOffsetX = this.anchorOffsetY = anchorOffset;
      this.scaleX = this.scaleY = 0.875;

      // 加到场景后才能取到
      this.once(egret.Event.ADDED_TO_STAGE, () => {
        this.numGroup.x
          = this.numGroup.y
          = this.numGroup.anchorOffsetX
          = this.numGroup.anchorOffsetY
          = anchorOffset;
      }, this);
    }

    public setNumber(num: number): void {
      if (num === this.num) {
        return;
      }
      if (this.numImage) {
        this.numImage.visible = false;
      }
      if (num) {
        this.numImage = this[`n${num}`];
        this.numImage.visible = true;
      }
      this.num = num;
    }

    public getNumber(): number {
      return this.num;
    }

    public flashScore() {
      this.tfdScore.text = `${this.num * 10}`;
      this.tfdScore.visible = true;
      this.tfdScore.alpha = 0;
      egret.Tween
      .get(this.tfdScore)
      .to({
        y: 0,
        alpha: 1,
      }, 500, egret.Ease.quadOut)
      .call(() => {
        this.tfdScore.visible = false;
        this.tfdScore.alpha = 1;
        this.tfdScore.y = 36;
      });
    }

    public tweenUp(duration: number = 300) {
      return new Promise((resolve, reject) => {
        const { numImage } = this;
        // 淡出当前
        egret.Tween
        .get(numImage)
        .to({
          alpha: 0,
        }, duration, egret.Ease.quadOut)
        .call(() => {
          numImage.visible = false;
          numImage.alpha = 1;
        });
        const nextImage = this[`n${this.num + 1}`];
        nextImage.alpha = 0;
        nextImage.visible = true;
        // 淡入下张
        egret.Tween
        .get(nextImage)
        .to({
          alpha: 1,
        }, duration, egret.Ease.quadOut)
        .call(resolve);
      });
    }

    public zoomOut(duration: number = 100) {
      egret.Tween
      .get(this)
      .to({
        scaleX: 0.875,
        scaleY: 0.875,
      }, duration, egret.Ease.quadOut);
    }

    public zoomIn(duration: number = 100) {
      egret.Tween
      .get(this)
      .to({
        scaleX: 1,
        scaleY: 1,
      }, duration, egret.Ease.quadOut);
    }

    public tweenTo(increases: any[], duration: number, onResolve?: any): Promise<void> {
      return new Promise((resolve, reject) => {
        const { numGroup } = this;
        const { x: oX, y: oY, rotation: oRotation, alpha: oAlpha } = numGroup;
        let tween = egret.Tween.get(numGroup);
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
          tween = tween.to({
            x: tX,
            y: tY,
            rotation: tRotation,
            alpha: tAlpha,
          }, duration, egret.Ease.quadOut);
        }

        tween.call(async () => {
          if (typeof onResolve === "function") {
            await onResolve();
          }
          resolve();
          numGroup.x = oX;
          numGroup.y = oY;
          numGroup.rotation = oRotation;
          numGroup.alpha = oAlpha;
        });
      });
    }

    public fadeOut(duration: number = 300): Promise<void> {
      return new Promise((resolve, reject) => {
        const { numGroup } = this;
        egret.Tween
        .get(numGroup)
        .to({
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          rotation: 1080,
        }, duration, egret.Ease.quadOut)
        .call(() => {
          resolve();
        });
      });
    }

    public fadeIn(duration: number = 200): Promise<void> {
      return new Promise((resolve, reject) => {
        const { numGroup } = this;
        egret.Tween
        .get(numGroup)
        .to({
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
          rotation: 0,
        }, duration, egret.Ease.quadOut)
        .call(() => {
          resolve();
        });
      });
    }

    public reset() {
      egret.Tween.removeTweens(this.tfdScore);
      egret.Tween.removeTweens(this.numGroup);
      egret.Tween.removeTweens(this.numImage);
      this.tfdScore.visible = false;
      this.tfdScore.alpha = 1;
      this.tfdScore.y = 36;
      this.numGroup.scaleX = this.numGroup.scaleY = this.numGroup.alpha = 1;
      this.numGroup.rotation = 0;
    }
  }
}
