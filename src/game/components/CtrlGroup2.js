var game;
(function (game) {
    class CtrlGroup2 extends yyw.Base {
        async createView(fromChildrenCreated) {
            super.createView(fromChildrenCreated);
            if (fromChildrenCreated) {
                yyw.on("ARENA_RUN", ({ data: running }) => {
                    this.enabled = !running;
                });
                yyw.onTap(this.btnCheckin, () => {
                    yyw.director.toScene("checkin", true);
                });
                yyw.onTap(this.btnBoard, () => {
                    yyw.director.toScene("ranking", true);
                });
            }
        }
    }
    game.CtrlGroup2 = CtrlGroup2;
})(game || (game = {}));
