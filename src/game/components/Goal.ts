namespace game {
  export class Goal extends yyw.Base {
    private tfd: eui.Label;
    private img: eui.Image;
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
      }
    }

    public isComplete(): boolean {
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
