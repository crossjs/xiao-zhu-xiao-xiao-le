class SceneRecommenderPopup extends eui.Component implements eui.UIComponent {
  private outerContainer: eui.Group;
  private innerContainer: eui.Group;
  private btnExpand: eui.Group;
  private btnCollapse: eui.Image;

  public constructor() {
    super();
  }

  protected partAdded(partName: string, instance: any): void {
    super.partAdded(partName, instance);
  }

  protected childrenCreated(): void {
    super.childrenCreated();

    this.outerContainer.x = -this.outerContainer.width;
    this.btnExpand.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      // 创建 Tween 对象
      egret.Tween.get(this.outerContainer, {
        loop: false,
      })
      .to({ x: -20 }, 200)
      .call(() => {
        egret.log(`outerContainer show!`);
      }, this);
    }, this);
    this.btnCollapse.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      // 创建 Tween 对象
      egret.Tween.get(this.outerContainer, {
        loop: false,
      })
      .to({ x: -this.outerContainer.width }, 200)
      .call(() => {
        egret.log(`outerContainer hide!`);
      }, this);
    }, this);

    const recommender: yyw.Recommender = yyw.define.get("recommender");
    egret.log("SceneRecommenderPopup childrenCreated", recommender);
    if (recommender) {
      recommender.onReady((games) => {
        games.forEach(async (game: any, index: number) => {
          const { iconUrl, title, play } = game;
          // 先搞个组，然后在组上加点击
          const group: eui.Group = new eui.Group();
          group.x = 308 * (index % 2);
          group.y = 144 * Math.floor(index / 2);
          group.touchEnabled = true;
          group.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            recommender.navigateTo(game);
          }, this);
          // 图标
          const icon: egret.Bitmap = await yyw.RemoteLoader.loadImage(iconUrl);
          icon.width = 120;
          icon.height = 120;
          // 圆角遮罩
          const rect: eui.Rect = new eui.Rect(120, 120);
          rect.ellipseWidth = 20;
          rect.ellipseHeight = 20;
          // 叹号
          const textureAlert: egret.Texture = await RES.getResAsync("important@2x_png");
          const alert: egret.Bitmap = new egret.Bitmap(textureAlert);
          alert.x = 102;
          alert.y = -6;
          // 标题
          const labelTitle: eui.Label = new eui.Label(yyw.slice(title, 6, true));
          labelTitle.x = 134;
          labelTitle.y = 8;
          labelTitle.size = 24;
          labelTitle.textColor = 0x000000;
          labelTitle.wordWrap = false;
          //  人数
          const labelCount: eui.Label = new eui.Label(`${play}人在玩`);
          labelCount.x = 134;
          labelCount.y = 41;
          labelCount.size = 24;
          labelCount.textColor = 0xcc0000;
          labelCount.wordWrap = false;
          // 按钮
          const buttonTexture: egret.Texture = RES.getRes("play_png");
          const button: egret.Bitmap = new egret.Bitmap(buttonTexture);
          button.x = 134;
          button.y = 82;
          button.width = 144;
          button.height = 42;
          group.addChild(icon);
          group.addChild(rect);
          group.addChild(alert);
          group.addChild(labelTitle);
          group.addChild(labelCount);
          group.addChild(button);
          icon.mask = rect;
          this.innerContainer.addChild(group);
        });
      });
    }
  }

}
