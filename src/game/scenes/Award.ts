namespace game {
  export class Award extends yyw.Base {
    private _mask: eui.Image;
    private modal: eui.Group;
    private btnOK: eui.Button;
    private btnKO: eui.Button;
    private tfdCoins: eui.BitmapLabel;
    private coins: number;

    // public async hideModal() {
    //   this.btnOK.visible = false;
    //   this.btnKO.visible = false;
    //   yyw.fadeOut(this._mask);
    //   await yyw.twirlOut(this.modal);
    // }

    protected destroy() {
      yyw.removeTweens(this._mask);
      yyw.removeTweens(this.modal);
      this._mask.visible = false;
      this.modal.visible = false;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      this.showModal();

      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, async () => {
          const { x, y } = this.modal.localToGlobal();
          if (await yyw.preReward("coin", {
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
            SceneManager.escape();
          }
        });

        yyw.onTap(this.btnKO, () => {
          SceneManager.escape();
        });
      }
    }

    private async showModal() {
      yyw.fadeIn(this._mask);
      await yyw.twirlIn(this.modal);
      this.btnOK.visible = true;
      this.btnKO.visible = true;
      this.coins = Math.floor(Math.random() * 99) + 1;
      this.tfdCoins.text = `${this.coins}`;
    }

    private async saveCoins() {
      CoinsSound.play();
      // TODO 入袋动画
      await yyw.award.save({
        coins: this.coins,
      });
    }
  }
}
