namespace game {
  export class Award extends yyw.Base {
    private modal: eui.Group;
    private btnAward: eui.Image;
    private btnOK: eui.Button;
    private btnKO: eui.Button;
    private tfdCoins: eui.BitmapLabel;
    private coins: number;

    public async showModal() {
      if (!yyw.CONFIG.adEnabled) {
        return;
      }
      yyw.fadeIn(this.bg);
      await yyw.twirlIn(this.modal);
      this.btnOK.visible = true;
      this.btnKO.visible = true;
      this.coins = Math.floor(Math.random() * 99) + 1;
      this.tfdCoins.text = `${this.coins}`;
    }

    public async hideModal() {
      this.btnOK.visible = false;
      this.btnKO.visible = false;
      yyw.fadeOut(this.bg);
      await yyw.twirlOut(this.modal);
    }

    protected destroy() {
      yyw.removeTweens(this.bg);
      yyw.removeTweens(this.modal);
      this.bg.visible = false;
      this.modal.visible = false;
    }

    protected createView(fromChildrenCreated?: boolean): void {
      if (fromChildrenCreated) {
        yyw.onTap(this.btnAward, () => {
          yyw.showToast("积分兑换：待实现");
        });

        yyw.onTap(this.btnKO, () => {
          this.hideModal();
        });

        // 广告启用
        if (yyw.CONFIG.adEnabled) {
          // 有 UnitId
          if (yyw.CONFIG.adUnitId) {
            yyw.onTap(this.btnOK, async () => {
              // 看完视频广告后领 coin
              const videoPlayed = await yyw.showVideoAd();
              if (videoPlayed) {
                await yyw.saveAward({
                  coins: this.coins,
                });
                await this.hideModal();
              } else {
                if (videoPlayed === false) {
                  yyw.showToast("完整看完广告才能🉐福包");
                } else {
                  // yyw.showToast("当前没有可以播放的广告");
                  // 转发后领 coin
                  if (await yyw.share()) {
                    await yyw.saveAward({
                      coins: this.coins,
                    });
                    await this.hideModal();
                  } else {
                    yyw.showToast("转发才能🉐福包");
                  }
                }
              }
            });
          } else {
            yyw.onTap(this.btnOK, async () => {
              // 转发后领 coin
              if (await yyw.share()) {
                await yyw.saveAward({
                  coins: this.coins,
                });
                await this.hideModal();
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
