namespace game {
  const cellWidth = 90;
  const cellHeight = 90;

  export const CELL_TYPES = {
    DEF: 1,
    MAGIC: 2,
    BOMB: 4,
    ICE: 8,
    FIX: 16,
    NIL: 32,
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
      this.width = cellWidth;
      this.height = cellHeight;
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
      this.imgIce.visible = type === CELL_TYPES.ICE;
      this.imgFix.visible = type === CELL_TYPES.FIX;
      this.imgNil.visible = type === CELL_TYPES.NIL;
    }

    public isMagic(): boolean {
      return this.type === CELL_TYPES.MAGIC;
    }

    public isBomb(): boolean {
      return this.type === CELL_TYPES.BOMB;
    }

    public canDrag(): boolean {
      return (this.type & 7) !== 0;
    }

    public canDrop(): boolean {
      return (this.type & 7) !== 0;
    }

    public setNumber(num: number): void {
      if (num === this.num) {
        return;
      }
      if (this.numImage) {
        this.numImage.visible = false;
      }
      this.num = num;
      switch (this.num) {
        case MAGIC_NUMBER:
          this.setType(CELL_TYPES.MAGIC);
          break;
        case BOMB_NUMBER:
          this.setType(CELL_TYPES.BOMB);
          break;
        default:
          this.setType(CELL_TYPES.DEF);
      }
      this.showCurrent();
    }

    public getNumber(): number {
      return this.num;
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
      await Boom.playAt(this);
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
