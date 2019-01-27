namespace game {
  export class Shop extends yyw.Base {
    private btnBack: eui.Group;
    // private btnPurchase0: eui.Button;
    // private btnPurchase1: eui.Button;
    // private btnPurchase2: eui.Button;
    // private btnPurchase3: eui.Button;
    private items: eui.Group;
    private tfdCoins: eui.BitmapLabel;
    private prices: number[] = [1000, 2000, 1500, 20000];
    private goods: string[] = ["valueUp", "shuffle", "breaker", "card"];

    public async exiting() {
      await yyw.rightOut(this);
    }

    public async entering() {
      await yyw.rightIn(this);
    }

    protected destroy(): void {
      // empty
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      await this.update();

      if (fromChildrenCreated) {
        yyw.eachChild(this.items, ((child: eui.Group, index: number) => {
          const visible: boolean = (yyw.CONFIG.shopStatus & 1) === 1 ? index < 3 : index === 3;
          if (visible) {
            child.visible = true;
            yyw.onTap(this[`btnPurchase${index}`], async () => {
              if (index === 3) {
                yyw.showToast("请访问公众号“游鱼玩”，发送消息“兑换”");
              } else {
                // 消费
                await yyw.saveAward({
                  coins: -this.prices[index],
                });
                yyw.showToast("购买成功");
                yyw.emit("TOOL_GAINED", {
                  type: this.goods[index],
                  amount: 1,
                });
                // 刷新
                await this.update();
              }
            });
          } else {
            egret.setTimeout(() => {
              yyw.removeChild(child);
            }, this, 0);
          }
        }));

        yyw.onTap(this.btnBack, () => {
          SceneManager.escape();
        });

        this.initialized = true;
      }
    }

    private async update() {
      try {
        const { coins } = await yyw.getPbl();
        this.tfdCoins.text = `${coins}`;
        for (let i = 0; i < 4; i++) {
          (this[`btnPurchase${i}`] as eui.Button).enabled = coins > this.prices[i];
        }
      } catch (error) {
        egret.error(error);
      }
    }
  }
}
