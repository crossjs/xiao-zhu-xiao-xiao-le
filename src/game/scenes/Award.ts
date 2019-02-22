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
        this.tfdTip.text = `${ canVideo ? "观看视频" : "转发到群" }获得金币`;
        yyw.onTap(this.btnOK, async () => {
          const { x, y } = this.modal.localToGlobal();
          if (await yyw.reward.apply("coin", {
            share: {
              imageUrl: canvas.toTempFilePathSync({
                x,
                y,
                width: this.modal.width,
                height: this.modal.height,
                destWidth: 500,
                destHeight: 400,
              }),
            },
          })) {
            await this.saveCoins();
            yyw.director.escape();
          }
        });
      }

      this.showModal();
    }

    private async showModal() {
      yyw.fadeIn(this.bg);
      await yyw.twirlIn(this.modal);
      this.hdr.visible = true;
      this.tfdTip.visible = true;
      this.btnOK.visible = true;
      this.btnEscape.visible = true;
      this.coins = yyw.random(99) + 1;
      this.tfdCoins.text = `${this.coins}`;
    }

    private async saveCoins() {
      CoinsSound.play();
      // TODO 入袋动画
      await yyw.award.save({
        coins: this.coins,
      });
      yyw.emit("COINS_CHANGE", this.coins);
    }
  }
}
