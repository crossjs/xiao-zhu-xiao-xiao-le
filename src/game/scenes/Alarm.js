var game;
(function (game) {
    class Alarm extends yyw.Base {
        destroy() {
            yyw.removeTweens(this.bg);
            yyw.removeTweens(this.modal);
            this.bg.visible = false;
            this.modal.visible = false;
            this.hdr.visible = false;
            this.tfdTip.visible = false;
            this.btnOK.visible = false;
            this.btnEscape.visible = false;
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                const canVideo = yyw.reward.can("tool", "video");
                this.tfdTip.text = `${canVideo ? "观看视频" : "转发到群"}获得道具`;
                yyw.onTap(this.btnOK, async () => {
                    if (await yyw.reward.apply("tool")) {
                        yyw.emit("RANDOM_TOOL");
                        yyw.director.escape();
                    }
                });
            }
            this.showModal();
        }
        async showModal() {
            yyw.fadeIn(this.bg);
            await yyw.twirlIn(this.modal);
            this.hdr.visible = true;
            this.tfdTip.visible = true;
            this.btnOK.visible = true;
            this.btnEscape.visible = true;
        }
    }
    game.Alarm = Alarm;
})(game || (game = {}));
