namespace game {
  export class Award extends yyw.Base {
    private _mask: eui.Image;
    private modal: eui.Group;
    private btnOK: eui.Button;
    private btnKO: eui.Button;
    private tfdCoins: eui.BitmapLabel;
    private coins: number;
    private sndCoins: CoinsSound = new CoinsSound();

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
          if (await yyw.preReward("coin")) {
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
      this.sndCoins.play();
      // TODO 入袋动画
      await yyw.award.save({
        coins: this.coins,
      });
    }
  }
}
