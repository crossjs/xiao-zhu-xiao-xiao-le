namespace game {
  export class ToolBase extends yyw.Base {
    public type: string = "";
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
            if (yyw.CONFIG.toolReward) {
              if (await yyw.share()) {
                this.increaseAmount(1);
                this.afterGet(1);
              } else {
                yyw.showToast("转发才能🉐道具");
              }
            }
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
          yyw.showToast("手指拖动到游戏区域，触发道具效果");
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
          }, async (e: egret.TouchEvent) => {
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
              yyw.emit("TOOL_USING", {
                type: this.type,
                cancel: reset,
              });
            }
          });
        }
      }
    }

    protected update() {
      const { tfd, img, amount } = this;
      tfd.text = `${amount}`;
      if (yyw.CONFIG.toolReward) {
        img.visible = !amount;
      }
    }

    private zoomIn() {
      yyw.getTween(this.main).to({
        scaleX: 1.5,
        scaleY: 1.5,
      });
    }

    private zoomOut() {
      yyw.getTween(this.main).to({
        scaleX: 1,
        scaleY: 1,
      });
    }
  }
}
