namespace box {
  export class One extends eui.Component implements eui.UIComponent {
    private container: eui.Group;
    private cover: eui.Group;
    private offChange: any;

    public constructor() {
      super();

      this.anchorOffsetX = 44;
      this.anchorOffsetY = 44;

      this.x += 44;
      this.y += 44;
    }

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    public destroy() {
      egret.Tween.removeTweens(this);
      if (this.offChange) {
        this.offChange();
      }
      yyw.removeFromStage(this);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      let currentGame;
      let instance;

      this.cover.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (currentGame) {
          instance.navigateTo(currentGame);
        }
      }, this);

      // 创建 Tween 对象
      egret.Tween.get(this, { loop: true })
        .to({ rotation: 15 }, 50)
        .to({ rotation: -15 }, 50)
        .to({ rotation: 15 }, 50)
        .to({ rotation: -15 }, 50)
        .to({ rotation: 0 }, 50)
        .wait(1000);

      this.offChange = box.onChange((game, recommender) => {
        this.cover.visible = true;
        currentGame = game;
        instance = recommender;
        this.setImage(game.iconUrl);
      });
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
