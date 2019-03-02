var game;
(function (game) {
    class Pbl extends yyw.Base {
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            try {
                const pbl = await yyw.pbl.me();
                Object.entries(pbl).forEach(([key, value]) => {
                    const field = this[`tfd${key.replace(/^\w/, ($0) => $0.toUpperCase())}`];
                    if (field) {
                        field.text = `${value}`;
                    }
                });
            }
            catch (error) {
                yyw.showToast("当前无数据");
            }
            if (fromChildrenCreated) {
                yyw.on("ARENA_RUN", ({ data: running }) => {
                    this.enabled = !running;
                });
                yyw.onTap(this.btnRestart, async () => {
                    if (await yyw.showModal("确定放弃当前进度？")) {
                        yyw.emit("RESTART");
                        yyw.analysis.onEnd("fail");
                    }
                });
            }
            yyw.analysis.addEvent("7进入场景", { s: "数据统计" });
        }
    }
    game.Pbl = Pbl;
})(game || (game = {}));
