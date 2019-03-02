var game;
(function (game) {
    class LivesUp extends game.ToolBase {
        constructor() {
            super(...arguments);
            this.type = "livesUp";
            this.message = "获得道具：体力+1";
        }
        afterGet(amount) {
            yyw.emit("TOOL_USING", {
                type: this.type,
                confirm: () => {
                    this.increaseAmount(-amount);
                },
                cancel: () => {
                    super.afterGet(amount);
                },
            });
        }
    }
    game.LivesUp = LivesUp;
})(game || (game = {}));
