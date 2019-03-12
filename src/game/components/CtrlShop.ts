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
      }

      this.coins = yyw.USER.coins;
      this.tfdCoins.text = `${this.coins}`;
    }

    private async updateCoins(mutation?: number) {
      this.coins += mutation;
      if (mutation > 0) {
        await this.animateCoins();
      }
      this.tfdCoins.text = `${this.coins}`;
    }

    private async animateCoins() {
      const { source, scale } = this.coin;
      const { x, y } = this.coin.localToGlobal();
      const top = this.stage.stageHeight - 1012;
      return Promise.all(
        new Array(10).fill(0).map(async () => {
          const coin = new eui.Image(source);
          coin.x = yyw.random(15, 721);
          coin.y = yyw.random(top + 15, top + 721);
          this.stage.addChild(coin);
          const duration = yyw.random(500, 1000);

          yyw.bezierTo(coin, {
            x, y,
          }, duration);

          await yyw.getTween(coin).to({
            scale,
            alpha: 0.5,
          }, duration);
          yyw.removeElement(coin);
        }),
      );
    }
  }
}
