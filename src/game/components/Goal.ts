namespace game {
  export class Goal extends yyw.Base {
    private img: eui.Image;
    private rct: eui.Rect;
    private tfd: eui.Label;
    private chk: eui.Image;

    constructor(
      private num: string,
      private amount: number,
    ) {
      super();
    }

    public getAmount(): number {
      return this.amount;
    }

    public increaseAmount(amount: number) {
      this.amount -= amount;
      this.amount = Math.max(0, this.amount);
      this.tfd.text = `${this.amount}`;
      if ( this.amount === 0) {
        this.chk.visible = true;
        this.rct.visible = false;
        this.tfd.visible = false;
      }
    }

    public isCompleted(): boolean {
      return !this.amount;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        this.img.source = `fruits_json.${this.num}`;
        this.tfd.text = `${this.amount}`;
      }
    }
  }
}
