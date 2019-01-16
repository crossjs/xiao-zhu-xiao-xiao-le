namespace box {
  export class All extends eui.Component implements eui.UIComponent {
    private container: eui.Group;

    // public constructor() {
    //   super();
    // }

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    public destroy() {
      yyw.removeFromStage(this);
    }

    protected childrenCreated(): void {
      super.childrenCreated();

      box.onReady((_, recommender) => {
        const games = recommender.getGames();
        games.forEach(async (game: any, index: number) => {
          const { iconUrl, title } = game;
          // 先搞个组，然后在组上加点击
          const group: eui.Group = new eui.Group();
          group.touchEnabled = true;
          group.width = 168;
          group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            recommender.navigateTo(game);
          }, this);
          // 图标
          const icon: egret.Bitmap = await yyw.RemoteLoader.loadImage(iconUrl);
          icon.x = 24;
          icon.y = 12;
          icon.width = 120;
          icon.height = 120;
          // 圆角遮罩
          const rect: eui.Rect = new eui.Rect(120, 120);
          rect.x = 24;
          rect.y = 12;
          rect.ellipseWidth = 20;
          rect.ellipseHeight = 20;
          // 叹号
          const textureAlert: egret.Texture = await RES.getResAsync("sprites_json.important");
          const important: egret.Bitmap = new egret.Bitmap(textureAlert);
          important.x = 126;
          important.y = 3;
          // 标题
          const label: eui.Label = new eui.Label(yyw.slice(title, 6, true));
          label.width = 168;
          label.textAlign = "center";
          label.y = 140;
          label.size = 24;
          label.textColor = 0xFFFFFF;
          group.addChild(icon);
          group.addChild(rect);
          group.addChild(important);
          group.addChild(label);
          icon.mask = rect;
          this.container.addChild(group);
        });
      });
    }
  }
}
