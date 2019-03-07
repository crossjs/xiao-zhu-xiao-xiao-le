namespace game {
  export class CtrlShop extends yyw.Base {
    private coin: eui.Image;
    private tfdCoins: eui.BitmapLabel;
    private coins: number = 0;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.main, () => {
          yyw.director.toScene("shop", true);
        });
        yyw.on("COINS_GOT", ({ data: { amount } }) => {
          this.updateCoins(amount);
        });
        yyw.on("COINS_USED", ({ data: { amount } }) => {
          this.updateCoins(-amount);
        });

        this.updateCoins();
      }
    }

    private async updateCoins(mutation?: number) {
      if (mutation) {
        this.coins += mutation;
        if (mutation > 0) {
          await this.animateCoins();
        }
      } else {
        try {
          const { coins } = await yyw.pbl.me();
          this.coins = coins;
        } catch (error) {
          egret.error(error);
        }
      }
      this.tfdCoins.text = `${this.coins}`;
    }

    private async animateCoins() {
      const { source, scale } = this.coin;
      const { x, y } = this.coin.localToGlobal();
      return Promise.all(
        new Array(10).fill(0).map(async (_, index) => {
          const coin = new eui.Image(source);
          coin.x = x * 2 - yyw.random(x * 4);
          coin.y = y * 2 - yyw.random(y * 4);
          this.stage.addChild(coin);
          const tween = yyw.getTween(coin);
          await tween.to({
            scale,
            x,
            y,
            alpha: 0.5,
          }, yyw.random(500) + 500);
          yyw.removeElement(coin);
        }),
      );
    }
  }
}
