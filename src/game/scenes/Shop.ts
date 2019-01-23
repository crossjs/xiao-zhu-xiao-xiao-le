namespace game {
  export class Shop extends yyw.Base {
    private btnBack: eui.Group;
    private tfdCoins: eui.BitmapLabel;

    protected destroy(): void {
      // empty
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      try {
        const { coins } = await yyw.getPbl();
        this.tfdCoins.text = `${coins}`;
      } catch (error) {
        egret.error(error);
      }

      if (fromChildrenCreated) {
        yyw.onTap(this.btnBack, () => {
          SceneManager.escape();
        });

        this.initialized = true;
      }
    }
  }
}
