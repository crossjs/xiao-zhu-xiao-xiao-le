var game;
(function (game) {
    class ValueUp extends game.ToolBase {
        constructor() {
            super(...arguments);
            this.type = "valueUp";
            this.message = "获得道具：数字+1";
            this.dnd = true;
        }
    }
    game.ValueUp = ValueUp;
})(game || (game = {}));
