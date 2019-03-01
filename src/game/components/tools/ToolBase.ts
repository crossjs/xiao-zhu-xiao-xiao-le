namespace game {
  export abstract class ToolBase extends yyw.Base {
    public abstract type: string;
    protected main: eui.Group;
    protected tfd: eui.BitmapLabel;
    protected img: eui.Image;
    protected amount: number = 0;
    protected message: string = "获得道具";
    protected dnd: boolean = false;
    protected rect: egret.Rectangle;

    public set targetRect(targetRect: egret.Rectangle) {
      this.rect = targetRect;
    }

    public setAmount(amount: number): void {
      this.amount = amount;
      this.update();
    }

    public getAmount(): number {
      return this.amount;
    }

    public increaseAmount(amount: number): void {
      this.amount += amount;
      if (amount > 0) {
        yyw.emit("TOOL_USED", {
          type: this.type,
          amount,
        });
      }
      this.update();
    }

    protected destroy() {
      yyw.removeTweens(this.main);
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
          if (!this.amount) {
            this.enabled = false;
            if (await yyw.reward.apply("tool")) {
              this.increaseAmount(1);
              this.afterGet(1);
            }
            this.enabled = true;
            return;
          }
          if (!this.dnd) {
            yyw.emit("TOOL_USING", {
              type: this.type,
              confirm: () => {
                this.increaseAmount(-1);
              },
            });
            return;
          }
        });

        if (this.dnd) {
          const { x, y } = this;
          const zIndex = yyw.getZIndex(this);
          let startX: number;
          let startY: number;
          let targetXY: object = null;
          yyw.onDnd(this, (e: egret.TouchEvent, cancel: any) => {
            if (!this.amount) {
              cancel();
              return;
            }
            startX = e.stageX;
            startY = e.stageY;
            yyw.setZIndex(this);
            this.zoomIn();
          }, (e: egret.TouchEvent, cancel: any) => {
            const { stageX, stageY } = e;
            this.x = x + (stageX - startX);
            this.y = y + (stageY - startY);
            if (this.rect.contains(stageX, stageY)) {
              targetXY = {
                targetX: stageX - this.rect.x,
                targetY: stageY - this.rect.y,
              };
              yyw.emit("TOOL_USING", {
                type: this.type,
                ...targetXY,
                cancel,
              });
            } else {
              targetXY = null;
            }
          }, async () => {
            const reset = async () => {
              await this.zoomOut();
              await yyw.getTween(this).to({
                x,
                y,
              }, 500);
              yyw.setZIndex(this, zIndex);
            };
            if (targetXY) {
              yyw.emit("TOOL_USING", {
                type: this.type,
                ...targetXY,
                confirm: async () => {
                  await reset();
                  this.increaseAmount(-1);
                },
              });
              targetXY = null;
            } else {
              yyw.showToast("请拖放到棋盘中");
              await reset();
            }
          });
        }
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
