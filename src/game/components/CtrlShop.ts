namespace game {
  export class CtrlShop extends yyw.Base {
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
  }
}
