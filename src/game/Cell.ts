namespace game {
  export class Cell extends eui.Component implements eui.UIComponent {
    private n1: eui.Image;
    private n2: eui.Image;
    private n3: eui.Image;
    private n4: eui.Image;
    private n5: eui.Image;
    private n6: eui.Image;
    private n7: eui.Image;
    private n8: eui.Image;
    private point: game.Point;
    private num: number;
    private cellWidth: number;
    private current: eui.Image;

    constructor(point: game.Point, cellWidth: number) {
      super();
      this.point = point;
      this.num = 0;
      this.cellWidth = cellWidth;
    }

    public setNumber(num: number): void {
      if (num === this.num) {
        return;
      }
      if (this.current) {
        this.current.visible = false;
      }
      if (num) {
        this.current = this[`n${num}`];
        this.current.scaleX = this.current.scaleY = 0.875;
        this.current.visible = true;
      }
      this.num = num;
    }

    public getNumber(): number {
      return this.num;
    }
  }
}
