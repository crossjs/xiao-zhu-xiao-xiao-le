namespace game {
  export const CELL_TYPES = {
    DEF: 1,
    ICE: 2,
    FIX: 4,
    NIL: 8,
  };

  export class Cell extends yyw.Base {
    /**
     * 99 魔法数，可以触发其它数 + 1
     * -1 不可用
     */
    private ax: number = 0;
    private ay: number = 0;
    private num: number = 0;
    private numGroup: eui.Group;
    private numImage: eui.Image;
    private imgIce: eui.Image;
    private imgFix: eui.Image;
    private imgNil: eui.Image;

    constructor(
      public col: number,
      public row: number,
      private type: number = CELL_TYPES.DEF,
    ) {
      super();
      this.width = yyw.CELL_WIDTH;
      this.height = yyw.CELL_HEIGHT;
      this.ax = yyw.CELL_WIDTH / 2;
      this.ay = yyw.CELL_HEIGHT / 2;
      this.x = this.col * yyw.CELL_WIDTH + this.ax;
      this.y = this.row * yyw.CELL_HEIGHT + this.ay;
      this.anchorOffsetX = this.ax;
      this.anchorOffsetY = this.ay;
    }

    public getType() {
      return this.type;
    }

    public setType(type: number) {
      this.type = type;
      this.imgIce.visible = type === CELL_TYPES.ICE;
      this.imgFix.visible = type === CELL_TYPES.FIX;
      this.imgNil.visible = type === CELL_TYPES.NIL;
    }

    public isMagic(): boolean {
      return this.num === yyw.MAGIC_NUMBER;
    }

    public isBomb(): boolean {
      return this.num === yyw.BOMB_NUMBER;
    }

    public canDrag(): boolean {
      return this.type === 1;
    }

    public canDrop(): boolean {
      return this.type === 1;
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

    public unfreeze() {
      if (this.type === CELL_TYPES.ICE) {
        this.setType(CELL_TYPES.DEF);
      }
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

    public async fadeOut(duration: number = 300): Promise<void> {
      await yyw.Boom.playAt(this);
      await yyw.getTween(this.numGroup)
      .to({
        scale: 1.2,
        alpha: 0,
      }, duration);
    }

    public async fadeIn(duration: number = 200): Promise<void> {
      await yyw.getTween(this.numGroup)
      .to({
        scale: 1,
        alpha: 1,
      }, duration);
    }

    public async tweenTo(increaseX: number, increaseY: number, duration: number): Promise<void> {
      const { numGroup } = this;
      const { x: oX, y: oY } = numGroup;
      const tween = yyw.getTween(numGroup);
      yyw.wave(this, {
        step: 0.02,
        y: 1.6,
      });
      await tween.to({
        x: oX + increaseX * this.width,
        y: oY + increaseY * this.height,
      }, duration);
      numGroup.x = oX;
      numGroup.y = oY;
      yyw.disWave(this);
    }

    public reset() {
      yyw.removeTweens(this);
      yyw.disWave(this);
      this.scale = 1;
      yyw.removeTweens(this.numGroup);
      yyw.removeTweens(this.numImage);
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

    private async showCurrent() {
      if (this.num > 0) {
        this.numImage.source = `fruits_json.${this.num}`;
        this.numImage.visible = true;
        await this.fadeIn();
      }
    }
  }
}
