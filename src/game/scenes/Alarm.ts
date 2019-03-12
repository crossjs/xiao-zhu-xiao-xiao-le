namespace game {
  export class Alarm extends yyw.Base {
    private hdr: eui.Image;
    private tfdTip: eui.Label;
    private btnOK: eui.Button;

    protected destroy() {
      yyw.removeTweens(this.bg);
      yyw.removeTweens(this.modal);
      this.bg.visible = false;
      this.modal.visible = false;
      this.hdr.visible = false;
      this.tfdTip.visible = false;
      this.btnOK.visible = false;
      this.btnEscape.visible = false;
      super.destroy();
    }

    protected async createView(fromChildrenCreated?: boolean): Promise<void> {
      super.createView(fromChildrenCreated);

      if (fromChildrenCreated) {
        const canVideo = yyw.reward.can("tool", "video");
        this.tfdTip.text = `${ canVideo ? "观看视频" : "转发到群" }获得剩余步数+2`;
        yyw.onTap(this.btnOK, async () => {
          if (await yyw.reward.apply("tool")) {
            yyw.emit("TOOL_GOT", {
              type: "stepsUp",
              amount: 2,
            });
            yyw.director.escape();
          }
        });
      }

      this.showModal();
    }

    private async showModal() {
      AlarmSound.play();
      yyw.fadeIn(this.bg);
      await yyw.twirlIn(this.modal);
      this.hdr.visible = true;
      this.tfdTip.visible = true;
      this.btnOK.visible = true;
      await yyw.sleep();
      this.btnEscape.visible = true;
    }
  }
}
