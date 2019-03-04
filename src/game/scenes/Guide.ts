namespace game {
  export class Guide extends yyw.Base {
    private finger: eui.Image;
    private numFrom: eui.Image;
    private numTo: eui.Image;

    protected destroy() {
      yyw.removeTweens(this.finger);
      yyw.removeTweens(this.numFrom);
      yyw.removeTweens(this.numTo);
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.bg, () => {
          yyw.director.escape();
        });
      }

      this.animate();
    }

    private animate() {
      const tweenFinger = yyw.getTween(this.finger);
      const tweenNumFrom = yyw.getTween(this.numFrom);
      const tweenNumTo = yyw.getTween(this.numTo);
      const y1 = this.numFrom.y;
      const y2 = this.numTo.y;
      const fy1 = this.finger.y;
      const fy2 = fy1 + y2 - y1;
      const tween = async () => {
        tweenNumFrom.to({
          y: y2,
        }, 500);
        tweenNumTo.to({
          y: y1,
        }, 500);
        await tweenFinger.to({
          y: fy2,
        }, 500);
        tweenNumFrom.to({
          y: y1,
        }, 500);
        tweenNumTo.to({
          y: y2,
        }, 500);
        await tweenFinger.to({
          y: fy1,
        }, 500);
        egret.setTimeout(() => {
          if (this.parent) {
            tween();
          }
        }, null, 3000);
      };
      if (this.parent) {
        tween();
      }
    }
  }
}
