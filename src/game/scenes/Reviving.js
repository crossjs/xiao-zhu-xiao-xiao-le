var game;
(function (game) {
    class Reviving extends yyw.Base {
        constructor() {
            super(...arguments);
            this.score = 0;
        }
        async initialize() {
            yyw.on("GAME_DATA", ({ data: { score } }) => {
                this.score = score;
            });
        }
        destroy() {
            this.removeTop3();
        }
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                const canVideo = yyw.reward.can("revive", "video");
                this.tfdTip.text = `${canVideo ? "观看视频" : "转发到群"}获得复活机会`;
                yyw.onTap(this.btnOK, async () => {
                    const type = await yyw.reward.apply("revive");
                    if (type) {
                        await yyw.director.escape();
                        yyw.emit("TOOL_GOT", {
                            type: "livesUp",
                            amount: 1,
                        });
                        yyw.analysis.onRunning("revive", type);
                    }
                    else {
                        yyw.showToast("复活失败");
                        await yyw.director.escape();
                        yyw.director.toScene("ending", true);
                    }
                });
                yyw.onTap(this.btnEscape, async () => {
                    await yyw.director.escape();
                    yyw.director.toScene("ending", true);
                });
            }
            this.tfdScore.text = `本局得分：${this.score}`;
            this.createTop3();
        }
        createTop3() {
            if (!this.bmpTop3) {
                const { width, height } = this.board;
                this.bmpTop3 = yyw.sub.createDisplayObject(null, width, height);
                this.board.addChild(this.bmpTop3);
                yyw.sub.postMessage({
                    command: "openTop3",
                    width,
                    height,
                });
            }
        }
        removeTop3() {
            yyw.removeElement(this.bmpTop3);
            this.bmpTop3 = null;
            yyw.sub.postMessage({
                command: "closeTop3",
            });
        }
    }
    game.Reviving = Reviving;
})(game || (game = {}));
