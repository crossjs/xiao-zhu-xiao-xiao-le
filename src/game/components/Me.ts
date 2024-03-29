namespace game {
  export class Me extends yyw.Base {
    private avatar: eui.Image;

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this, () => {
          yyw.director.toScene("pbl", true);
        });
      }

      if (yyw.USER.avatarUrl) {
        try {
          this.avatar.source = await yyw.loadImage(yyw.USER.avatarUrl, true);
        } catch (error) {
          egret.error(error);
        }
      }
    }
  }
}
