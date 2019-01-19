namespace game {
  export class Redpack extends yyw.Base {
    private main: eui.Group;
    private btnRedpack: eui.Image;
    private btnClose: eui.Button;
    private btnMain: eui.Image;
    private tfdAmount: eui.BitmapLabel;
    private tfdBalance: eui.BitmapLabel;
    private amount: number;

    public async show() {
      this.amount = yyw.toFixed(Math.floor(Math.random() * 99) / 100 + 0.01);
      this.tfdAmount.text = `￥${this.amount}`;
      this.main.scaleX = 0;
      this.main.scaleY = 0;
      this.main.visible = true;
      await yyw.PromisedTween
      .get(this.main)
      .to({
        scaleX: 1,
        scaleY: 1,
        rotation: 360,
      });
    }

    public async hide() {
      await yyw.PromisedTween
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

    protected destroy() {
      yyw.PromisedTween.removeTweens(this.main);
      this.main.visible = false;
      this.main.scaleX = 1;
      this.main.scaleY = 1;
    }

    protected createView(fromChildrenCreated?: boolean): void {
      if (fromChildrenCreated) {
        this.btnRedpack.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
          yyw.showToast("满20可以提现");
        }, this);

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
          this.hide();
        }, this);

        this.btnMain.addEventListener(egret.TouchEvent.TOUCH_TAP, async () => {
          // 转发/看完视频广告后领福包
          if (await yyw.share()) {
            await yyw.saveRedpack(this.amount);
            const { balance } = await yyw.getPbl();
            this.tfdBalance.text = `￥${yyw.toFixed(balance)}`;
            await this.hide();
          } else {
            yyw.showToast("转发才能🉐福包");
          }
        }, this);

        this.initialized = true;
      }
    }
  }
}
