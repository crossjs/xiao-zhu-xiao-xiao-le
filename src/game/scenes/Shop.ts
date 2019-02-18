namespace game {
  export class Shop extends yyw.Base {
    // private btnPurchase0: eui.Button;
    // private btnPurchase1: eui.Button;
    // private btnPurchase2: eui.Button;
    // private btnPurchase3: eui.Button;
    private items: eui.Group;
    private prices: number[] = [1000, 2000, 1500, 20000];
    private goods: string[] = ["valueUp", "shuffle", "breaker", "card"];

    // public async exiting() {
    //   await yyw.rightOut(this);
    // }

    // public async entering() {
    //   await yyw.rightIn(this);
    // }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.eachChild(this.items, ((child: eui.Group, index: number) => {
          const visible: boolean =
            ((yyw.CONFIG.shopStatus & 1) === 1 && index < 3)
            || ((yyw.CONFIG.shopStatus & 2) === 2 && index === 3);
          if (visible) {
            child.visible = true;
            yyw.onTap(this[`btnPurchase${index}`], async () => {
              if (index === 3) {
                yyw.showToast("请访问公众号「游鱼玩」，发送消息「兑换」");
              } else {
                // 消费
                const coins = -this.prices[index];
                await yyw.award.save({
                  coins,
                });
                yyw.emit("COINS_CHANGE", coins);
                yyw.showToast("购买成功");
                yyw.emit("TOOL_GOT", {
                  type: this.goods[index],
                  amount: 1,
                });
                // 刷新
                await this.update();
              }
            });
          } else {
            egret.setTimeout(() => {
              yyw.removeElement(child);
            }, null, 0);
          }
        }));
      }

      await this.update();
    }

    private async update() {
      try {
        const { coins } = await yyw.pbl.get();
        for (let i = 0; i < 4; i++) {
          (this[`btnPurchase${i}`] as eui.Button).enabled = coins > this.prices[i];
        }
      } catch (error) {
        egret.error(error);
      }
    }
  }
}
