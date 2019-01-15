namespace game {
  export class Redpack extends eui.Component implements eui.UIComponent {
    private amount: number;
    private main: eui.Group;
    private btnRedpack: eui.Image;
    private tfdMessage: eui.Label;
    private tfdAmount: eui.BitmapLabel;
    private tfdBalance: eui.BitmapLabel;
    private btnRedpackLarge: eui.Image;

    // constructor() {
    //   super();

    //   // 加到场景后才能取到
    //   // this.once(egret.Event.ADDED_TO_STAGE, () => {
    //   // }, this);
    // }

    public async show() {
      this.amount = yyw.toFixed(Math.floor(Math.random() * 99) / 100 + 0.01);
      this.tfdAmount.text = `￥${this.amount}`;
      this.main.scaleX = 0;
      this.main.scaleY = 0;
      this.main.visible = true;
      await PromisedTween
      .get(this.main)
      .to({
        scaleX: 1,
        scaleY: 1,
        rotation: 360,
      });
    }

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnRedpack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        this.tfdMessage.visible = true;
        egret.setTimeout(() => {
          this.tfdMessage.visible = false;
        }, this, 500);
      }, this);

      this.btnRedpackLarge.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
        // 看完视频广告后领红包
        await PromisedTween
        .get(this.main)
        .to({
          scaleX: 0,
          scaleY: 0,
          rotation: 0,
        });
        this.main.visible = false;
        this.main.scaleX = 1;
        this.main.scaleY = 1;
        await yyw.saveRedpack(this.amount);
        const { balance } = await yyw.getPbl();
        this.tfdBalance.text = `￥${yyw.toFixed(balance)}`;
      }, this);
    }
  }
}
