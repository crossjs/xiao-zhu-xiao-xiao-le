namespace game {
  export class Award extends yyw.Base {
    private main: eui.Group;
    private btnAward: eui.Image;
    private btnClose: eui.Button;
    private btnMain: eui.Image;
    private tfdCoins: eui.BitmapLabel;
    private coins: number;

    public async show() {
      if (!yyw.CONFIG.adEnabled) {
        return;
      }
      this.coins = Math.floor(Math.random() * 99) + 1;
      this.tfdCoins.text = `${this.coins}`;
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
        yyw.onTap(this.btnAward, () => {
          yyw.showToast("积分兑换：待实现");
        });

        yyw.onTap(this.btnClose, () => {
          this.hide();
        });

        // 广告启用
        if (yyw.CONFIG.adEnabled) {
          // 有 UnitId
          if (yyw.CONFIG.adUnitId) {
            yyw.onTap(this.btnMain, async () => {
              // 看完视频广告后领金币福包
              const videoPlayed = await yyw.showVideoAd();
              if (videoPlayed) {
                await yyw.saveAward({
                  coins: this.coins,
                });
                await this.hide();
              } else {
                if (videoPlayed === false) {
                  yyw.showToast("完整看完广告才能🉐福包");
                } else {
                  yyw.showToast("当前没有可以播放的广告");
                }
              }
            });
          } else {
            yyw.onTap(this.btnMain, async () => {
              // 转发后领金币福包
              if (await yyw.share()) {
                await yyw.saveAward({
                  coins: this.coins,
                });
                await this.hide();
              } else {
                yyw.showToast("转发才能🉐福包");
              }
            });
          }
        }

        this.initialized = true;
      }
    }
  }
}
