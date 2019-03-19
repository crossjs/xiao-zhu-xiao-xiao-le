namespace game {
  export class Shop extends yyw.Base {
    private prices: number[] = [1000, 2000, 1500];
    private goods: string[] = ["valueUp", "sort", "breaker"];

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        // yyw.showToast("请访问公众号「游鱼玩」，发送消息「兑换」");
        for (let i = 0; i < this.goods.length; i++) {
          ((index) => {
            yyw.onTap(this[`btn${index}`], async () => {
              // 消费
              const type = this.goods[index];
              const coins = this.prices[index];
              try {
                await yyw.award.save({
                  coins: -coins,
                });
                yyw.emit("COINS_USED", {
                  type,
                  amount: coins,
                });
                yyw.showToast("兑换成功");
                yyw.emit("TOOL_GOT", {
                  type,
                  amount: 1,
                });
              } catch (error) {
                yyw.showToast("余额不足");
              } finally {
                // 刷新
                this.update();
              }
            });
          })(i);
        }
      }

      this.update();

      yyw.analysis.addEvent("9进入道具兑换");
    }

    private update() {
      try {
        const { coins } = yyw.USER;
        for (let i = 0; i < this.goods.length; i++) {
          const enabled = coins >= this.prices[i];
          const btn: eui.Button = this[`btn${i}`];
          const grp: eui.Group = this[`grp${i}`];
          btn.enabled = enabled;
          if (enabled) {
            yyw.nude(grp);
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
