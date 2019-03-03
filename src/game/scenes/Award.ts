namespace game {
  export class Award extends yyw.Base {
    private modal: eui.Group;
    private hdr: eui.Image;
    private tfdTip: eui.Label;
    private btnOK: eui.Button;
    private tfdCoins: eui.BitmapLabel;
    private coins: number;

    // public async hideModal() {
    //   this.btnOK.visible = false;
    //   this.btnKO.visible = false;
    //   yyw.fadeOut(this.bg);
    //   await yyw.twirlOut(this.modal);
    // }

    protected destroy() {
      yyw.removeTweens(this.bg);
      yyw.removeTweens(this.modal);
      this.bg.visible = false;
      this.modal.visible = false;
      this.hdr.visible = false;
      this.tfdTip.visible = false;
      this.btnOK.visible = false;
      this.btnEscape.visible = false;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        const canVideo = yyw.reward.can("coin", "video");
        this.tfdTip.text = `${ canVideo ? "观看视频" : "转发到群" }获得 10 倍奖励`;
        yyw.onTap(this.btnOK, async () => {
          const { windowWidth, windowHeight } = yyw.CONFIG.systemInfo;
          const { width, height } = this.main;
          const { x, y } = this.main.localToGlobal();
          const scaleX = windowWidth / 375;
          const scaleY = scaleX * windowHeight / 667;
          if (await yyw.reward.apply("coin", {
            share: {
              title: `噢耶！我挖到了 ${this.coins} 枚金币`,
              imageUrl: canvas.toTempFilePathSync({
                x,
                y,
                width: width * scaleX,
                height: height * scaleY,
                destWidth: 500,
                destHeight: 400,
              }),
              ald_desc: "magic",
            },
          })) {
            await this.saveCoins(10);
          }
        });
        yyw.onTap(this.btnEscape, async (e: egret.TouchEvent) => {
          e.stopImmediatePropagation();
          await this.saveCoins();
        });
      }

      // 防止多次调用
      if (!this.bg.visible) {
        this.showModal();
      }
    }

    private async showModal() {
      yyw.fadeIn(this.bg);
      await yyw.twirlIn(this.modal);
      this.hdr.visible = true;
      this.tfdTip.visible = true;
      this.btnOK.visible = true;
      this.btnEscape.visible = true;
      this.coins = yyw.random(100) + 200;
      this.tfdCoins.text = `${this.coins}`;
    }

    private async saveCoins(multiple: number = 1) {
      yyw.director.escape();
      CoinsSound.play();
      const coins = this.coins * multiple;
      // TODO 入袋动画
      await yyw.award.save({
        coins,
      });
      yyw.emit("COINS_GOT", {
        type: "magic",
        amount: coins,
      });
    }
  }
}
