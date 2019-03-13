namespace game {
  const cellWidth = 144;
  const cellHeight = 144;

  export const CELL_TYPES = {
    NORMAL: 0,
    FIXED: 1,
    BLACK: 2,
  };

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
    private fixed: eui.Image;
    private black: eui.Image;

    constructor(
      public col: number,
      public row: number,
      private type: number = CELL_TYPES.NORMAL,
    ) {
      super();
      this.ax = cellWidth / 2;
      this.ay = cellHeight / 2;
      this.x = this.col * cellWidth + this.ax;
      this.y = this.row * cellHeight + this.ay;
      this.anchorOffsetX = this.ax;
      this.anchorOffsetY = this.ay;
    }

    public getIndex(): number {
      return COLS * this.row + this.col;
    }

    public getType() {
      return this.type;
    }

    public setType(type: number) {
      this.type = type;
      this.fixed.visible = type === CELL_TYPES.FIXED;
      this.black.visible = type === CELL_TYPES.BLACK;
    }

    public canDrag(): boolean {
      return this.type === CELL_TYPES.NORMAL;
    }

    public canDrop(): boolean {
      return this.type === CELL_TYPES.NORMAL;
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
        scale: 1.5,
      }, 200);
      this.tfdScore.visible = false;
      this.tfdScore.alpha = 1;
      this.tfdScore.y = 108;
      this.tfdScore.scale = 1;
    }

    public async tweenUp(): Promise<void> {
      // 淡出当前
      await this.fadeOut();

      // 修改图片
      this.numImage.source = `numbers_json.${this.num === BIGGEST_NUMBER ? MAGIC_NUMBER : this.num + 1}`;

      // 淡入下张
      await this.fadeIn();
    }

    public async growUp(num?: number) {
      // 从 +1 道具来
      if (num === undefined) {
        num = this.getNumber() + 1;
        if (num > BIGGEST_NUMBER) {
          num = MAGIC_NUMBER;
        }
      }
      yyw.setZIndex(this);
      await this.fadeOut();
      await new Promise((resolve) => {
        const data = RES.getRes("boom_json");
        const texture = RES.getRes("boom_png");
        const mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
        const mc1: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("run"));
        mc1.x = this.width / 2;
        mc1.y = this.height / 2;
        this.addChild(mc1);
        mc1.once(egret.Event.COMPLETE, async (e: egret.Event) => {
          await yyw.fadeOut(mc1);
          yyw.removeElement(mc1);
          resolve();
        }, this);
        mc1.gotoAndPlay(`boom${yyw.random(1, 3)}`);
      });
      this.setNumber(num);
      await this.fadeIn();
    }

    public zoomOut(duration: number = 100) {
      yyw.removeTweens(this);
      return yyw.getTween(this)
      .to({
        scale: 1,
      }, duration);
    }

    public zoomIn(duration: number = 100) {
      yyw.removeTweens(this);
      return yyw.getTween(this)
      .to({
        scale: 1.2,
      }, duration);
    }

    public async tweenTo(increases: any[], duration: number, onResolve?: any): Promise<void> {
      const { numGroup } = this;
      const { x: oX, y: oY, rotation: oRotation, alpha: oAlpha } = numGroup;
      const tween = yyw.getTween(numGroup);
      yyw.wave(this, {
        step: 0.02,
        y: 1.6,
      });
      duration /= increases.length;
      let tX = oX;
      let tY = oY;
      let tRotation = oRotation;
      let tAlpha = oAlpha;
      for (const { x = 0, y = 0, rotation = 0, alpha = 0 } of increases) {
        tX += x * this.width;
        tY += y * this.height;
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
      yyw.disWave(this);
    }

    public async fadeOut(duration: number = 300): Promise<void> {
      await yyw.getTween(this.numGroup)
      .to({
        scale: 0,
        alpha: 0,
        rotation: 1080,
      }, duration);
    }

    public async fadeIn(duration: number = 200): Promise<void> {
      await yyw.getTween(this.numGroup)
      .to({
        scale: 1,
        alpha: 1,
        rotation: 0,
      }, duration);
    }

    public reset() {
      yyw.removeTweens(this);
      yyw.disWave(this);
      this.scale = 1;
      yyw.removeTweens(this.tfdScore);
      yyw.removeTweens(this.numGroup);
      yyw.removeTweens(this.numImage);
      this.tfdScore.visible = false;
      this.tfdScore.alpha = 1;
      this.tfdScore.y = 36;
      this.numGroup.scale = this.numGroup.alpha = 1;
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
        yyw.noise(this.numImage);
      }

      this.showCurrent();
    }

    private showCurrent(): void {
      if (this.num > 0) {
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
