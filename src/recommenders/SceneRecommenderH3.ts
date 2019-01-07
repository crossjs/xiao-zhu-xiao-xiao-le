class SceneRecommenderH3 extends eui.Component implements eui.UIComponent {
  private container: eui.Group;

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
      recommender.onReady(() => {
        const games = recommender.getGames(3);
        egret.log("recommender.getGames(3)", games);
        games.forEach(async (game: any, index: number) => {
          const { iconUrl, title } = game;
          // 先搞个组，然后在组上加点击
          const group: eui.Group = new eui.Group();
          group.x = 164 * index;
          group.touchEnabled = true;
          group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            recommender.navigateTo(game);
          }, this);
          // 图标
          const icon: egret.Bitmap = await yyw.RemoteLoader.loadImage(iconUrl);
          icon.width = 144;
          icon.height = 144;
          // 圆角遮罩
          const rect: eui.Rect = new eui.Rect(144, 144);
          rect.ellipseWidth = 20;
          rect.ellipseHeight = 20;
          // 叹号
          const textureAlert: egret.Texture = await RES.getResAsync("important@2x_png");
          const alert: egret.Bitmap = new egret.Bitmap(textureAlert);
          alert.x = 126;
          alert.y = -6;
          // 标题
          const label: eui.Label = new eui.Label(yyw.slice(title, 6, true));
          label.width = 144;
          label.textAlign = "center";
          label.y = 152;
          label.size = 24;
          label.textColor = 0x000000;
          label.wordWrap = false;
          group.addChild(icon);
          group.addChild(rect);
          group.addChild(alert);
          group.addChild(label);
          icon.mask = rect;
          this.container.addChild(group);
        });
      });
    }
  }

}
