namespace game {
  export class Award extends yyw.Base {
    private modal: eui.Group;
    private btnOK: eui.Button;
    private btnKO: eui.Button;
    private tfdCoins: eui.BitmapLabel;
    private coins: number;
    private sndCoins: CoinsSound;

    public constructor() {
      super();
      this.sndCoins = new CoinsSound();
    }

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
    }

    protected createView(fromChildrenCreated?: boolean): void {
      this.showModal();
      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, async () => {
          if (await yyw.preReward()) {
            await this.saveCoins();
            SceneManager.escape();
          }
        });

        yyw.onTap(this.btnKO, () => {
          SceneManager.escape();
        });

        this.initialized = true;
      }
    }

    private async showModal() {
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

    private async saveCoins() {
      this.sndCoins.play();
      // TODO 入袋动画
      await yyw.saveAward({
        coins: this.coins,
      });
    }
  }
}