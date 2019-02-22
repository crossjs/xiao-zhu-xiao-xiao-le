namespace game {
  export class Alarm extends yyw.Base {
    private modal: eui.Group;
    private hdr: eui.Image;
    private btnOK: eui.Button;

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
      this.btnOK.visible = false;
      this.btnEscape.visible = false;
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        yyw.onTap(this.btnOK, async () => {
          if (await yyw.reward.apply("tool")) {
            yyw.emit("RANDOM_TOOL");
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
      this.btnOK.visible = true;
      this.btnEscape.visible = true;
    }
  }
}
