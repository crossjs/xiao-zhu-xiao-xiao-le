namespace game {
  export class ToolBase extends yyw.Base {
    public type: string = "";
    protected main: eui.Group;
    protected tfd: eui.BitmapLabel;
    protected img: eui.Image;
    protected num: number = 0;
    protected message: string = "获得道具";
    protected dnd: boolean = false;
    protected rect: egret.Rectangle;

    public set targetRect(targetRect: egret.Rectangle) {
      this.rect = targetRect;
    }

    public setNum(num: number): void {
      this.num = num;
      this.update();
    }

    public increaseNum(num: number): void {
      this.num += num;
      this.update();
    }

    protected destroy() {
      yyw.removeTweens(this.main);
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      if (fromChildrenCreated) {
        yyw.onTap(this, async () => {
          this.zoomOut();
          if (!this.num) {
            if (await yyw.share()) {
              yyw.showToast(this.message);
              this.increaseNum(1);
            } else {
              yyw.showToast("转发才能🉐道具");
            }
            return;
          }
          if (!this.dnd) {
            this.dispatchEventWith("USING", false, {
              type: this.type,
              confirm: () => {
                this.increaseNum(-1);
              },
            });
            return;
          }
          yyw.showToast("手指拖动到游戏区域，\n触发道具效果");
        });

        if (this.dnd) {
          const { x, y } = this;
          const zIndex = yyw.getZIndex(this);
          let startX: number;
          let startY: number;
          let targetXY: object = null;
          yyw.onDnd(this, (e: egret.TouchEvent, cancel: any) => {
            if (!this.num) {
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
              this.dispatchEventWith("USING", false, {
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
              this.dispatchEventWith("USING", false, {
                type: this.type,
                ...targetXY,
                confirm: async () => {
                  await reset();
                  this.increaseNum(-1);
                },
              });
              targetXY = null;
            } else {
              this.dispatchEventWith("USING", false, {
                type: this.type,
                cancel: reset,
              });
            }
          });
        }

        this.initialized = true;
      }
    }

    protected update() {
      const { tfd, img, num } = this;
      tfd.text = `${num}`;
      img.visible = !num;
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
