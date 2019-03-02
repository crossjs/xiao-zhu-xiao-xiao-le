var game;
(function (game) {
    class Breaker extends game.ToolBase {
        constructor() {
            super(...arguments);
            this.type = "breaker";
            this.message = "获得道具：击碎指定数字";
            this.dnd = true;
        }
    }
    game.Breaker = Breaker;
})(game || (game = {}));
