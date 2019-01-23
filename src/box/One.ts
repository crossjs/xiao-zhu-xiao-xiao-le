namespace box {
  export class One extends yyw.Base {
    private container: eui.Group;
    private cover: eui.Group;
    private offChange: any;
    private anchorOffset: number = 44;

    public constructor() {
      super();
      this.x += (this.anchorOffsetX = this.anchorOffset);
      this.y += (this.anchorOffsetY = this.anchorOffset);
    }

    protected destroy() {
      yyw.removeTweens(this);
      if (this.offChange) {
        this.offChange();
        this.offChange = null;
      }
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      let currentGame;
      let instance;

      this.offChange = box.onChange((game, recommender) => {
        this.cover.visible = true;
        currentGame = game;
        instance = recommender;
        this.setImage(game.iconUrl);
      });

      this.animate();

      if (fromChildrenCreated) {
        this.cover.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
          if (currentGame) {
            instance.navigateTo(currentGame);
          }
        }, this);
      }
    }

    // 循环抖动
    private async animate() {
      // 创建 Tween 对象
      const tween = yyw.getTween(this);
      await tween.to({ rotation: 15 }, 50);
      await tween.to({ rotation: -15 }, 50);
      await tween.to({ rotation: 15 }, 50);
      await tween.to({ rotation: -15 }, 50);
      await tween.to({ rotation: 0 }, 50);
      egret.setTimeout(() => {
        if (this.offChange) {
          this.animate();
        }
      }, this, 1000);
    }

    private async setImage(url: string) {
      const bm: egret.Bitmap = await yyw.RemoteLoader.loadImage(url);
      bm.width = 72;
      bm.height = 72;
      if (this.container.numChildren) {
        this.container.removeChild(this.container.getChildAt(0));
      }
      this.container.addChild(bm);
    }
  }
}
