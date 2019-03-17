namespace game {
  export abstract class ToolBase extends yyw.Base {
    public abstract type: string;
    protected main: eui.Group;
    protected tfd: eui.BitmapLabel;
    protected img: eui.Image;
    protected amount: number = 0;
    protected message: string = "获得道具";

    public setAmount(amount: number): void {
      this.amount = amount;
      this.update();
    }

    public getAmount(): number {
      return this.amount;
    }

    public increaseAmount(amount: number): void {
      this.amount += amount;
      this.update();
    }

    protected destroy() {
      yyw.removeTweens(this.main);
      super.destroy();
    }

    protected afterGet(amount: number) {
      yyw.showToast(this.message);
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.on("TOOL_GOT", ({ data: { type, amount } }: egret.Event) => {
          if (type === this.type) {
            this.increaseAmount(amount);
            this.afterGet(amount);
          }
        });

        yyw.onTap(this, async () => {
          this.zoomOut();
          if (this.amount) {
            this.increaseAmount(-1);
            yyw.emit("TOOL_USED", {
              type: this.type,
              amount: 1,
            });
          } else {
            this.enabled = false;
            try {
              if (await yyw.reward.apply("tool")) {
                yyw.emit("TOOL_GOT", {
                  type: this.type,
                  amount: 1,
                });
              }
            } catch (error) {
              egret.error(error);
            }
            this.enabled = true;
            return;
          }
          this.zoomIn();
        });
      }
    }

    protected update() {
      const { tfd, img, amount } = this;
      tfd.text = `${amount}`;
      if (yyw.reward.can("tool")) {
        img.visible = !amount;
      }
    }

    private zoomIn() {
      yyw.getTween(this.main).to({
        scale: 1.2,
      });
    }

    private zoomOut() {
      yyw.getTween(this.main).to({
        scale: 1,
      });
    }
  }
}
