namespace game {
  export class Guide extends yyw.Base {
    private finger: eui.Image;
    private numFrom: eui.Image;
    private numTo: eui.Image;

    protected destroy() {
      yyw.removeTweens(this.finger);
      yyw.removeTweens(this.numFrom);
      yyw.removeTweens(this.numTo);
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);
      if (fromChildrenCreated) {
        yyw.onTap(this.bg, () => {
          SceneManager.escape();
        });
      }

      this.animate();
    }

    private animate() {
      const tweenFinger = yyw.getTween(this.finger);
      const tweenNumFrom = yyw.getTween(this.numFrom);
      const tweenNumTo = yyw.getTween(this.numTo);
      const tween = async () => {
        tweenNumFrom.to({
          y: 444,
        }, 500);
        tweenNumTo.to({
          y: 300,
        }, 500);
        await tweenFinger.to({
          y: 504,
        }, 500);
        tweenNumFrom.to({
          y: 300,
        }, 500);
        tweenNumTo.to({
          y: 444,
        }, 500);
        await tweenFinger.to({
          y: 330,
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
