class SceneRecommenderO1 extends eui.Component implements eui.UIComponent {
  private container: eui.Group;
  private cover: eui.Image;
  private game: object;

  public constructor() {
    super();
  }

  protected partAdded(partName: string, instance: any): void {
    super.partAdded(partName, instance);
  }

  protected childrenCreated(): void {
    super.childrenCreated();

    const recommender: yyw.Recommender = yyw.define.get("recommender");
    egret.log("SceneRecommenderH4 childrenCreated", recommender);
    if (recommender) {
      this.cover.visible = false;
      this.cover.touchEnabled = true;
      this.cover.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (this.game) {
          recommender.navigateTo(this.game);
        }
      }, this);
      recommender.onChange((game) => {
        this.cover.visible = true;
        this.game = game;
        this.setImage(game.iconUrl);
      });

      this.anchorOffsetX = 88;
      this.anchorOffsetY = 88;

      this.x += 88;
      this.y += 88;

      // 创建 Tween 对象
      egret.Tween.get(this, { loop: true })
        .to({ rotation: 15 }, 50)
        .to({ rotation: -15 }, 50)
        .to({ rotation: 15 }, 50)
        .to({ rotation: -15 }, 50)
        .to({ rotation: 0 }, 50)
        .wait(1000);
    }
  }

  private async setImage(url: string) {
    const bm: egret.Bitmap = await yyw.RemoteLoader.loadImage(url);
    bm.width = 144;
    bm.height = 144;
    if (this.container.numChildren) {
      this.container.removeChild( this.container.getChildAt(0));
    }
    this.container.addChild(bm);
  }
}
