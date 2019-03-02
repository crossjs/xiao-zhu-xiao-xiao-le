var game;
(function (game) {
    class Shuffle extends game.ToolBase {
        constructor() {
            super(...arguments);
            this.type = "shuffle";
            this.message = "获得道具：重新排列数字";
        }
    }
    game.Shuffle = Shuffle;
})(game || (game = {}));
