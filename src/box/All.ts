namespace box {
  export class All extends yyw.Base {
    private container: eui.Group;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        box.onReady((_: any, recommender: Recommender) => {
          const bg: eui.Image = new eui.Image("sprites_json.bottom_bg");
          bg.scale9Grid = new egret.Rectangle(10, 10, 10, 10);
          bg.width = this.width;
          bg.height = this.height;
          this.addChildAt(bg, 0);

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
            const icon: egret.Bitmap = await yyw.loadImage(iconUrl);
            icon.x = 24;
            icon.y = 12;
            icon.width = 120;
            icon.height = 120;
            // 圆角遮罩
            const round: eui.Rect = new eui.Rect(120, 120);
            round.x = 24;
            round.y = 12;
            round.ellipseWidth = 20;
            round.ellipseHeight = 20;
            // 叹号
            const textureAlert: egret.Texture = await RES.getResAsync("sprites_json.important");
            const important: egret.Bitmap = new egret.Bitmap(textureAlert);
            important.x = 126;
            important.y = 3;
            // 标题
            const label: eui.Label = new eui.Label(yyw.sliceString(title));
            label.width = 168;
            label.textAlign = "center";
            label.y = 140;
            label.size = 24;
            label.textColor = 0x000000;
            group.addChild(icon);
            group.addChild(round);
            group.addChild(important);
            group.addChild(label);
            icon.mask = round;
            this.container.addChild(group);
          });
        });
      }
    }
  }
}
