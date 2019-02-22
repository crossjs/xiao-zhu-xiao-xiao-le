namespace game {
  export class Shop extends yyw.Base {
    // private btn0: eui.Button;
    // private btn1: eui.Button;
    // private btn2: eui.Button;
    // private items: eui.Group;
    private prices: number[] = [1000, 2000, 1500];
    private goods: string[] = ["valueUp", "shuffle", "breaker"];

    // public async exiting() {
    //   await yyw.rightOut(this);
    // }

    // public async entering() {
    //   await yyw.rightIn(this);
    // }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        // yyw.showToast("请访问公众号「游鱼玩」，发送消息「兑换」");
        for (let i = 0; i < this.goods.length; i++) {
          ((index) => {
            yyw.onTap(this[`btn${index}`], async () => {
              // 消费
              const coins = -this.prices[index];
              await yyw.award.save({
                coins,
              });
              yyw.emit("COINS_CHANGE", coins);
              yyw.showToast("兑换成功");
              yyw.emit("TOOL_GOT", {
                type: this.goods[index],
                amount: 1,
              });
              // 刷新
              await this.update();
            });
          })(i);
        }
      }

      await this.update();
    }

    private async update() {
      try {
        const { coins } = await yyw.pbl.get();
        for (let i = 0; i < this.goods.length; i++) {
          const enabled = coins >= this.prices[i];
          const btn: eui.Button = this[`btn${i}`];
          const grp: eui.Group = this[`grp${i}`];
          btn.enabled = enabled;
          if (enabled) {
            grp.filters = null;
          } else {
            yyw.gray(grp);
          }
        }
      } catch (error) {
        egret.error(error);
      }
    }
  }
}
