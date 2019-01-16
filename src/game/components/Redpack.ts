namespace game {
  export class Redpack extends eui.Component implements eui.UIComponent {
    private amount: number;
    private main: eui.Group;
    private btnRedpack: eui.Image;
    private tfdAmount: eui.BitmapLabel;
    private tfdBalance: eui.BitmapLabel;
    private btnRedpackLarge: eui.Image;

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

    public async hide() {
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
    }

    // protected partAdded(partName: string, instance: any): void {
    //   super.partAdded(partName, instance);
    // }

    protected childrenCreated(): void {
      super.childrenCreated();

      this.btnRedpack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        yyw.showToast("满20可以提现");
      }, this);

      this.btnRedpackLarge.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
        // 看完视频广告后领红包
        await this.hide();
        await yyw.saveRedpack(this.amount);
        const { balance } = await yyw.getPbl();
        this.tfdBalance.text = `￥${yyw.toFixed(balance)}`;
      }, this);
    }
  }
}
